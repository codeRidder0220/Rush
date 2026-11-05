
"use server";

import connectDB from "../lib/mongodb.js";
import { getCurrentUser } from "../lib/auth.js";
import User from "../app/models/User.js";

const ALLOWED_AVATARS = [
    "🦉", "🐸", "🦊", "🐼", "🐵", "🐱",
    "🦁", "🦖", "👽", "🤖", "👻", "🦄",
    "💀", "🥷", "🤡", "🐧", "🦝", "🐻",
];

export async function updateAvatar(avatar) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return { success: false, message: "Please login first." };
        }

        if (!ALLOWED_AVATARS.includes(avatar)) {
            return { success: false, message: "Invalid avatar selected." };
        }

        const userId =
            currentUser._id ?? currentUser.id ?? currentUser.userId;

        if (!userId) {
            return { success: false, message: "User not found." };
        }

        await connectDB();

        const user = await User.findById(userId);

        if (!user) {
            return { success: false, message: "User not found." };
        }

        user.avatar = avatar;
        await user.save();


        const savedUser = await User.findById(user._id)
            .select("username avatar")
            .lean();

        console.log("AVATAR SAVED IN DATABASE:", savedUser?.avatar);
        console.log("DATABASE DOCUMENT:", savedUser);

        return {
            success: true,
            avatar: savedUser?.avatar,
        };
    } catch (error) {
        console.error("Avatar update failed:", error);
        return {
            success: false,
            message: "The avatar wasn't saved. Please try again.",
        };
    }
}
