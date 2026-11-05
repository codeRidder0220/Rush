
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import User from "@/app/models/User";
import GameResult from "@/app/models/GameResult";
import Content from "@/app/models/Content";
import Navbar from "@/app/components/Navbar";
import RatingGraph from "@/app/components/profile/Ratinggraph";
import RatingBadges from "@/app/components/profile/RatingBadge";

export const dynamic = "force-dynamic";

const milestones = [1000, 1500, 2000, 2500, 3000];

function formatDate(date) {
  if (!date) return "Date unavailable";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function PublicProfilePage({ params }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) redirect("/login");

  await connectDB();

  const { userId } = await params;

  const user = await User.findOne({
    _id: userId,
    role: "user",
  })
    .select("-passwordHash")
    .lean();

  if (!user) notFound();

  const rating = user.rating ?? 500;
  const bestScore = user.bestScore ?? 0;

  const higherRatedPlayers = await User.countDocuments({
    role: "user",
    $or: [
      { rating: { $gt: rating } },
      {
        rating,
        bestScore: { $gt: bestScore },
      },
      {
        rating,
        bestScore,
        username: { $lt: user.username },
      },
    ],
  });

  const rank = higherRatedPlayers + 1;

  void Content;

  const games = await GameResult.find({ user: user._id })
    .populate("content", "title")
    .sort({ finishedAt: -1, createdAt: -1 })
    .limit(5)
    .lean();

  const ratingHistory = (user.ratingHistory ?? [])
    .slice(-10)
    .map((entry) => ({
      rating: entry.rating,
      playedAt: entry.playedAt,
    }));

  const totalGames = await GameResult.countDocuments({
    user: user._id,
  });

  const totalCorrect = await GameResult.aggregate([
    { $match: { user: user._id } },
    {
      $group: {
        _id: null,
        total: { $sum: "$correctAnswers" },
      },
    },
  ]);

  const totalWrong = await GameResult.aggregate([
    { $match: { user: user._id } },
    {
      $group: {
        _id: null,
        total: { $sum: "$wrongAnswers" },
      },
    },
  ]);

  const correctCount = totalCorrect[0]?.total ?? 0;
  const wrongCount = totalWrong[0]?.total ?? 0;

  const accuracy =
    correctCount + wrongCount > 0
      ? Math.round(
          (correctCount / (correctCount + wrongCount)) * 100
        )
      : 0;

  return (
    <main
      className="min-h-screen bg-[#fff7e6] px-4 py-5 text-[#111111] sm:px-6 lg:px-8"
      style={{
        backgroundImage:
          "radial-gradient(#11111120 1.5px, transparent 1.5px)",
        backgroundSize: "22px 22px",
      }}
    >
      <div className="mx-auto max-w-7xl">
        <Navbar
          username={currentUser.username}
          avatar={currentUser.avatar ?? "🦉"}
        />

        <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-md font-special font-black uppercase tracking-widest">
              RUSH Player
            </p>
            <h1 className="text-3xl font-rye font-black sm:text-4xl">
              Player Profile
            </h1>
          </div>

          <Link
            href="/leaderboard"
            className="rounded-xl font-fredoka text-lg border-3 border-[#111111] bg-white px-4 py-2 font-black shadow-[3px_3px_0_#111111]"
          >
            ← Leaderboard
          </Link>
        </div>

        <section className="mt-6 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          <div className="flex flex-col items-center gap-4 rounded-3xl border-4 border-[#111111] bg-[#8b5cf6] p-6 text-center shadow-[6px_6px_0_#111111] sm:flex-row sm:text-left">
            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl border-[3px] border-[#111111] bg-[#fff7e6] text-7xl shadow-[5px_5px_0_#111111]">
              {user.avatar ?? "🦉"}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-special font-black uppercase tracking-widest">
                RUSH Player
              </p>
              <h2 className="mt-1 wrap-break-words font-rye text-3xl font-black">
                {user.username}
              </h2>
              <p className="mt-2 text-sm font-bold font-special">
                Member since {formatDate(user.createdAt)}
              </p>
              <p className="mt-4 font-fredoka text-md font-bold">Current rating</p>
              <p className="text-4xl font-fredoka font-black">{rating}</p>
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-3xl border-4 border-[#111111] bg-[#ffd23f] p-6 shadow-[6px_6px_0_#111111]">
            <p className="text-md font-black font-special uppercase tracking-widest">
              🌍 Global rank
            </p>
            <p className="mt-2 text-6xl font-rye font-black">#{rank}</p>
            <p className="mt-2 font-fredoka font-bold">{totalGames} games played</p>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border-4 border-[#111111] bg-[#22d3ee] p-4 shadow-[4px_4px_0_#111111]">
            <p className="text-md font-special font-black">Best score</p>
            <p className="mt-2 font-rye text-3xl font-black">{bestScore}</p>
          </div>

          <div className="rounded-2xl border-4 border-[#111111] bg-[#b6ff00] p-4 shadow-[4px_4px_0_#111111]">
            <p className="text-md font-special font-black">Accuracy</p>
            <p className="mt-2 font-rye text-3xl font-black">{accuracy}%</p>
          </div>

          <div className="rounded-2xl border-4 border-[#111111] bg-[#ff6fb5] p-4 shadow-[4px_4px_0_#111111]">
            <p className="text-md font-special font-black">Correct answers</p>
            <p className="mt-2 font-rye text-3xl font-black">{correctCount}</p>
          </div>

          <div className="rounded-2xl border-4 border-[#111111] bg-[#ff7a00] p-4 shadow-[4px_4px_0_#111111]">
            <p className="text-md font-special font-black">Wrong answers</p>
            <p className="mt-2 font-rye text-3xl font-black">{wrongCount}</p>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border-4 border-[#111111] bg-white p-5 shadow-[6px_6px_0_#111111] sm:p-7">
          <p className="text-sm font-special font-black uppercase tracking-widest">
            Player progress
          </p>
          <h2 className="text-2xl font-rye font-black sm:text-3xl">
            Rating history 📈
          </h2>
          <div className="mt-4">
            <RatingGraph history={ratingHistory} />
          </div>
        </section>

        <section className="mt-6 rounded-3xl border-4 border-[#111111] bg-[#b6ff00] p-5 shadow-[6px_6px_0_#111111] sm:p-7">
          <h2 className="text-2xl font-rye font-black">Rating badges 🏅</h2>
          <p className="mt-1 font-special text-sm font-bold">
            Rating milestones unlocked.
          </p>
          <RatingBadges
            rating={rating}
            userId={String(user._id)}
          />
        </section>

        <section className="mt-6 rounded-3xl border-4 border-[#111111] bg-white p-5 shadow-[6px_6px_0_#111111] sm:p-7">
          <h2 className="text-2xl font-rye font-black">
            Recent games 🎮
          </h2>

          {games.length === 0 ? (
            <p className="mt-5 font-special rounded-xl bg-[#fff7e6] p-4 font-bold">
              This player has not completed any games yet.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {games.map((game) => (
                <div
                  key={String(game._id)}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-[#111111] bg-[#fff7e6] p-4"
                >
                  <div className="min-w-0">
                    <p className="wrap-break-words font-special font-black">
                      {game.content?.title ?? "RUSH Game"}
                    </p>
                    <p className="mt-1 font-fredoka text-xs font-bold">
                      {formatDate(game.finishedAt ?? game.createdAt)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-rye font-black">
                      {game.score} pts
                    </p>
                    <p className="text-xs font-fredoka font-black">
                      {game.completed ? "COMPLETED" : "GAME OVER"}
                    </p>
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
