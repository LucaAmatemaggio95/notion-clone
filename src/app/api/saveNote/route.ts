import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { noteId, editorState } = body;
    if (!noteId || !editorState) {
      return new NextResponse("Missing some parameters", { status: 500 });
    }

    const id = parseInt(noteId);

    const notes = await db.select().from($notes).where(eq($notes.id, id));

    if (notes.length != 1) {
      return new NextResponse("Failed to update", { status: 500 });
    }

    const note = notes[0];
    // update the editorState only if its different from the one already saved
    if (note.editorState !== editorState) {
      await db
        .update($notes)
        .set({
          editorState,
        })
        .where(eq($notes.id, id));
    }

    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}
