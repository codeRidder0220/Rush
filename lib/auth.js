import { redirect } from "next/navigation";

import "server-only";

import crypto from "crypto";
import { cookies } from "next/headers";

import connectDB from "./mongodb.js";
import Session from "../app/models/session.js";
import User from "../app/models/User.js";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("rush_session")?.value;

    // Cookie nahi hai, toh logged-in user nahi hai
    if (!token) {
      return null;
    }

    // Cookie token ka hash banao
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    await connectDB();

    // Valid aur unexpired session search karo
    const session = await Session.findOne({
      tokenHash,
      expiresAt: { $gt: new Date() },
    });

    if (!session) {
      return null;
    }

    // Session se linked user find karo
    const user = await User.findById(session.user)
      .select("_id username email role bestScore dailyStreak avatar rating createdAt")
      .lean();

    if (!user) {
      return null;
    }

    // Sirf zaroori user data return karo
    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      bestScore: user.bestScore,
      dailyStreak: user.dailyStreak,
      avatar: user.avatar ?? "🦉",
      rating: user.rating ?? 500,
      createdAt: user.createdAt,
    };
  } catch (error) {
    console.error("Get current user error:", error.message);
    return null;
  }
}



export async function requireAdmin() {
  const user = await getCurrentUser();

  // Login nahi hai ya session invalid hai
  if (!user) {
    redirect("/login");
  }

  // Logged-in hai, lekin admin nahi hai
  if (user.role !== "admin") {
    redirect("/");
  }

  return user;
}

