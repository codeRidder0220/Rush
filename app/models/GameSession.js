
import mongoose from "mongoose";

const gameSessionSchema = new mongoose.Schema(
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
            default: 0,
        },

        newPersonalBest: {
            type: Boolean,
            default: false,
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

        attemptedQuestionIds: {
            type: [String],
            default: [],
        },


        attempts: {
            type: [
                {
                    questionId: {
                        type: String,
                        required: true,
                    },
                    difficulty: {
                        type: String,
                        enum: ["Easy", "Medium", "Hard", "Boss"],
                        required: true,
                    },
                    correct: {
                        type: Boolean,
                        default: false,
                    },
                    skipped: {
                        type: Boolean,
                        default: false,
                    },
                },
            ],
            default: [],
        },


        ratingApplied: {
            type: Boolean,
            default: false,
        },



        startedAt: {
            type: Date,
            default: Date.now,
        },

        readingEndsAt: {
            type: Date,
            required: true,
        },

        questionStartedAt: {
            type: Date,
            default: null,
        },

        questionTime: {
            type: Number,
            default: 0,
            min: 0,
        },

        status: {
            type: String,
            enum: ["reading", "questions", "finished"],
            default: "reading",
        },

        finishedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

const GameSession =
    mongoose.models.GameSession ||
    mongoose.model("GameSession", gameSessionSchema);

export default GameSession;
