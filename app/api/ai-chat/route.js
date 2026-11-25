
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb.js";
import Content from "../../models/Content.js";

// Gemini temporary busy hone par automatic retry
async function generateWithRetry(ai, options) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      return await ai.models.generateContent(options);
    } catch (error) {
      const status = Number(error.status || error.code);

      if (![429, 503].includes(status) || attempt === 3) {
        throw error;
      }

      console.log(
        `Gemini busy. Retry attempt ${attempt + 1}/3`
      );

      await new Promise((resolve) =>
        setTimeout(resolve, attempt * 2000)
      );
    }
  }
}

export async function POST(request) {
  try {
    const { message } = await request.json();

    if (
      !message ||
      typeof message !== "string" ||
      !message.trim()
    ) {
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

    const games = await Content.find({
      status: "published",
    })
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

    const response = await generateWithRetry(ai, {
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

    const status = Number(error.status || error.code);

    if (status === 503 || status === 429) {
      return NextResponse.json(
        {
          error:
            "RUSH AI is experiencing high demand. Please try again in a few seconds.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: "AI is temporarily unavailable. Please try again.",
      },
      { status: 500 }
    );
  }
}
