
"use server";

import { revalidatePath } from "next/cache";
import connectDB from "../lib/mongodb.js";
import { requireAdmin } from "../lib/auth.js";
import Content from "../app/models/Content.js";

const passageDifficulties = ["Easy", "Medium", "Hard", "Very Hard"];
const questionDifficulties = ["Easy", "Medium", "Hard", "Boss"];

//create content...
export async function createContent(data) {
  try {
    // Only an authenticated admin can create content.
    await requireAdmin();

    if (!data || typeof data !== "object") {
      return { success: false, message: "Invalid form data." };
    }

    const title =
      typeof data.title === "string" ? data.title.trim() : "";

    const contentType = data.contentType;
    const passageDifficulty = data.passageDifficulty;
    const status = "draft";

    if (!title || title.length > 150) {
      return {
        success: false,
        message: "Title is required and must be under 150 characters.",
      };
    }

    if (!["text", "image"].includes(contentType)) {
      return { success: false, message: "Invalid content type." };
    }

    if (!passageDifficulties.includes(passageDifficulty)) {
      return { success: false, message: "Invalid passage difficulty." };
    }

    //  Validate the passage or image URL.
    let passage = "";
    let imageUrl = "";

    if (contentType === "text") {
      passage =
        typeof data.passage === "string" ? data.passage.trim() : "";

      if (!passage) {
        return { success: false, message: "Passage is required." };
      }
    } else {
      imageUrl =
        typeof data.imageUrl === "string" ? data.imageUrl.trim() : "";

      try {
        const url = new URL(imageUrl);

        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error("Invalid protocol");
        }
      } catch {
        return {
          success: false,
          message: "Please enter a valid HTTP or HTTPS image URL.",
        };
      }
    }

    // 3. A content item must contain 6–7 questions.
    if (
      !Array.isArray(data.questions) ||
      data.questions.length < 6 ||
      data.questions.length > 7
    ) {
      return {
        success: false,
        message: "Content must contain 6 or 7 questions.",
      };
    }

    const questions = [];

    for (const question of data.questions) {
      const questionText =
        typeof question.questionText === "string"
          ? question.questionText.trim()
          : "";

      if (!questionText) {
        return {
          success: false,
          message: "Every question must have question text.",
        };
      }

      if (
        !["mcq", "written"].includes(question.type) ||
        !questionDifficulties.includes(question.difficulty)
      ) {
        return {
          success: false,
          message: "Invalid question type or difficulty.",
        };
      }

      if (question.type === "mcq") {
        const options = Array.isArray(question.options)
          ? question.options.map((option) =>
              typeof option === "string" ? option.trim() : ""
            )
          : [];

        const correctAnswer =
          typeof question.correctAnswer === "string"
            ? question.correctAnswer.trim()
            : "";

        if (
          options.length !== 4 ||
          options.some((option) => !option) ||
          !correctAnswer ||
          !options.includes(correctAnswer)
        ) {
          return {
            success: false,
            message: "Each MCQ needs 4 options and a valid correct answer.",
          };
        }

        questions.push({
          questionText,
          type: "mcq",
          options,
          correctAnswer,
          acceptedAnswers: [],
          difficulty: question.difficulty,
        });
      } else {
        const acceptedAnswers = (
          typeof question.acceptedAnswers === "string"
            ? question.acceptedAnswers
            : ""
        )
          .split("\n")
          .map((answer) => answer.trim())
          .filter(Boolean);

        if (acceptedAnswers.length === 0) {
          return {
            success: false,
            message: "Each written question needs at least one accepted answer.",
          };
        }

        questions.push({
          questionText,
          type: "written",
          options: [],
          correctAnswer: acceptedAnswers[0],
          acceptedAnswers,
          difficulty: question.difficulty,
        });
      }
    }

    // Save only after authorization and validation succeed.
    await connectDB();

    await Content.create({
      title,
      contentType,
      passage,
      imageUrl,
      passageDifficulty,
      questions,
      status,
    });

    revalidatePath("/admin");
    revalidatePath("/admin/content");

    return {
      success: true,
      message: "Content saved successfully as a draft!",
    };
  } catch (error) {
    // Preserve Next.js redirects from requireAdmin().
    if (error?.message === "NEXT_REDIRECT") {
      throw error;
    }

    console.error("Create content error:", error);

    return {
      success: false,
      message: "Unable to save content. Please check the form and try again.",
    };
  }
}


//update content status...
export async function updateContentStatus(id, status) {
  try {
    await requireAdmin();

    // Validate the content ID
    if (!id || !/^[a-f\d]{24}$/i.test(id)) {
      return {
        success: false,
        message: "Invalid content ID.",
      };
    }

    // Only these two statuses are allowed
    if (!["draft", "published"].includes(status)) {
      return {
        success: false,
        message: "Invalid content status.",
      };
    }

    await connectDB();

    const content = await Content.findById(id);

    if (!content) {
      return {
        success: false,
        message: "Content not found.",
      };
    }

    // A passage can be published only with 6–7 questions
    if (
      status === "published" &&
      (!Array.isArray(content.questions) ||
        content.questions.length < 6 ||
        content.questions.length > 7)
    ) {
      return {
        success: false,
        message: "Content must have 6–7 questions before publishing.",
      };
    }

    content.status = status;
    await content.save();

    revalidatePath("/admin");
    revalidatePath("/admin/manage-content");

    return {
      success: true,
      message:
        status === "published"
          ? "Content published successfully."
          : "Content moved to drafts.",
    };
  } catch (error) {
    if (error?.message === "NEXT_REDIRECT") {
      throw error;
    }

    console.error("Update content status error:", error);

    return {
      success: false,
      message: "Unable to update content status.",
    };
  }
}


