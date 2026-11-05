
"use client";

export default function QuestionCard({
    question,
    questionNumber,
    totalQuestions,
    selectedAnswer,
    setSelectedAnswer,
}) {
    if (!question) return null;

    const isMCQ = question.type === "mcq";

    return (
        <section className="rounded-2xl border-4 border-[#111111] bg-white p-5 shadow-[5px_5px_0_#111111] sm:p-8">
            <div
                className={`mb-5 inline-flex font-special rounded-lg border-[3px] border-[#111111] px-3 py-1 text-sm font-black ${question.difficulty === "Boss"
                        ? "bg-[#ff7a00]"
                        : "bg-[#ffd23f]"
                    }`}
            >
                {question.difficulty?.toUpperCase()} [ +
                {question.difficulty === "Easy"
                    ? "10 / -5"
                    : question.difficulty === "Medium"
                        ? "20 / -8"
                        : question.difficulty === "Hard"
                            ? "30 / -11"
                            : question.difficulty === "Boss"
                                ? "50 / -15"
                                : "10 / -5"}  ]
            </div>

            <h2 className="text-xl font-fredoka font-black leading-snug sm:text-2xl">
                {question.questionText}
            </h2>

            {isMCQ ? (
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {question.options.map((option, index) => (
                        <button
                            key={`${question._id}-${index}`}
                            type="button"
                            onClick={() => setSelectedAnswer(option)}
                            aria-pressed={selectedAnswer === option}
                            className={`flex min-h-20 items-center gap-3 rounded-2xl border-[3px] border-[#111111] p-4 text-left font-bold shadow-[3px_3px_0_#111111] transition-colors ${selectedAnswer === option
                                    ? "bg-[#b6ff00]"
                                    : "bg-white hover:bg-[#fff0bd]"
                                }`}
                        >
                            <span
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[3px] border-[#111111] text-lg font-black ${index === 0
                                        ? "bg-[#22d3ee]"
                                        : index === 1
                                            ? "bg-green-400"
                                            : index === 2
                                                ? "bg-[#ff6fb5]"
                                                : "bg-[#ffd23f]"
                                    }`}
                            >
                                {String.fromCharCode(65 + index)}
                            </span>

                            <span className="font-special">{option}</span>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="mt-6">
                    <label
                        htmlFor="written-answer"
                        className="mb-2 block text-lg font-fredoka font-bold"
                    >
                        Type your answer
                    </label>

                    <textarea
                        id="written-answer"
                        rows={3}
                        value={selectedAnswer}
                        onChange={(event) => setSelectedAnswer(event.target.value)}
                        placeholder="Write your answer here..."
                        className="w-full rounded-2xl font-special border-[3px] border-[#111111] bg-white p-4 font-semibold outline-none focus:ring-2 focus:ring-[#8b5cf6]"
                    />
                </div>
            )}
        </section>
    );
}
