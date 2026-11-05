
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { startGame, getReadingGame } from "@/actions/game.js";



const readingTimes = {
    Easy: 10,
    Medium: 20,
    Hard: 30,
    "Very Hard": 25,
};

export default function GameLoadingPage() {
    const [game, setGame] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [readingComplete, setReadingComplete] = useState(false);
    const [error, setError] = useState("");


    const startedRef = useRef(false);
    const router = useRouter();

    useEffect(() => {
        if (startedRef.current) return;
        startedRef.current = true;

        async function loadGame() {
            const savedSessionId = sessionStorage.getItem("readingSessionId");

            let result;

            if (savedSessionId) {
                result = await getReadingGame(savedSessionId);
            }

            if (!result?.success) {
                sessionStorage.removeItem("readingSessionId");
                result = await startGame();
            }

            if (!result.success) {
                setError(result.message || "The game could not be started.");
                return;
            }

            const selectedGame = result.game;

            sessionStorage.setItem("readingSessionId", selectedGame.sessionId);

            setGame(selectedGame);
            setTimeLeft(selectedGame.readingDuration);
        }

        loadGame().catch(() => {
            setError("Something went wrong while loading. Please try again later!");
        });
    }, []);



    
    useEffect(() => {
        if (!game || readingComplete || timeLeft <= 0) return;

        const endTime = Date.now() + timeLeft * 1000;

        const interval = setInterval(() => {
            const remaining = Math.max(
                0,
                Math.ceil((endTime - Date.now()) / 1000)
            );

            setTimeLeft(remaining);

            if (remaining <= 0) {
                clearInterval(interval);
                setReadingComplete(true);
            }
        }, 200);

        return () => clearInterval(interval);
    }, [game, readingComplete]);



    useEffect(() => {
        if (!readingComplete || !game?.sessionId) return;

        router.replace(
            `/game/questions?sessionId=${encodeURIComponent(game.sessionId)}`
        );
    }, [readingComplete, game, router]);

    return (
        <main
            className="min-h-screen bg-[#fff7e6] px-4 py-6 text-[#111111] sm:px-6"
            style={{
                backgroundImage:
                    "radial-gradient(#11111120 1.5px, transparent 1.5px)",
                backgroundSize: "22px 22px",
            }}
        >
            <div className="mx-auto max-w-4xl">
                <header className="mb-6 flex items-center justify-between gap-3">
                    <h1 className="text-2xl font-rye font-black sm:text-3xl">
                        RUSH <span className="text-[#8b5cf6]">ARCADE</span>
                    </h1>

                    <div className="rounded-xl border-[3px] border-[#111111] bg-white px-4 py-2 font-black shadow-[3px_3px_0_#111111]">
                        ❤️ ❤️ ❤️
                    </div>
                </header>

                {error ? (
                    <section className="rounded-2xl border-4 border-[#111111] bg-white p-6 shadow-[5px_5px_0_#111111]">
                        <h2 className="text-2xl font-black">Oops!</h2>
                        <p className="mt-3 font-semibold">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-5 font-fredoka rounded-xl border-[3px] border-[#111111] bg-[#b6ff00] px-5 py-3 font-black shadow-[3px_3px_0_#111111]"
                        >
                            TRY AGAIN
                        </button>
                    </section>
                ) : !game ? (
                    <section className="rounded-2xl border-4 border-[#111111] bg-[#8b5cf6] p-8 text-center shadow-[5px_5px_0_#111111]">
                        <div className="text-6xl">🦉</div>
                        <h2 className="mt-4 font-fredoka text-4 xl font-black">
                            GET READY!
                        </h2>
                        <p className="mt-2 font-special font-semibold">
                            Your memory challenge is loading...
                        </p>
                    </section>
                ) : (
                    <>
                        <section className="mb-10 flex flex-wrap items-center justify-between gap-3">
                            <div className="-rotate-3 rounded-2xl border-4 border-[#111111] bg-[#ffd23f] p-3  shadow-[4px_4px_0_#111111]">
                                <p className="text-2xl font-fredoka font-black  tracking-[0.02px]">
                                    Memorize this!
                                </p>

                            </div>

                            <div className="flex items-center justify-center gap-3">

                                <div className="rotate-3 sm:rotate-0 rounded-2xl border-4 border-[#111111] bg-[#7fff3f] px-2 sm:px-2 shadow-[4px_4px_0_#111111] sm:shadow-none ">

                                    <h2 className="text-lg font-special sm:text-xl font-bold"> {game.passageDifficulty} passage </h2>

                                </div>

                                <div className=" flex items-center justify-center w-25 h-25 rounded-full border-4 border-[#111111] bg-[#f26730] p-5 shadow-[4px_4px_0_#111111]">

                                    <p
                                        className="text-5xl font-fredoka font-black text-white tabular-nums"
                                        aria-live="polite"
                                    >
                                        {readingComplete ? "0" : `${timeLeft}`}
                                    </p>
                                </div>
                            </div>


                        </section>

                        <section className="rounded-2xl border-4 border-[#111111] bg-white p-5 shadow-[5px_5px_0_#111111] sm:p-8">
                            <h2 className="text-2xl font-fredoka font-black sm:text-3xl">
                                {readingComplete
                                    ? "Reading Time Over!"
                                    : game.title}
                            </h2>

                            {readingComplete ? (
                                <div className="py-12 text-center">
                                    <div className="text-6xl">🧠</div>
                                    <p className="mt-4 text-2xl font-fredoka font-black">
                                        The passage has disappeared!
                                    </p>
                                    <p className="mt-2 font-semibold font-special text-gray-600">
                                        The questions will appear in next step here.
                                    </p>
                                </div>
                            ) : game.contentType === "image" ? (
                                <div className="mt-5">
                                    {game.imageUrl ? (
                                        <img
                                            src={game.imageUrl}
                                            alt="Memory challenge"
                                            className="mx-auto max-h-[60vh] w-full rounded-xl border-2 border-[#111111] object-contain"
                                        />
                                    ) : (
                                        <p className="font-semibold font-special">
                                            An image of this content isn't available
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p className="mt-5 font-special whitespace-pre-wrap text-base font-medium leading-8 sm:text-lg">
                                    {game.passage}
                                </p>
                            )}

                            {!readingComplete && (
                                <p className="mt-6 font-special rounded-xl bg-[#f3e8ff] p-3 text-center text-sm font-bold">
                                    Please concentrate more than you think....
                                </p>
                            )}
                        </section>
                    </>
                )}
            </div>
        </main>
    );
}