//update content...
export async function updateContent(id, data) {
  try {
    await requireAdmin();

    if (!id || !/^[a-f\d]{24}$/i.test(id)) {
      return { success: false, message: "Invalid content ID." };
    }

    if (!data || typeof data !== "object") {
      return { success: false, message: "Invalid form data." };
    }

    const title =
      typeof data.title === "string" ? data.title.trim() : "";

    const contentType = data.contentType;
    const passageDifficulty = data.passageDifficulty;

    if (!title || title.length > 150) {
      return {
        success: false,
        message: "Title is required and must be under 150 characters.",
      };
    }

    if (!["text", "image"].includes(contentType)) {
      return { success: false, message: "Invalid content type." };
    }

    if (!passageDifficulties.includes(passageDifficulty)) {
      return { success: false, message: "Invalid passage difficulty." };
    }

    let passage = "";
    let imageUrl = "";

    if (contentType === "text") {
      passage =
        typeof data.passage === "string" ? data.passage.trim() : "";

      if (!passage) {
        return { success: false, message: "Passage is required." };
      }
    } else {
      imageUrl =
        typeof data.imageUrl === "string" ? data.imageUrl.trim() : "";

      try {
        const url = new URL(imageUrl);

        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error("Invalid protocol");
        }
      } catch {
        return {
          success: false,
          message: "Please enter a valid HTTP or HTTPS image URL.",
        };
      }
    }

    if (
      !Array.isArray(data.questions) ||
      data.questions.length < 6 ||
      data.questions.length > 7
    ) {
      return {
        success: false,
        message: "Content must contain 6 or 7 questions.",
      };
    }

    const questions = [];

    for (const question of data.questions) {
      const questionText =
        typeof question.questionText === "string"
          ? question.questionText.trim()
          : "";

      if (!questionText) {
        return {
          success: false,
          message: "Every question must have question text.",
        };
      }

      if (
        !["mcq", "written"].includes(question.type) ||
        !questionDifficulties.includes(question.difficulty)
      ) {
        return {
          success: false,
          message: "Invalid question type or difficulty.",
        };
      }

      if (question.type === "mcq") {
        const options = Array.isArray(question.options)
          ? question.options.map((option) =>
              typeof option === "string" ? option.trim() : ""
            )
          : [];

        const correctAnswer =
          typeof question.correctAnswer === "string"
            ? question.correctAnswer.trim()
            : "";

        if (
          options.length !== 4 ||
          options.some((option) => !option) ||
          !correctAnswer ||
          !options.includes(correctAnswer)
        ) {
          return {
            success: false,
            message: "Each MCQ needs 4 options and a valid correct answer.",
          };
        }

        questions.push({
          questionText,
          type: "mcq",
          options,
          correctAnswer,
          acceptedAnswers: [],
          difficulty: question.difficulty,
        });
      } else {
        const acceptedAnswers = (
          typeof question.acceptedAnswers === "string"
            ? question.acceptedAnswers.split("\n")
            : Array.isArray(question.acceptedAnswers)
              ? question.acceptedAnswers
              : []
        )
          .map((answer) =>
            typeof answer === "string" ? answer.trim() : ""
          )
          .filter(Boolean);

        if (acceptedAnswers.length === 0) {
          return {
            success: false,
            message:
              "Each written question needs at least one accepted answer.",
          };
        }

        questions.push({
          questionText,
          type: "written",
          options: [],
          correctAnswer: acceptedAnswers[0],
          acceptedAnswers,
          difficulty: question.difficulty,
        });
      }
    }

    await connectDB();

    const content = await Content.findById(id);

    if (!content) {
      return { success: false, message: "Content not found." };
    }

    // Update existing fields, but preserve its status and MongoDB ID.
    content.title = title;
    content.contentType = contentType;
    content.passageDifficulty = passageDifficulty;
    content.passage = passage;
    content.imageUrl = imageUrl;
    content.questions = questions;

    await content.save();

    revalidatePath("/admin");
    revalidatePath("/admin/content");
    revalidatePath("/admin/manage-content");
    revalidatePath(`/admin/manage-content/${id}/edit`);

    return {
      success: true,
      message: "Content updated successfully!",
    };
  } catch (error) {
    if (error?.message === "NEXT_REDIRECT") {
      throw error;
    }

    console.error("Update content error:", error);

    return {
      success: false,
      message: "Unable to update content. Please try again.",
    };
  }
}

//delete content...

export async function deleteContent(id) {
  try {
    await requireAdmin();

    if (!id || !/^[a-f\d]{24}$/i.test(id)) {
      return {
        success: false,
        message: "Invalid content ID.",
      };
    }

    await connectDB();

    const content = await Content.findById(id);

    if (!content) {
      return {
        success: false,
        message: "Content not found.",
      };
    }

    await Content.findByIdAndDelete(id);

    revalidatePath("/admin");
    revalidatePath("/admin/manage-content");
    revalidatePath("/admin/content");

    return {
      success: true,
      message: "Content deleted successfully.",
    };
  } catch (error) {
    if (error?.message === "NEXT_REDIRECT") {
      throw error;
    }

    console.error("Delete content error:", error);

    return {
      success: false,
      message: "Unable to delete content. Please try again.",
    };
  }
}

