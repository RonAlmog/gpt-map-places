import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI();

export default async function handler(req: Request, res: any) {
  try {
    const gpt4Completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You only return in JSON a coordinates key with value in this format [43.6426, -79.3871], then a title of the location with a title key",
        },
      ],
    });
  } catch (error) {}
}
