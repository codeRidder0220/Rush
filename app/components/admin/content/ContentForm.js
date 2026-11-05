
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  createContent,
  updateContent,
} from "../../../../actions/content.js";

import ContentDetails from "./ContentDetails.js";
import QuestionList from "./QuestionList.js";

function createInitialQuestions() {
  return Array.from({ length: 6 }, (_, index) => ({
    id: `initial-question-${index + 1}`,
    questionText: "",
    type: "mcq",
    options: ["", "", "", ""],
    correctAnswer: "",
    acceptedAnswers: "",
    difficulty: "Easy",
  }));
}

function prepareQuestions(existingQuestions) {
  if (!Array.isArray(existingQuestions) || existingQuestions.length === 0) {
    return [createInitialQuestions()[0]];
  }

  return existingQuestions.map((question, index) => ({
    id: question._id?.toString() || `existing-question-${index + 1}`,
    questionText: question.questionText || "",
    type: question.type || "mcq",
    options:
      Array.isArray(question.options) && question.options.length === 4
        ? [...question.options]
        : ["", "", "", ""],
    correctAnswer: question.correctAnswer || "",
    acceptedAnswers: Array.isArray(question.acceptedAnswers)
      ? question.acceptedAnswers.join("\n")
      : question.acceptedAnswers || "",
    difficulty: question.difficulty || "Easy",
  }));
}


export default function ContentForm({ initialData = null }) {
  const router = useRouter();
  const isEditMode = Boolean(initialData?._id || initialData?.id);

  const [title, setTitle] = useState(() => initialData?.title || "");
  const [contentType, setContentType] = useState(
    () => initialData?.contentType || "text"
  );
  const [passageDifficulty, setPassageDifficulty] = useState(
    () => initialData?.passageDifficulty || "Easy"
  );
  const [passage, setPassage] = useState(
    () => initialData?.passage || ""
  );
  const [imageUrl, setImageUrl] = useState(
    () => initialData?.imageUrl || ""
  );
  const [questions, setQuestions] = useState(() =>
    prepareQuestions(initialData?.questions)
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setMessage("");
    setIsSuccess(false);

    try {
      const data = {
        title,
        contentType,
        passageDifficulty,
        passage,
        imageUrl,
        questions: questions.map((question) => ({
          questionText: question.questionText,
          type: question.type,
          options: question.options,
          correctAnswer: question.correctAnswer,
          acceptedAnswers: question.acceptedAnswers,
          difficulty: question.difficulty,
        })),
      };

      const result = isEditMode
        ? await updateContent(
            String(initialData._id || initialData.id),
            data
          )
        : await createContent(data);

      if (!result || typeof result.success !== "boolean") {
        setMessage("Unexpected server response. Please check the terminal.");
        return;
      }

      setMessage(result.message);
      setIsSuccess(result.success);

      if (!result.success) return;

      if (isEditMode) {
        router.push("/admin/manage-content");
        router.refresh();
        return;
      }

      setTitle("");
      setContentType("text");
      setPassageDifficulty("Easy");
      setPassage("");
      setImageUrl("");
      setQuestions([createInitialQuestions()[0]]);

      router.refresh();
    } catch (error) {
      console.error("Content form submit failed:", error);

      setMessage(
        error?.message || "Something went wrong. Please try again."
      );
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ContentDetails
        title={title}
        setTitle={setTitle}
        contentType={contentType}
        setContentType={setContentType}
        passageDifficulty={passageDifficulty}
        setPassageDifficulty={setPassageDifficulty}
        passage={passage}
        setPassage={setPassage}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
      />

      <QuestionList
        questions={questions}
        onQuestionsChange={setQuestions}
      />

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? isEditMode
              ? "Updating..."
              : "Saving..."
            : isEditMode
              ? "Update Content"
              : "Save Content"}
        </button>

        {message && (
          <p
            role="status"
            aria-live="polite"
            className={`mt-4 text-sm ${
              isSuccess ? "text-lime-300" : "text-red-300"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </form>
  );
}
