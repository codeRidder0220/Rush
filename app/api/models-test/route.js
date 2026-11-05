
import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb.js";

import User from "@/app/models/User.js";
import Content from "@/app/models/Content.js";
import GameResult from "@/app/models/GameResult.js";

export async function GET() {
  try {
    await connectDB();

    return NextResponse.json({
      success: true,
      message: "Database and models verified",
      models: {
        User: User.modelName,
        Content: Content.modelName,
        GameResult: GameResult.modelName,
      },
    });
  } catch (error) {
    console.error("Model test failed:", error.message);

    return NextResponse.json(
      {
        success: false,
        message: "Model verification failed",
      },
      { status: 500 }
    );
  }
}
