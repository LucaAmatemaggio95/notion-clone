"use client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

type Props = {
  noteId: number;
};

const DeleteButton = ({ noteId }: Props) => {
  const router = useRouter();

  const deleteNote = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/deleteNote", {
        noteId,
      });
      return response.data;
    },
  });

  const handleDelete = () => {
    deleteNote.mutate(undefined, {
      onSuccess: () => {
        router.push("/dashboard");
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };

  return (
    <Button
      disabled={deleteNote.isPending}
      variant={"destructive"}
      size={"sm"}
      onClick={handleDelete}
    >
      <Trash />
    </Button>
  );
};

export default DeleteButton;
