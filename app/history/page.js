import Link from "next/link";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import GameResult from "@/app/models/GameResult";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const userId = user._id ?? user.id ?? user.userId;

  await connectDB();

  const games = await GameResult.find({ user: userId })
    .populate("content", "title")
    .sort({ finishedAt: -1, createdAt: -1 })
    .lean();

  return (
    <main className="min-h-screen bg-[#fff7e6] px-4 py-8 text-[#111111] sm:px-8">
      <div className="mx-auto max-w-4xl">

        <header className="mb-6 mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Left side: Dashboard link and heading */}
          <div className="min-w-0">
            <Link
              href="/"
              className="mb-6 font-fredoka text-xl inline-block rounded-xl border-[3px] border-[#111111] bg-white px-4 py-2 font-black shadow-[3px_3px_0_#111111] transition hover:-translate-y-0.5"
            >
              ← Dashboard
            </Link>

            <p className="text-sm font-rye font-black uppercase tracking-widest">
              Read. Remember. Rush.
            </p>

            <h1 className="mt-2 font-fredoka text-4xl font-black sm:text-5xl">
              Game History
            </h1>

            <p className="mt-2 font-special font-semibold text-gray-700">
              Your all completed & ended games here....
            </p>
          </div>

          {/* Right side: Owl illustration */}
          <div className="mx-auto w-full max-w-50 shrink-0 sm:mx-0 sm:w-50">
            <Image
              src="/images/leaderboard-owl.png"
              alt="RUSH leaderboard owl"
              width={200}
              height={200}
              priority
              className="h-auto w-full object-contain"
            />
          </div>
        </header>

        <section className="rounded-3xl border-4 border-[#111111] bg-white p-5 shadow-[5px_5px_0_#111111] sm:p-7">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-fredoka font-black">Your games</h2>
            <span className="rounded-full border-2 font-fredoka border-[#111111] bg-[#22d3ee] px-3 py-1 text-md font-black">
              {games.length} games
            </span>
          </div>

          {games.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-[#111111]/40 bg-[#fff7e6] p-8 text-center">
              <p className="text-lg font-black">Your History is empty!</p>
              <p className="mt-2 text-md font-special font-medium">
                Play your first challenge to appear your history here.
              </p>
              <Link
                href="/game"
                className="mt-4 inline-block font-rye rounded-xl border-[3px] border-[#111111] bg-[#b6ff00] px-5 py-2 font-black shadow-[3px_3px_0_#111111]"
              >
                Play a game
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {games.map((game, index) => (
                <div
                  key={String(game._id)}
                  className="flex flex-col justify-between gap-3 rounded-2xl border-[3px] border-[#111111] bg-[#22d3ee]/20 p-4 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-rye  font-black uppercase tracking-wide text-gray-600">
                      Game #{games.length - index}
                    </p>
                    <h3 className="mt-1 font-special wrap-break-words text-lg font-black">
                      {game.content?.title ?? "RUSH Game"}
                    </h3>
                    <p className="mt-1 text-sm font-fredoka font-semibold text-gray-700">
                      {new Date(
                        game.finishedAt ?? game.createdAt
                      ).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 sm:justify-end">
                    <div>
                      <p className="text-sm font-fredoka font-bold text-gray-600">
                        SCORE
                      </p>
                      <p className="text-xl font-fredoka font-black">
                        {game.score} pts
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-fredoka font-bold text-gray-600">
                        CORRECT
                      </p>
                      <p className="text-2xl font-fredoka font-black">
                        {game.correctAnswers ?? 0}
                      </p>
                    </div>

                    <span
                      className={`rounded-lg border-2 font-fredoka border-[#111111] px-3 py-1 text-sm font-black ${game.completed
                          ? "bg-[#b6ff00]"
                          : "bg-[#ff6fb5]"
                        }`}
                    >
                      {game.completed ? "Completed" : "Game Over"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}