import { Configuration, OpenAIApi } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function generateImagePrompt(name: string) {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system", // first role used by the system
          content:
            "You are a creative and helpful AI assistant capable of generating interesting thumbnail descriptions for my notes. Your output will be fetched into the DALLE API to generate a thumbnail. The description should be minimalistic and flat styled.",
        },
        {
          role: "user", // user request
          content: `Please geenrate a thumbnail description for my notebook titled ${name}`,
        },
      ],
    });

    const data = await response.json();

    return "some image description because I do not want to pay for a test project";

    // this will work if you have enough credits on your OpenAi Account

    // const imageDescription = data.choices[0].message.content;
    // return imageDescription as string;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function generateImage(imageDescription: string) {
  try {
    const response = await openai.createImage({
      prompt: imageDescription,
      n: 1,
      size: "256x256",
    });

    const data = await response.json();

    return "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

    // this will work if you have enough credits on your OpenAi Account
    // const imageUrl = data.data[0].url;
    // return imageUrl as string;
  } catch (error) {
    console.error(error);
  }
}
