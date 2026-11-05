
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["mcq", "written"],
      required: true,
    },

    options: {
      type: [String],
      default: [],
    },

    correctAnswer: {
      type: String,
      required: true,
    },

    acceptedAnswers: {
      type: [String],
      default: [],
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard", "Boss"],
      required: true,
    },
  },
  { _id: true }
);

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    contentType: {
      type: String,
      enum: ["text", "image"],
      required: true,
    },

    passage: {
      type: String,
      default: "",
    },

    imageUrl: {
      type: String,
      default: "",
    },

    passageDifficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard", "Very Hard"],
      required: true,
    },

    questions: {
      type: [questionSchema],
      validate: {
        validator: (questions) => questions.length >= 6 && questions.length <= 7,
        message: "Content must contain 6–7 questions",
      },
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  { timestamps: true }
);

const Content = mongoose.models.Content || mongoose.model("Content", contentSchema);
  

export default Content;
