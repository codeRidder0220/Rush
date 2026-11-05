
"use client";

export default function QuestionEditor({
  question,
  index,
  onChange,
  onRemove,
  canRemove,
}) {
  const inputClass = "w-full rounded-xl border border-white/10 bg-[#11172b] px-4 py-3 text-white outline-none focus:border-cyan-400";
    
  const labelClass = "mb-2 block text-sm font-medium text-slate-200";

  function updateField(field, value) {
    onChange({ ...question, [field]: value });
  }

  function updateOption(optionIndex, value) {
    const options = [...question.options];
    options[optionIndex] = value;

    onChange({
      ...question,
      options,
      correctAnswer: options.includes(question.correctAnswer)
        ? question.correctAnswer
        : "",
    });
  }

  return (
    <article className="space-y-5 rounded-xl border border-white/10 bg-[#0b1020] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-bold">Question {index + 1}</h3>

        <button
          type="button"
          onClick={onRemove}
          disabled={!canRemove}
          className="rounded-lg border border-red-400/20 px-3 py-2 text-sm text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Remove
        </button>
      </div>

      <div>
        <label htmlFor={`question-text-${question.id}`} className={labelClass}>
          Question Text
        </label>

        <textarea
          id={`question-text-${question.id}`}
          value={question.questionText}
          onChange={(event) =>
            updateField("questionText", event.target.value)
          }
          required
          rows={2}
          placeholder="Write your question..."
          className={`${inputClass} resize-y`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`question-type-${question.id}`} className={labelClass}>
            Answer Type
          </label>

          <select
            id={`question-type-${question.id}`}
            value={question.type}
            onChange={(event) => {
              const type = event.target.value;

              onChange({
                ...question,
                type,
                options: type === "mcq" ? ["", "", "", ""] : [],
                correctAnswer: "",
                acceptedAnswers: "",
              });
            }}
            className={inputClass}
          >
            <option value="mcq">Multiple Choice (MCQ)</option>
            <option value="written">Written Answer</option>
          </select>
        </div>

        <div>
          <label
            htmlFor={`question-difficulty-${question.id}`}
            className={labelClass}
          >
            Question Difficulty
          </label>

          <select
            id={`question-difficulty-${question.id}`}
            value={question.difficulty}
            onChange={(event) =>
              updateField("difficulty", event.target.value)
            }
            className={inputClass}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
            <option value="Boss">Boss</option>
          </select>
        </div>
      </div>

      {question.type === "mcq" ? (
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-cyan-300">
            Answer Options
          </h4>

          {question.options.map((option, optionIndex) => (
            <div key={optionIndex}>
              <label
                htmlFor={`option-${question.id}-${optionIndex}`}
                className={labelClass}
              >
                Option {optionIndex + 1}
              </label>

              <input
                id={`option-${question.id}-${optionIndex}`}
                value={option}
                onChange={(event) =>
                  updateOption(optionIndex, event.target.value)
                }
                required
                placeholder={`Enter option ${optionIndex + 1}`}
                className={inputClass}
              />
            </div>
          ))}

          <div>
            <label
              htmlFor={`correct-answer-${question.id}`}
              className={labelClass}
            >
              Correct Answer
            </label>

            <select
              id={`correct-answer-${question.id}`}
              value={question.correctAnswer}
              onChange={(event) =>
                updateField("correctAnswer", event.target.value)
              }
              required
              className={inputClass}
            >
              <option value="">Select correct option</option>

              {question.options.map((option, optionIndex) => (
                <option
                  key={optionIndex}
                  value={option}
                  disabled={!option.trim()}
                >
                  {option.trim() || `Option ${optionIndex + 1} (empty)`}
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs text-slate-500">
              Fill all four options before choosing the correct answer.
            </p>
          </div>
        </div>
      ) : (
        <div>
          <label
            htmlFor={`accepted-answers-${question.id}`}
            className={labelClass}
          >
            Accepted Answers
          </label>

          <textarea
            id={`accepted-answers-${question.id}`}
            value={question.acceptedAnswers}
            onChange={(event) =>
              updateField("acceptedAnswers", event.target.value)
            }
            required
            rows={3}
            placeholder={"Enter one accepted answer per line.\nExample:\nJupiter\njupiter"}
            className={`${inputClass} resize-y`}
          />

          <p className="mt-2 text-xs text-slate-500">
            Har accepted answer alag line mein likho.
          </p>
        </div>
      )}
    </article>
  );
}
