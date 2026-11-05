
"use client";

import QuestionEditor from "./QuestionEditor.js";

export default function QuestionList({ questions, onQuestionsChange,}) {
 

  function updateQuestion(id, updatedQuestion) {
    onQuestionsChange(
      questions.map((question) =>
        question.id === id ? updatedQuestion : question
      )
    );
  }

  function addQuestion() {
    if (questions.length >= 7) return;

    const nextId = `question-${Date.now()}-${questions.length}`;

    onQuestionsChange([
      ...questions,
      {
        id: nextId,
        questionText: "",
        type: "mcq",
        options: ["", "", "", ""],
        correctAnswer: "",
        acceptedAnswers: "",
        difficulty: "Easy",
      },
    ]);
  }

  function removeQuestion(id) {
    if (questions.length <= 1) return;

    onQuestionsChange(
      questions.filter((question) => question.id !== id)
    );
  }

  return (
    <section className="space-y-5 rounded-2xl border border-white/10 bg-[#11172b] p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Questions</h2>
          <p className="mt-1 text-sm text-slate-400">
            Add 6–7 questions for this content.
          </p>
        </div>

        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-300">
          {questions.length}/7
        </span>
      </div>

      {questions.map((question, index) => (
        <QuestionEditor
          key={question.id}
          question={question}
          index={index}
          onChange={(updatedQuestion) =>
            updateQuestion(question.id, updatedQuestion)
          }
          onRemove={() => removeQuestion(question.id)}
          canRemove={questions.length > 1}
        />
      ))}

      <button
        type="button"
        onClick={addQuestion}
        disabled={questions.length >= 7}
        className="w-full rounded-xl border border-dashed border-cyan-400/40 px-4 py-3 font-semibold text-cyan-300 transition hover:bg-cyan-400/5 disabled:cursor-not-allowed disabled:opacity-40"
      >
        + Add Question
      </button>

      <p className="text-xs text-slate-500">
        Minimum 6 questions, maximum 7 questions.
      </p>
    </section>
  );
}
