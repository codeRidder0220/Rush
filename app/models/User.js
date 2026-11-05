
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    bestScore: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 500,
    },

    dailyStreak: {
      type: Number,
      default: 0,
    },

    lastStreakDate: {
      type: String,
      default: null,
    },
    maxStreak: {
      type: Number,
      default: 0,
    },

    // User ka selected emoji avatar
    avatar: {
      type: String,
      enum: [
        "🦉", "🐸", "🦊", "🐼", "🐵", "🐱",
        "🦁", "🦖", "👽", "🤖", "👻", "🦄",
        "💀", "🥷", "🤡", "🐧", "🦝", "🐻",
      ],
      default: "🦉",
    },

    // Har completed ya ended game ke baad rating snapshot
    ratingHistory: {
      type: [
        {
          rating: {
            type: Number,
            required: true,
          },
          playedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const User =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;
