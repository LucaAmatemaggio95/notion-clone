import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { uploadFileToFirebase } from "@/lib/firebase";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { noteId } = await req.json();
    // extract the DALLE imageUrl
    // save the image to Firebase
    // update the note with the Firebase url
    const notes = await db
      .select()
      .from($notes)
      .where(eq($notes.id, parseInt(noteId)));

    if (!notes[0].imageUrl) {
      return new NextResponse("No image url", { status: 400 });
    }

    // get the imageUrl inside Firebase
    const firebaseUrl = await uploadFileToFirebase(
      notes[0].imageUrl,
      notes[0].name
    );

    await db
      .update($notes)
      .set({
        imageUrl: firebaseUrl,
      })
      .where(eq($notes.id, parseInt(noteId)));

    return new NextResponse("Note image updated", { status: 200 });
  } catch (error) {
    return NextResponse.json({ error, status: 500 });
  }
}
