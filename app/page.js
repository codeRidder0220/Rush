import Navbar from "./components/Navbar";
import StatsCards from "./components/StateCards";
import StartGame from "./components/StartGame";
import DashboardPanels from "./components/DashboardPanel";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../lib/auth.js";
import connectDB from "../lib/mongodb.js";
import User from "./models/User.js";
import GameResult from "./models/GameResult.js";
import Content from "./models/Content.js";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
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
          <Navbar />

          <section className="mx-auto mt-8 flex min-h-65 w-full max-w-md flex-col items-center justify-center rounded-2xl border-2 border-black bg-white px-6 py-10 text-center shadow-[5px_5px_0_#111] sm:min-h-175 sm:px-8">
            <h2 className="font-fredoka text-3xl font-black sm:text-4xl">
              READY TO RUSH?
            </h2>

            <p className="font-special  mt-4 text-xl font-bold">
              Sign up or log in to start playing and track your progress.
            </p>

            {/* Animated game illustration */}
            <div className="my-8 w-full max-w-65">
              <svg
                viewBox="0 0 300 260"
                role="img"
                aria-label="Animated RUSH memory game illustration"
                className="h-auto w-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                <style>
                  {`
          @keyframes rushFloat {
            0%, 100% { transform: translateY(0px) rotate(-3deg); }
            50% { transform: translateY(-12px) rotate(3deg); }
          }

          @keyframes rushPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.08); }
          }

          @keyframes rushTwinkle {
            0%, 100% { opacity: 0.35; }
            50% { opacity: 1; }
          }

          .rush-owl {
            transform-box: fill-box;
            transform-origin: center;
            animation: rushFloat 2.5s ease-in-out infinite;
          }

          .rush-star {
            transform-box: fill-box;
            transform-origin: center;
            animation: rushPulse 1.8s ease-in-out infinite;
          }

          .rush-twinkle {
            animation: rushTwinkle 1.5s ease-in-out infinite;
          }
        `}
                </style>

                {/* Floating game cards */}
                <g className="rush-float">
                  <rect
                    x="25"
                    y="72"
                    width="66"
                    height="82"
                    rx="12"
                    fill="#ff6fb5"
                    stroke="#111111"
                    strokeWidth="5"
                    transform="rotate(-14 58 113)"
                  />
                  <text
                    x="58"
                    y="123"
                    fontSize="35"
                    textAnchor="middle"
                    transform="rotate(-14 58 113)"
                  >
                    ?
                  </text>

                  <rect
                    x="210"
                    y="70"
                    width="66"
                    height="82"
                    rx="12"
                    fill="#22d3ee"
                    stroke="#111111"
                    strokeWidth="5"
                    transform="rotate(13 243 111)"
                  />
                  <text
                    x="243"
                    y="120"
                    fontSize="35"
                    textAnchor="middle"
                    transform="rotate(13 243 111)"
                  >
                    ★
                  </text>
                </g>

                {/* Owl mascot */}
                <g className="rush-owl">
                  <rect
                    x="89"
                    y="53"
                    width="122"
                    height="150"
                    rx="34"
                    fill="#ffd23f"
                    stroke="#111111"
                    strokeWidth="6"
                  />
                  <path
                    d="M105 83 L98 45 L132 65 M195 83 L202 45 L168 65"
                    fill="#8b5cf6"
                    stroke="#111111"
                    strokeWidth="6"
                    strokeLinejoin="round"
                  />
                  <ellipse cx="130" cy="112" rx="25" ry="29" fill="white" stroke="#111111" strokeWidth="5" />
                  <ellipse cx="170" cy="112" rx="25" ry="29" fill="white" stroke="#111111" strokeWidth="5" />
                  <circle cx="136" cy="115" r="9" fill="#111111" />
                  <circle cx="164" cy="115" r="9" fill="#111111" />
                  <path d="M143 137 L157 137 L150 150 Z" fill="#ff7a00" stroke="#111111" strokeWidth="3" />
                  <path d="M119 166 Q150 183 181 166" fill="none" stroke="#111111" strokeWidth="5" strokeLinecap="round" />
                </g>

                {/* Sparkles */}
                <g className="rush-star" fill="#8b5cf6">
                  <path d="M45 35 L51 49 L65 55 L51 61 L45 75 L39 61 L25 55 L39 49 Z" />
                  <path d="M250 175 L256 189 L270 195 L256 201 L250 215 L244 201 L230 195 L244 189 Z" />
                </g>

                <g className="rush-twinkle" fill="#ff6fb5">
                  <circle cx="78" cy="205" r="7" />
                  <circle cx="225" cy="35" r="8" />
                  <circle cx="38" cy="180" r="5" />
                </g>

                {/* Base */}
                <rect
                  x="75"
                  y="220"
                  width="150"
                  height="18"
                  rx="9"
                  fill="#b6ff00"
                  stroke="#111111"
                  strokeWidth="5"
                />
              </svg>
            </div>

            <div className="mt-2 flex w-full flex-col gap-3">
              <a
                href="/signup"
                className="font-rye rounded-xl border-2 border-black bg-[#b6ff00] px-5 py-3 font-bold shadow-[3px_3px_0_#111] transition hover:-translate-y-1 hover:shadow-[5px_5px_0_#111]"
              >
                Create Account
              </a>

              <a
                href="/login"
                className="font-rye  rounded-xl border-2 border-black bg-[#ffd23f] px-5 py-3 font-bold shadow-[3px_3px_0_#111] transition hover:-translate-y-1 hover:shadow-[5px_5px_0_#111]"
              >
                Login
              </a>
            </div>
          </section>
        </div>
      </main>
    );
  }

  await connectDB();

  const leaderboardUsers = await User.find({ role: "user" })
    .select("username rating bestScore")
    .sort({ rating: -1, bestScore: -1, username: 1 })
    .limit(3)
    .lean();

  const topPlayers = leaderboardUsers.map((player) => ({
    id: String(player._id),
    username: player.username,
    rating: player.rating ?? 500,
    bestScore: player.bestScore ?? 0,
  }));

  const userId = user._id ?? user.id ?? user.userId;

  // Fresh user data MongoDB se lo
  const dashboardUser = await User.findById(userId)
    .select("bestScore dailyStreak lastStreakDate maxStreak")
    .lean();

  // India timezone ki date hamesha YYYY-MM-DD format me
  function getIndiaDate(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);

    const year = parts.find((part) => part.type === "year").value;
    const month = parts.find((part) => part.type === "month").value;
    const day = parts.find((part) => part.type === "day").value;

    return `${year}-${month}-${day}`;
  }

  const today = getIndiaDate(new Date());

  // Kal ki date calculate karo — timezone conversion ke bina
  const [year, month, day] = today.split("-").map(Number);

  const yesterdayDate = new Date(
    Date.UTC(year, month - 1, day - 1)
  );

  const yesterday = [
    yesterdayDate.getUTCFullYear(),
    String(yesterdayDate.getUTCMonth() + 1).padStart(2, "0"),
    String(yesterdayDate.getUTCDate()).padStart(2, "0"),
  ].join("-");

  // MongoDB me saved last streak date
  const lastStreakDate = dashboardUser?.lastStreakDate
    ? getIndiaDate(new Date(dashboardUser.lastStreakDate))
    : null;

  // Dashboard par streak sirf tab dikhe jab aaj game khela ho
  const currentStreak =
    lastStreakDate === today
      ? dashboardUser?.dailyStreak ?? 0
      : 0;

  void Content;

  const historyResults = await GameResult.find({ user: userId })
    .populate("content", "title")
    .sort({ finishedAt: -1, createdAt: -1 })
    .limit(3)
    .lean();

  const gameHistory = historyResults.map((game) => ({
    id: String(game._id),
    title: game.content?.title ?? "RUSH Game",
    score: game.score ?? 0,
    completedAt: (game.finishedAt ?? game.createdAt).toISOString(),
    completed: game.completed ?? false,
  }));

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
        <Navbar username={user.username} avatar={user.avatar ?? "🦉"} />

        <section className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1.3fr_1fr] lg:items-stretch">
          <div className="min-w-0 lg:h-87.5">
            <StartGame avatar={user.avatar ?? "🦉"} />
          </div>

          <div className="min-w-0 lg:h-87.5">
            <StatsCards
              bestScore={dashboardUser?.bestScore ?? 0}
              dailyStreak={currentStreak}
              maxStreak={dashboardUser?.maxStreak ?? 0}
            />
          </div>
        </section>

        <DashboardPanels
          leaderboardUsers={topPlayers}
          gameHistory={gameHistory}
        />
      </div>
    </main>
  );
}