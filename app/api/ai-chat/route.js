
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb.js";
import Content from "../../models/Content.js";

export async function POST(request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key is missing" },
        { status: 500 }
      );
    }

    await connectDB();

    const games = await Content.find({ status: "published" })
      .select("title passage passageDifficulty contentType")
      .limit(20)
      .lean();

    const gameContext = games.map((game) => ({
      title: game.title,
      passage: (game.passage || "").slice(0, 3000),
      difficulty: game.passageDifficulty,
      contentType: game.contentType,
    }));

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: `
RUSH ARCADE published games information:
${JSON.stringify(gameContext)}

User question:
${message}
`,
      config: {
        systemInstruction: `
You are RUSH AI, the official gaming assistant of RUSH ARCADE.

Use the provided published game information to answer questions about game rules, instructions, difficulty and gameplay.

Important rules:
- Answer in the user's language, Hindi or English.
- Use actual game information provided above.
- Never invent game rules or instructions.
- If the requested game's rules are not available in the provided information, clearly say that you don't have those details.
- Never reveal correct answers, answer keys or hidden quiz solutions.
- Keep answers friendly, clear and concise.
`,
      },
    });

    return NextResponse.json({
      reply: response.text || "I couldn't generate a response.",
    });
  } catch (error) {
    console.error("RUSH AI error:", error);

    return NextResponse.json(
      { error: "AI is temporarily unavailable. Please try again." },
      { status: 500 }
    );
  }
}
