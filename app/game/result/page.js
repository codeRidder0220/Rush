
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getGameResult } from "../../../actions/game.js";
import confetti from "canvas-confetti";


function OwlMascot() {
    return (
        <div
            role="img"
            aria-label="Owl mascot"
            className="flex h-28 w-28 items-center justify-center rounded-full border-[5px] border-[#111111] bg-[#fff7e6] text-7xl sm:h-36 sm:w-36 sm:text-8xl"
        >
            🦉
        </div>
    );
}

function ResultDecorations() {
    return (
        <>
            <style>{`
                @keyframes rush-float {
                    0%, 100% { transform: translateY(0) rotate(-5deg); }
                    50% { transform: translateY(-18px) rotate(5deg); }
                }

                @keyframes rush-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                @keyframes rush-pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.12); }
                }

                .rush-float-left {
                    animation: rush-float 4s ease-in-out infinite;
                    transform-origin: center;
                }

                .rush-float-right {
                    animation: rush-float 3.5s ease-in-out infinite;
                    animation-delay: .4s;
                    transform-origin: center;
                }

                .rush-spin {
                    animation: rush-spin 12s linear infinite;
                    transform-origin: center;
                }

                .rush-pulse {
                    animation: rush-pulse 2s ease-in-out infinite;
                    transform-origin: center;
                }
            `}</style>


            {/* RIGHT TOP — TROPHY + LIGHTNING */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute right-2 top-8 z-0 w-28 sm:right-8 sm:top-10 sm:w-44 lg:w-80"
            >
                <svg
                    viewBox="0 0 200 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="rush-float-right drop-shadow-[5px_7px_0_#111111]"
                >
                    {/* Background burst */}
                    <path
                        d="M100 12L116 48L155 30L143 69L184 78L151 104L178 137L137 139L130 181L100 153L70 181L63 139L22 137L49 104L16 78L57 69L45 30L84 48Z"
                        fill="#FF6FB5"
                        stroke="#111111"
                        strokeWidth="5"
                        strokeLinejoin="round"
                    />

                    {/* Trophy cup */}
                    <path
                        d="M66 54H134V86C134 109 119 124 100 124C81 124 66 109 66 86V54Z"
                        fill="#FFD23F"
                        stroke="#111111"
                        strokeWidth="6"
                        strokeLinejoin="round"
                    />

                    {/* Trophy handles */}
                    <path
                        d="M66 65H48C48 89 58 99 77 100"
                        stroke="#111111"
                        strokeWidth="8"
                        strokeLinecap="round"
                    />
                    <path
                        d="M134 65H152C152 89 142 99 123 100"
                        stroke="#111111"
                        strokeWidth="8"
                        strokeLinecap="round"
                    />

                    {/* Trophy stem and base */}
                    <path
                        d="M91 124V143H109V124"
                        fill="#22D3EE"
                        stroke="#111111"
                        strokeWidth="5"
                    />
                    <rect
                        x="75"
                        y="143"
                        width="50"
                        height="13"
                        rx="4"
                        fill="#B6FF00"
                        stroke="#111111"
                        strokeWidth="5"
                    />

                    {/* Trophy star */}
                    <path
                        d="M100 62L106 76L121 77L110 87L113 102L100 94L87 102L90 87L79 77L94 76Z"
                        fill="#FFF7E6"
                        stroke="#111111"
                        strokeWidth="3"
                        className="rush-pulse"
                    />

                    {/* Lightning bolt */}
                    <path
                        d="M151 112L133 142H148L140 166L166 132H151L160 112Z"
                        fill="#B6FF00"
                        stroke="#111111"
                        strokeWidth="5"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </>
    );
}


export default function GameResultPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("sessionId");

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {
        let cancelled = false;

        async function loadResult() {
            if (!sessionId) {
                setError("Game session is not found.");
                setLoading(false);
                return;
            }

            try {
                const response = await getGameResult(sessionId);

                if (cancelled) return;

                if (response.success) {
                    setResult(response.result);
                } else {
                    setError(response.message || "The result failed to load.");
                }
            } catch (err) {
                console.error("Load result error:", err);
                if (!cancelled) setError("The result failed to load.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadResult();

        return () => {
            cancelled = true;
        };
    }, [sessionId]);


    //confetti animation....

    const confettiPlayed = useRef(false);

    useEffect(() => {
        console.log("Result data:", result);
        console.log("New personal best:", result?.newPersonalBest);

        if (!result?.newPersonalBest || confettiPlayed.current) {
            return;
        }

        confettiPlayed.current = true;

        console.log("Confetti trigger reached!");

        const colors = [
            "#ffd23f",
            "#8b5cf6",
            "#b6ff00",
            "#ff6fb5",
            "#22d3ee",
            "#ff7a00",
        ];

        confetti({
            particleCount: 140,
            spread: 100,
            startVelocity: 45,
            origin: { x: 0.5, y: 0.55 },
            colors,
            zIndex: 9999,
        });

        setTimeout(() => {
            confetti({
                particleCount: 65,
                angle: 60,
                spread: 65,
                origin: { x: 0, y: 0.65 },
                colors,
                zIndex: 9999,
            });

            confetti({
                particleCount: 65,
                angle: 120,
                spread: 65,
                origin: { x: 1, y: 0.65 },
                colors,
                zIndex: 9999,
            });
        }, 250);
    }, [result]);


    //play again function...
    function handlePlayAgain() {
        router.push("/game");
    }


    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#ffd84d] p-6">
                <p className="text-2xl font-black">LOADING RESULTS...</p>
            </main>
        );
    }

    if (!result) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#ffd84d] p-6 text-center">
                <h1 className="text-3xl font-black">OOPS!</h1>
                <p className="font-bold">{error || "Result nahi mila."}</p>
                <button
                    onClick={() => router.push("/")}
                    className="rounded-2xl border-4 border-[#111111] bg-white px-7 py-4 text-xl font-black shadow-[5px_5px_0_#111111]"
                >
                    DASHBOARD
                </button>
            </main>
        );
    }

    const score = result.score ?? 0;
    const correct = result.correctAnswers ?? 0;
    const wrong = result.wrongAnswers ?? 0;
    const lives = result.livesRemaining ?? 0;
    const totalSeconds = Math.max(0, result.questionTime ?? 0);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#ffd84d] bg-[radial-gradient(#e9b932_2px,transparent_2px)] bg-size-[18px_18px] px-4 py-7 sm:px-7 sm:py-8">

            {/* Animated SVG decorations — top-left aur top-right */}
            <ResultDecorations />

            {/* Main result content */}
            <div className="relative z-10 mx-auto max-w-5xl">
                <h1
                    className="text-center font-rye text-4xl font-black uppercase leading-tight tracking-tight text-white [-webkit-text-stroke:1.5px_#111111] [paint-order:stroke_fill] drop-shadow-[3px_4px_0_#111111] sm:text-5xl md:text-6xl"
                >
                    {result.completed ? "GAME COMPLETE!" : "GAME OVER!"}
                </h1>

                <section className="mx-auto mt-7 flex max-w-2xl flex-col items-center justify-center gap-5 sm:flex-row sm:gap-9">
                    <div className="shrink-0">
                        <OwlMascot />
                    </div>

                    <div className="w-full max-w-xs rounded-[26px] border-4 border-[#111111] bg-white px-6 py-4 text-center shadow-[9px_10px_0_#111111] sm:max-w-75">
                        <p className="text-2xl font-black font-fredoka text-black">FINAL SCORE</p>

                        <p className="mt-0 text-6xl font-rye font-black leading-tight text-[#8b5cf6] [-webkit-text-stroke:10px_#111111] [paint-order:stroke_fill] sm:text-8xl">
                            {score}
                        </p>

                        {result.newPersonalBest && (
                            <div className="-rotate-3 font-special mt-2 inline-block rounded-full border-[3px] border-dotted border-[#040000] bg-[#fc4854] px-4 py-1 text-sm font-black text-[#060202] animate-pulse">
                                New personal best!
                            </div>
                        )}
                    </div>
                </section>

                <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                    <div className="flex min-h-24 flex-col items-center justify-center rounded-[20px] border-[3px] border-[#111111] bg-[#b6ff00] p-3 shadow-[5px_6px_0_#111111]">
                        <p className="text-4xl font-black leading-none  font-rye text-black">{correct}</p>
                        <p className="mt-1 font-black font-rye text-black">Correct</p>
                    </div>

                    <div className="flex min-h-24 flex-col items-center justify-center rounded-[20px] border-[3px] border-[#111111] bg-[#ff6868] p-3 shadow-[5px_6px_0_#111111]">
                        <p className="text-4xl font-black  font-rye leading-none text-black">{wrong}</p>
                        <p className="mt-1 font-black font-rye text-black">Wrong</p>
                    </div>

                    <div className="flex min-h-24 flex-col items-center justify-center rounded-[20px] border-[3px] border-[#111111] bg-[#22cfe5] p-3 shadow-[5px_6px_0_#111111]">
                        <p className="text-4xl  font-rye font-black leading-none text-black tabular-nums">
                            {minutes}:{String(seconds).padStart(2, "0")}
                        </p>
                        <p className="mt-1 font-black  font-rye text-black">Time taken</p>
                    </div>

                    <div className="flex min-h-24 flex-col items-center justify-center rounded-[20px] border-[3px] border-[#111111] bg-[#f765b3] p-3 shadow-[5px_6px_0_#111111]">
                        <p className="text-4xl font-black leading-none  font-rye text-black">{lives}</p>
                        <p className="mt-1 font-black font-rye text-black">Lives left</p>
                    </div>
                </section>

                <div className="mt-7 flex justify-center">
                    <div className="rounded-full border-[3px] font-special border-[#111111] bg-[#ff7a00] px-5 py-2 text-center font-black text-black shadow-[3px_4px_0_#111111]">
                        {result.dailyStreak != null
                            ? `Daily streak: ${result.dailyStreak} days`
                            : "Great job! Keep your streak going!"}

                        {result.rank != null
                            ? ` · Leaderboard rank: #${result.rank}`
                            : ""}
                    </div>
                </div>

                {error && (
                    <p
                        role="alert"
                        className="mt-5 text-center font-bold text-red-900"
                    >
                        {error}
                    </p>
                )}

                <div className="mt-8 flex flex-col items-center justify-center gap-5 sm:flex-row">
                    <button
                        onClick={handlePlayAgain}
                        className="w-full max-w-57.5 font-rye rounded-[19px] border-4 border-[#111111] bg-[#b6ff00] px-6 py-4 text-2xl font-black text-black shadow-[6px_7px_0_#111111] transition-transform hover:-translate-y-1 disabled:opacity-60"
                    >
                        PLAY AGAIN
                    </button>

                    <button
                        onClick={() => router.push("/")}
                        className="w-full max-w-57.5 rounded-[19px] font-rye border-4 border-[#111111] bg-white px-6 py-4 text-2xl font-black text-black shadow-[6px_7px_0_#111111] transition-transform hover:-translate-y-1"
                    >
                        DASHBOARD
                    </button>
                </div>
            </div>
        </main>
    );
}
