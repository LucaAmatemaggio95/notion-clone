"use client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";

type Props = {};

const CreateNoteDialog = (props: Props) => {
  const [input, setInput] = useState("");
  const router = useRouter();

  const createNoteBook = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/createNoteBook", {
        name: input,
      });
      return response.data;
    },
  });

  const uploadToFirebase = useMutation({
    mutationFn: async (noteId: number) => {
      const response = await axios.post("/api/uploadToFirebase", {
        noteId
      })
      return response.data
    }
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input === "" || input === null) {
      return;
    }
    createNoteBook.mutate(undefined, {
      onSuccess: ({ noteId }) => {
        console.log("yay note created:", noteId);
        // update the imageUrl from Firebase
        uploadToFirebase.mutate(noteId);
        router.push(`/notebook/${noteId}`);
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex border-dashed border-2 border-green-600 h-full rounded-lg items-center justify-center sm:flex-col hover:shadow-xl transition hover:translate-y-1 flex-row p-4">
          <Plus className="w-6 h-6 text-green-600" strokeWidth={3} />
          <h2 className="font-semibold text-green-600 sm:mt-2">
            New Note Book
          </h2>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Note Book</DialogTitle>
          <DialogDescription>
            You can create a new note by clicking the button below
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Name..."
          />
          <div className="h-4"></div>
          <div className="flex item-center gap-2">
            <Button type="reset" variant={"secondary"}>
              Cancel
            </Button>
            <Button
              disabled={createNoteBook.isPending}
              type="submit"
              className="bg-green-600"
            >
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNoteDialog;
