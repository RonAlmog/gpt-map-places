import OpenAI from "openai";
import dotenv from "dotenv";
import { NextResponse } from "next/server";

dotenv.config();

const openai = new OpenAI();

export async function POST(req: Request) {
  const formData = await req.json();

  try {
    const gpt4Completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You only return in JSON a coordinates key with value in this format [43.6426, -79.3871], then a title of the location with a title key",
        },
        { role: "user", content: formData.value },
      ],
    });

    // get the text response
    const responseText = gpt4Completion.choices[0]?.message?.content;
    // check if it looks like json
    if (responseText && responseText[0] === "{") {
      const jsonResult = JSON.parse(responseText);
      console.log({ jsonResult });
      return NextResponse.json(jsonResult, { status: 200 });
    } else {
      return NextResponse.json({ tryAgain: true }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
