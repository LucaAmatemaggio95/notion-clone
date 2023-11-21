import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  return new NextResponse(
    " Boilerplate text because I am poor and I do not have any OpenAI credits "
  );

  // this will work if you have enough credits on the OpenAI API
  
  // extract the prompt from the body
  //   const { prompt } = await req.json();

  //   const response = await openai.createChatCompletion({
  //     model: "gpt-3.5-turbo",
  //     messages: [
  //       {
  //         role: "system",
  //         content:
  //           "You are a helpful AI embedded in a notion text editor app that is used to autocomplete sentences.",
  //       },
  //       {
  //         role: "user",
  //         content: `I am writing a piece of text in a notion text editor app.
  //         Help me complete my train of thought here: ##${prompt}##
  //         Keep the tone consistent with the rest of the text.
  //         Keep the response short.`,
  //       },
  //     ],
  //     stream: true,
  //   });

  //   const stream = OpenAIStream(response);
  //   return new StreamingTextResponse(stream);
}
