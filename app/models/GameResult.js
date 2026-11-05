
import mongoose from "mongoose";

const gameResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    content: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content",
      required: true,
    },

    score: {
      type: Number,
      required: true,
      default: 0,
    },

    correctAnswers: {
      type: Number,
      default: 0,
    },

    wrongAnswers: {
      type: Number,
      default: 0,
    },

    livesRemaining: {
      type: Number,
      default: 3,
      min: 0,
      max: 3,
    },

    // Total elapsed time for the whole game, in seconds.
    completionTime: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    // Time spent answering or skipping questions, in seconds.
    questionTime: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Time spent reading the passage, in seconds.
    readingTime: {
      type: Number,
      default: 0,
      min: 0,
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    finishedAt: {
      type: Date,
      default: null,
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const GameResult =
  mongoose.models.GameResult ||
  mongoose.model("GameResult", gameResultSchema);

export default GameResult;
