
"use client";

import { useState } from "react";
import Link from "next/link";

export default function DashboardPanels({ leaderboardUsers = [], gameHistory = [], }) {
  const [showRules, setShowRules] = useState(false);

  return (
    <>
      <section className="mb-8 mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/leaderboard"
          className="block rounded-3xl border-4 border-[#111111] bg-white p-5 text-[#111111] shadow-[5px_5px_0_#111111] transition hover:-translate-y-1 hover:shadow-[7px_7px_0_#111111] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#8b5cf6]"
        >          <h2 className="text-xl font-rye font-black">Leaderboard</h2>

          {leaderboardUsers.map((player, index) => (
            <div
              key={player.id}
              className="flex items-center justify-between gap-3 border-b-2 border-[#11111120] py-2.5 last:border-b-0"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 font-fredoka items-center justify-center rounded-full border-2 border-[#111111] bg-[#F4D7D4] font-black">
                  {index + 1}
                </span>

                <span className="truncate font-fredoka text-xl font-bold">{player.username}</span>
              </div>

              <div className="shrink-0 text-right">
                <p className="font-black font-fredoka text-[#7A2E6F] ">{player.rating} rating</p>
                <p className="text-xs font-fredoka text-gray-900">
                  Best: {player.bestScore}
                </p>
              </div>
            </div>
          ))}
        </Link>

        <Link href="/history"
          className="rounded-3xl border-4 border-[#111111] bg-[#22d3ee] p-5 text-[#111111] shadow-[5px_5px_0_#111111] transition hover:-translate-y-1 hover:shadow-[7px_7px_0_#111111] ">
          <h2 className="text-xl font-rye font-black">Game History</h2>

          <div className="mt-3 space-y-1 text-sm font-semibold">
            {gameHistory.length === 0 ? (
              <p className="py-4 text-md font-special">
                There is no game history yet. Play a game first.
              </p>
            ) : (
              gameHistory.map((game) => (
                <div
                  key={game.id}
                  className="border-b-2 border-dashed border-[#111111]/30 py-2 last:border-b-0"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-special text-lg font-bold">{game.title}</p>
                      <p className="text-xs font-fredoka font-medium">
                        {new Date(game.completedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="font-black text-[#7A2E6F] font-fredoka">{game.score} pts</p>
                      <p className="text-xs text-green-900 font-fredoka">
                        {game.completed ? "Completed" : "Game over"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Link>

        <div className="rounded-3xl border-4 border-[#111111] bg-[#ff6fb5] p-5 text-[#111111] shadow-[5px_5px_0_#111111] sm:col-span-2 lg:col-span-1">
          <h2 className="text-xl font-rye font-black">Help & Rules</h2>

          <p className="mt-2 font-special text-md leading-5">
            How lives, scoring and Boss questions work.
          </p>

          <button
            type="button"
            onClick={() => setShowRules(true)}
            className="mt-3 font-fredoka rounded-xl border-[3px] border-[#111111] bg-white px-4 py-2 text-md font-bold shadow-[2px_2px_0_#111111] transition hover:-translate-y-0.5"
          >
            Open rules
          </button>
        </div>
      </section>

      {showRules && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4"
          onClick={() => setShowRules(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="rules-title"
            className="flex max-h-[90dvh] w-full max-w-md flex-col overflow-hidden rounded-2xl border-[3px] border-[#111111] bg-[#fff7e6] text-[#111111] shadow-[7px_7px_0_#111111]"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b-2 border-[#111111] px-4 py-3 sm:px-6">
              <h2 id="rules-title" className="text-2xl font-rye font-black">
                Game Rules
              </h2>

              <button
                type="button"
                onClick={() => setShowRules(false)}
                aria-label="Close rules"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-[#111111] bg-white text-xl font-black"
              >
                ✕
              </button>
            </div>

            {/* Scrollable rules */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3 sm:px-6">
              <ul className="list-disc space-y-2 pl-5 font-fredoka text-sm font-semibold leading-6">
                <li>Start each game with 3 lives.</li>
                <li>Read the passage carefully before answering questions.</li>
                <li>Remember the passage — it will be hidden when the questions begin.</li>
                <li>Answer questions using what you remember from the passage.</li>
                <li>Correct answers earn points: Easy +10, Medium +20, Hard +30, and Boss +50.</li>
                <li>Wrong answers lose points: Easy -5, Medium -8, Hard -11, and Boss -15.</li>
                <li>Every wrong answer costs one life.</li>
                <li>Skipping a question does not cost points or a life.</li>
                <li>Boss questions give more points, but wrong answers have bigger penalties.</li>
                <li>The game ends when you lose all 3 lives or finish all questions.</li>
                <li>Your final score and rating are saved when the game ends.</li>
                <li>Visit your Profile to see your rating, progress, and badges.</li>
                <li>Visit History to check your previous games and results.</li>
                <li>Visit Leaderboard to compare your rating with other players.</li>
              </ul>
            </div>

            {/* Footer - always visible */}
            <div className="shrink-0 border-t-2 border-[#111111] bg-[#fff7e6] p-4">
              <button
                type="button"
                onClick={() => setShowRules(false)}
                className="w-full rounded-xl font-rye border-[3px] border-[#111111] bg-[#b6ff00] px-5 py-3 font-black shadow-[3px_3px_0_#111111]"
              >
                Got it!
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
