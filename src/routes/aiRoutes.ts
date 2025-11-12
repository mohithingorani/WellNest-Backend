import { Router } from "express";
const router = Router();
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({});

router.post("/", async (req, res) => {
  const { context, usermessage,aimessage }: { context: string; usermessage: string,aimessage:string } = req.body;

  try {
    console.log("Generating Summary:");
    const contextResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
      I am giving you a brief summary of text and new conversation and you have to add the text into the summary if you find it necessary and create new summary so i can pass that summary in the next conversation.include important dependency and information like name or symptomps or feelings or whatever you might feel like is important to take in context in later conversation. previous summary: ${context}
      new userMessage: ${usermessage},
      last aimessage:${aimessage}
    `,
    });
    const summary = contextResponse.text;
    console.log("Summary = ",summary);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
      You are a content generator for my website.
      Please provide clear, concise, and engaging text responses based on the input prompt.
      You are a therapist who provides online therapy. Be very friendly and supportive.
      Only output plain text.
      Keep responses relatively short (chat-style) and informal but like a therapist. Max 25 words.
      Ask questions if you need more information or give a reply if you think is appropriate
      Make sure the response is suitable for a general audience.
      I am providing you the summary of your chat till now and last text you have to give reply to. Summary : ${summary}, LastText : ${usermessage}
    `,
    });

    const text = response.text;
    console.log("response=",text);
    res.json({
      text,
      summary
    });
  } catch (error) {
    res.json({
      error,
    });
  }
});

export default router;
