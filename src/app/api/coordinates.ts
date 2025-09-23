import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI();

export default async function handler(req: any, res: any) {
  try {
    const gpt4Completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You only return in JSON a coordinates key with value in this format [43.6426, -79.3871], then a title of the location with a title key",
        },
        { role: "user", content: req.body.value },
      ],
    });

    // get the text response
    const responseText = gpt4Completion.choices[0]?.message?.content;
    // check if it looks like json
    if (responseText && responseText[0] === "{") {
      const jsonResult = JSON.parse(responseText);
      res.status(200).json(jsonResult);
      console.log({ jsonResult });
    } else {
      res.status(200).json({ tryAgain: true });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}
