import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { generateImage, generateImagePrompt } from "@/lib/openai";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { name } = body;

  const imageDescription = await generateImagePrompt(name);

  console.log({ imageDescription });

  if (!imageDescription) {
    return new NextResponse("Failed to generate image description", {
      status: 500,
    });
  }

  const imageUrl = await generateImage(imageDescription);

  if (!imageUrl) {
    return new NextResponse("Failed to generate image", {
      status: 500,
    });
  }

  // insert will return an array of notes
  const notesId = await db
    .insert($notes)
    .values({
      name,
      userId,
      imageUrl,
    })
    .returning({
      insertedId: $notes.id,
    });

  return NextResponse.json({
    noteId: notesId[0].insertedId,
  });
}
