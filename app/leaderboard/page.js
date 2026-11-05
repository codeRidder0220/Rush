
import Link from "next/link";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import User from "@/app/models/User";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        redirect("/login");
    }

    await connectDB();

    const users = await User.find({ role: "user" })
        .select("username rating bestScore")
        .sort({ rating: -1, bestScore: -1, username: 1 })
        .limit(100)
        .lean();

    const currentUserId = String(
        currentUser._id ?? currentUser.id ?? currentUser.userId ?? ""
    );

    return (
        <main className="min-h-screen bg-[#fff7e6] px-4 py-8 text-[#111111] sm:px-8">
            <div className="mx-auto max-w-4xl">
                
                <header className="my-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    {/* Left side: heading and description */}
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
                            Leaderboard
                        </h1>

                        <p className="mt-3 font-special font-semibold text-[#111111]/70">
                            Welcome...The highest rating players are here...
                        </p>
                    </div>

                    {/* Right side: leaderboard SVG illustration */}
                    <div className="mx-auto w-full max-w-65 shrink-0 sm:mx-0 sm:w-65">
                        <svg
                            viewBox="0 0 260 220"
                            role="img"
                            aria-label="Leaderboard podium with top three players"
                            className="h-auto w-full"
                        >
                            {/* Background shape */}
                            <path
                                d="M28 36 Q12 20 34 12 L220 12 Q246 12 246 38 L246 180 Q246 202 222 202 L38 202 Q14 202 14 180 Z"
                                fill="#22d3ee"
                                stroke="#111111"
                                strokeWidth="4"
                            />

                            {/* Stars */}
                            <path d="M44 52 L49 64 L62 65 L52 74 L55 87 L44 80 L33 87 L36 74 L26 65 L39 64 Z" fill="#ffd23f" stroke="#111111" strokeWidth="2" />
                            <path d="M212 42 L216 51 L226 52 L218 59 L220 69 L212 64 L204 69 L206 59 L198 52 L208 51 Z" fill="#ff6fb5" stroke="#111111" strokeWidth="2" />

                            {/* First place */}
                            <rect x="88" y="112" width="84" height="66" rx="8" fill="#ffd23f" stroke="#111111" strokeWidth="4" />
                            <text x="130" y="153" textAnchor="middle" fontSize="28" fontWeight="900" fill="#111111">1</text>

                            {/* Second place */}
                            <rect x="34" y="134" width="58" height="44" rx="7" fill="#ffffff" stroke="#111111" strokeWidth="4" />
                            <text x="63" y="162" textAnchor="middle" fontSize="22" fontWeight="900" fill="#111111">2</text>

                            {/* Third place */}
                            <rect x="168" y="145" width="58" height="33" rx="7" fill="#ff6fb5" stroke="#111111" strokeWidth="4" />
                            <text x="197" y="168" textAnchor="middle" fontSize="20" fontWeight="900" fill="#111111">3</text>

                            {/* Trophy */}
                            <g className="origin-center animate-bounce">
                                <path d="M108 65 H152 V91 Q152 111 130 111 Q108 111 108 91 Z" fill="#ffd23f" stroke="#111111" strokeWidth="4" />
                                <path d="M108 72 H94 Q94 96 116 97" fill="none" stroke="#111111" strokeWidth="4" strokeLinecap="round" />
                                <path d="M152 72 H166 Q166 96 144 97" fill="none" stroke="#111111" strokeWidth="4" strokeLinecap="round" />
                                <path d="M122 111 V123 H138 V111" fill="#ffd23f" stroke="#111111" strokeWidth="4" />
                                <rect x="111" y="122" width="38" height="10" rx="4" fill="#ffffff" stroke="#111111" strokeWidth="4" />
                            </g>
                        </svg>
                    </div>
                </header>

                <section className="overflow-hidden rounded-3xl border-4 border-[#111111] bg-white shadow-[6px_6px_0_#111111]">
                    <div className="font-rye grid grid-cols-[64px_minmax(0,1fr)_100px] gap-2 border-b-4 border-[#111111] bg-[#22d3ee] px-4 py-4 font-black sm:grid-cols-[80px_minmax(0,1fr)_120px_120px]">
                        <span>Rank</span>
                        <span>Player</span>
                        <span className="text-right">Rating</span>
                        <span className="hidden text-right sm:block">
                            Best Score
                        </span>
                    </div>

                    {users.length === 0 ? (
                        <p className="p-6 text-center font-special font-bold">
                            No one here!
                        </p>
                    ) : (
                        users.map((player, index) => {
                            const isCurrentUser =
                                String(player._id) === currentUserId;

                            return (
                                <div
                                    key={String(player._id)}
                                    className={`grid grid-cols-[64px_minmax(0,1fr)_100px] items-center gap-2 border-b-2 border-dashed border-[#111111]/25 px-4 py-4 last:border-b-0 sm:grid-cols-[80px_minmax(0,1fr)_120px_120px] ${isCurrentUser
                                        ? "bg-[#b6ff00]"
                                        : index % 2 === 0
                                            ? "bg-white"
                                            : "bg-[#fff7e6]"
                                        }`}
                                >
                                    <span className="text-lg font-fredoka font-black">
                                        {index === 0
                                            ? "🥇"
                                            : index === 1
                                                ? "🥈"
                                                : index === 2
                                                    ? "🥉"
                                                    : `#${index + 1}`}
                                    </span>

                                    <div className="min-w-0">
                                        <Link
                                            href={`/profile/${player._id}`}
                                            className="wrap-break-words font-fredoka text-lg font-black  decoration-2 underline-offset-4 hover:text-purple-700"
                                        >
                                            {player.username}
                                        </Link>

                                        {isCurrentUser && (
                                            <span className="ml-2 text-xs font-fredoka font-bold">(You)</span>
                                        )}
                                    </div>

                                    <span className="text-right text-lg font-fredoka font-black">
                                        {player.rating ?? 500}
                                    </span>

                                    <span className="hidden text-right text-lg font-fredoka font-bold sm:block">
                                        {player.bestScore ?? 0}
                                    </span>
                                </div>
                            );
                        })
                    )}
                </section>

                <p className="mt-4 text-sm font-special font-semibold text-[#111111]/70">
                    Ranking are based on rating; in case of a tie, the higher score takes priority.
                </p>
            </div>
        </main>
    );
}
