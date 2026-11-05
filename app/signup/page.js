
import Link from "next/link";
import SignupForm from "../components/SignupForm";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-[#fff7e6] text-[#111] lg:grid lg:grid-cols-[37.8%_62.2%]">
      {/* LEFT PANEL */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden border-b-4 border-black bg-[#22cde5] px-6 py-10 text-center lg:min-h-screen lg:border-b-0 lg:border-r-4 lg:px-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            backgroundImage: "radial-gradient(#111 2px, transparent 2px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10 w-full max-w-sm">
          <div className="inline-block -rotate-2 rounded-xl border-4 border-black bg-[#ffd23f] px-4 py-1 shadow-[4px_4px_0_#111]">
            <p className="text-xl font-fredoka font-black sm:text-2xl">
              Read &amp; Remember
            </p>
          </div>

          <div className="mx-auto my-8 flex h-28 w-28 items-center justify-center rounded-full border-[6px] border-black bg-[#ffd23f] text-7xl shadow-[3px_3px_0_#111] sm:h-32 sm:w-32">
            😊
          </div>

          <h1 className="text-3xl font-fredoka font-black sm:text-4xl">
            Join the game!
          </h1>

          <div className="mt-6 space-y-3 text-left">
            {[
              ["1", "Make your account", "#b6ff00"],
              ["2", "Memorize the passage", "#ff6fb5"],
              ["3", "Beat the leaderboard", "#ffd23f"],
            ].map(([number, label, color]) => (
              <div key={number} className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[3px] border-black text-lg font-black"
                  style={{ backgroundColor: color }}
                >
                  {number}
                </span>
                <span className="text-sm font-special font-bold sm:text-base">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RIGHT PANEL */}
      <section className="relative flex items-center justify-center overflow-hidden px-4 py-10 sm:px-8 lg:min-h-screen lg:px-10 lg:py-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage: "radial-gradient(#cfc5b3 1.5px, transparent 1.5px)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="sm:rotate-2 hover:rotate-0 transition relative z-10 w-full max-w-107.5 rounded-[26px] border-4 border-black bg-white px-6 py-7 shadow-[8px_8px_0_#111] sm:px-8 sm:py-8">
          <h2 className="text-4xl font-rye font-black tracking-tight sm:text-[42px]">
            Sign Up
          </h2>

          <div className="mt-6">
            <SignupForm />
          </div>

          <p className="mt-5 font-special text-center text-sm font-semibold">
            Already a player?{" "}
            <Link
              href="/login"
              className="ml-1 font-fredoka inline-block rounded-lg border-[3px] border-black bg-[#ffd23f] px-3 py-1 font-black shadow-[3px_3px_0_#111] transition hover:-translate-y-0.5"
            >
              Login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
