"use client";
import { NoteType } from "@/lib/db/schema";
import { useDebounce } from "@/lib/useDebounce";
import { useMutation } from "@tanstack/react-query";
import Text from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useCompletion } from "ai/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import TipTapMenuBar from "./TipTapMenuBar";
import { Button } from "./ui/button";

type Props = { note: NoteType };

const TipTapEditor = ({ note }: Props) => {
  const [editorState, setEditorState] = useState(note.editorState ?? "");

  const { complete, completion } = useCompletion({
    api: "/api/completion",
  });

  const saveNote = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/saveNote", {
        noteId: note.id,
        editorState,
      });
      return response.data;
    },
  });

  const customText = Text.extend({
    addKeyboardShortcuts() {
      return {
        "Shift-a": () => {
          // take the last 30 words
          const prompt = this.editor.getText().split(" ").slice(-30).join(" ");
          complete(prompt);
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit, customText],
    content: editorState,
    onUpdate: ({ editor }) => {
      setEditorState(editor.getHTML());
    },
  });

  // last completion from GPT
  const lastCompletion = useRef("");

  useEffect(() => {
    if (!completion || !editor) {
      return;
    }
    // token coming from GPT -> is the last word
    const diff = completion.slice(lastCompletion.current.length);
    lastCompletion.current = completion;
    // insert text gradually into the editor
    editor.commands.insertContent(diff);
  }, [completion, editor]);

  const debouncedEditorState = useDebounce(editorState, 500);

  useEffect(() => {
    if (debouncedEditorState === "") {
      return;
    }

    saveNote.mutate(undefined, {
      onSuccess: (data) => {
        console.log("Updated successfully", data);
      },
      onError: (error) => {
        console.error(error);
      },
    });
  }, [debouncedEditorState]);

  return (
    <>
      <div className="flex">
        {editor && <TipTapMenuBar editor={editor} />}
        <Button disabled variant={"outline"}>
          {saveNote.isPending ? "Saving..." : "Saved"}
        </Button>
      </div>
      <div className="prose prose-sm w-full mt-4">
        <EditorContent editor={editor} />
      </div>

      <div className="h-4"></div>
      <span className="text-sm">
        Tip: Press
        <kbd className="mx-2 px-1 py-1.5 text-xs font-semibold bg-gray-100 border border-gray-200 rounded-lg">
          Shift + A
        </kbd>
        for AI autocomplete
      </span>
    </>
  );
};

export default TipTapEditor;
