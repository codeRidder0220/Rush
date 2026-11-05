"use client";

import { useEffect, useState } from "react";

const milestones = [1000, 1500, 2000, 2500, 3000];

export default function RatingBadges({ rating, userId }) {
    const [newBadges, setNewBadges] = useState([]);
    const [showCelebration, setShowCelebration] = useState(false);

    useEffect(() => {
        const storageKey = `rush-rating-${userId}`;
        const savedRating = localStorage.getItem(storageKey);

        // First visit: current rating save karo, old badges celebrate mat karo.
        if (savedRating === null) {
            localStorage.setItem(storageKey, String(rating));
            return;
        }

        const previousRating = Number(savedRating);

        const unlockedNow = milestones.filter(
            (milestone) =>
                previousRating < milestone && rating >= milestone
        );

        // Rating ko turant save karo, taaki celebration repeat na ho.
        localStorage.setItem(storageKey, String(rating));

        if (unlockedNow.length > 0) {
            setNewBadges(unlockedNow);
            setShowCelebration(true);
        }
    }, [rating, userId]);

    useEffect(() => {
        if (!showCelebration) return;

        const timer = setTimeout(() => {
            setShowCelebration(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, [showCelebration]);

    return (
        <>
            {showCelebration && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Badge unlocked celebration"
                        className="w-full max-w-sm animate-bounce rounded-3xl border-4 border-black bg-[#ffd23f] p-7 text-center shadow-[8px_8px_0_#000]"
                    >
                        <p className="text-4xl">
                            🎉 ✨ 🎊
                        </p>

                        <p className="mt-3 text-2xl font-rye font-black">
                            BADGE UNLOCKED!
                        </p>

                        {newBadges.map((milestone) => (
                            <div key={milestone} className="mt-3">
                                <p className="text-6xl">🏆</p>
                                <p className="text-xl font-black font-rye">
                                    {milestone} Rating
                                </p>
                            </div>
                        ))}

                        <p className="mt-3 font-bold font-fredoka">
                            Amazing! Keep rushing! 🚀
                        </p>

                        <button
                            onClick={() => setShowCelebration(false)}
                            className="mt-5 rounded-xl font-special border-3 border-black bg-white px-5 py-2 font-black shadow-[3px_3px_0_#000]"
                        >
                            LET'S GO!
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {milestones.map((milestone) => {
                    const unlocked = rating >= milestone;

                    return (
                        <div
                            key={milestone}
                            className={`rounded-2xl border-3 border-[#111111] p-4 text-center ${
                                unlocked
                                    ? "bg-[#ffd23f]"
                                    : "bg-white/60 opacity-60"
                            }`}
                        >
                            <p className="text-3xl">
                                {unlocked ? "🏆" : "🔒"}
                            </p>

                            <p className="mt-2 text-xl font-rye font-black">
                                {milestone}
                            </p>

                            <p className="text-xs font-rye font-black">
                                {unlocked ? "UNLOCKED" : "LOCKED"}
                            </p>
                        </div>
                    );
                })}
            </div>
        </>
    );
}