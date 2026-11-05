
"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getGameQuestions, submitGameQuestion, startNextQuestionClock, } from "../../../actions/game.js";
import QuestionCard from "../../components/game/QuestionCard.js";

function QuestionsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("sessionId");

    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function loadQuestions() {
            if (!sessionId) {
                setError("Game details not found. Please restart the game from the Dashboard.");
                setLoading(false);
                return;
            }

            try {
                const result = await getGameQuestions(sessionId);

                if (cancelled) return;

                if (!result.success) {
                    setError(result.message || "Questions couldn't be loaded.");
                    return;
                }

                setQuestions(result.questions);
            } catch {
                if (!cancelled) {
                    setError("Questions couldn't be loaded. Try again.");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadQuestions();

        return () => {
            cancelled = true;
        };
    }, [sessionId]);

    const question = questions[currentIndex];


    function goToNextQuestion() {
        setSelectedAnswer("");
        setFeedback(null);
        setCurrentIndex((index) => index + 1);
    }

    async function handleAnswer(skip = false) {
        if (isSubmitting || feedback || !question) return;

        if (!skip && !selectedAnswer.trim()) {
            setError("Select your answer or write");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            const result = await submitGameQuestion({
                sessionId,
                questionId: question._id,
                answer: selectedAnswer,
                skip,
            });

            if (!result.success) {
                setError(result.message || "The answer couldn't be submitted.");
                setIsSubmitting(false);
                return;
            }

            setScore(result.score);
            setLives(result.lives);

            setFeedback({
                correct: result.correct,
                skipped: result.skipped,
                pointsChanged: result.pointsChanged,
            });

            const delay = result.skipped
                ? 0
                : result.correct
                    ? 1000
                    : 3000;

            setTimeout(async () => {
                if (result.finished || result.gameOver) {
                    router.replace(
                        `/game/result?sessionId=${encodeURIComponent(sessionId)}`
                    );
                    return;
                }

                goToNextQuestion();

                const clockResult = await startNextQuestionClock(sessionId);

                if (!clockResult.success) {
                    setError(
                        clockResult.message || "Question timer couldn't start."
                    );
                }

                setIsSubmitting(false);
            }, delay);
        } catch (error) {
            console.error("Handle answer error:", error);
            setError("Answer couldn't submitted , please try again.");
            setIsSubmitting(false);
        }
    }



    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#fff7e6] p-5">
                <div className="rounded-2xl border-4 border-[#111111] bg-[#8b5cf6] p-8 text-center font-black shadow-[5px_5px_0_#111111]">
                    <div className="text-5xl">🦉</div>
                    <p className="mt-4">GETTING QUESTIONS READY...</p>
                </div>
            </main>
        );
    }

    if (error || !question) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#fff7e6] p-5">
                <section className="w-full max-w-lg rounded-2xl border-4 border-[#111111] bg-white p-6 shadow-[5px_5px_0_#111111]">
                    <h1 className="text-2xl font-black text-red-800">Oops!</h1>
                    <p className="mt-3 font-semibold text-black">
                        {error || "Questions are not available yet."}
                    </p>
                    <button
                        type="button"
                        onClick={() => router.push("/")}
                        className="mt-5 rounded-xl border-[3px] border-[#111111] text-black bg-[#b6ff00] px-5 py-3 font-black shadow-[3px_3px_0_#111111]"
                    >
                        DASHBOARD
                    </button>
                </section>
            </main>
        );
    }

    return (
        <main
            className="min-h-screen bg-[#fff7e6] px-4 py-6 text-[#111111] sm:px-7"
            style={{
                backgroundImage:
                    "radial-gradient(#11111120 1.5px, transparent 1.5px)",
                backgroundSize: "20px 20px",
            }}
        >
            <div className="mx-auto max-w-5xl">
                <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-2xl" aria-label={`${lives} lives remaining`}>
                        {Array.from({ length: 3 }, (_, index) => (
                            <span key={index}>{index < lives ? "🧡" : "♡"}</span>
                        ))}
                    </div>

                    <div className="rounded-full font-fredoka border-[3px] border-[#111111] bg-white px-4 py-2 font-black">
                        Question {currentIndex + 1} / {questions.length}
                    </div>

                    <div className="rounded-xl font-fredoka border-[3px] border-[#111111] bg-[#b6ff00] px-4 py-2 text-2xl font-black shadow-[3px_3px_0_#111111]">
                        SCORE :  {score}
                    </div>
                </header>

                <QuestionCard
                    question={question}
                    questionNumber={currentIndex + 1}
                    totalQuestions={questions.length}
                    selectedAnswer={selectedAnswer}
                    setSelectedAnswer={setSelectedAnswer}
                />


                {feedback && (
                    <div
                        role="status"
                        className={`mt-5 rounded-xl text-xl font-fredoka border-4 border-[#111111] p-4 font-black shadow-[4px_4px_0_#111111] ${feedback.skipped
                            ? "bg-white"
                            : feedback.correct
                                ? "bg-[#b6ff00]"
                                : "bg-[#ff6fb5]"
                            }`}
                    >
                        {feedback.skipped
                            ? "QUESTION SKIPPED"
                            : feedback.correct
                                ? `HURRAY!🎉 You Got +${feedback.pointsChanged} POINTS`
                                : `OHH NO 🥺 NOT QUITE! ${feedback.pointsChanged} POINTS`}
                    </div>
                )}


                <div className="mt-6 flex items-center justify-between gap-4">

                    <button
                        type="button"
                        onClick={() => handleAnswer(true)}
                        disabled={isSubmitting || Boolean(feedback)}
                        className="rounded-2xl font-fredoka border-[3px] border-[#111111] bg-white px-6 py-3 text-xl font-black shadow-[4px_4px_0_#111111]"
                    >
                        SKIP →
                    </button>
                    <button
                        type="button"
                        disabled={
                            isSubmitting ||
                            Boolean(feedback) ||
                            !selectedAnswer.trim()
                        }
                        onClick={() => handleAnswer(false)}
                        className="rounded-2xl font-fredoka border-[3px] border-[#111111] bg-[#ffd23f] px-6 py-3 text-xl font-black shadow-[4px_4px_0_#111111] disabled:cursor-not-allowed disabled:opacity-40"                    >
                        SUBMIT
                    </button>
                </div>
            </div>
        </main>
    );
}







export default function QuestionsPage() {
    return (
        <Suspense fallback={<div>GETTING QUESTIONS READY...</div>}>
            <QuestionsContent />
        </Suspense>
    );
}
