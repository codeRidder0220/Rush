
import Link from "next/link";
import LoginForm from "../components/LoginForm.js";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#fff7e6] text-[#111] lg:grid lg:grid-cols-[37.8%_62.2%]">
      {/* LEFT PANEL */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden border-b-4 border-black bg-[#8b5cf6] px-6 py-10 text-center lg:min-h-screen lg:border-b-0 lg:border-r-4 lg:px-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            backgroundImage: "radial-gradient(#fff 2px, transparent 2px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10 w-full max-w-sm">
          <div className="inline-block -rotate-2 rounded-xl border-4 border-black bg-[#ffd23f] px-4 py-1 shadow-[4px_4px_0_#111]">
            <p className="text-xl font-fredoka font-bold sm:text-2xl">
              Read &amp; Remember
            </p>
          </div>

          {/* Cartoon face */}
          <div className="mx-auto my-8 flex h-32 w-32 items-center justify-center rounded-full border-[6px] border-black bg-[#ffd23f] text-7xl shadow-[3px_3px_0_#111]">
            👀
          </div>

          <h1 className="text-3xl font-fredoka font-black text-gray-800 leading-tight sm:text-4xl">
            Welcome
            <br />
            back, player!
          </h1>

          <div className="mt-6 flex flex-col items-center gap-2">
            <span className="font-special rotate-2 rounded-full border-[3px] border-black bg-white px-3 py-1 text-md font-bold">
              3 lives every game
            </span>

            <span className="-rotate-2 font-special rounded-full border-[3px] border-black bg-[#b6ff00] px-3 py-1 text-md font-bold">
              Keep your daily streak
            </span>

            <span className="rotate-2 font-special mt-0.5 rounded-full border-[3px] border-black bg-[#22d3ee] px-3 py-1 text-md font-bold">
              Climb the leaderboard
            </span>
          </div>
        </div>
      </section>

      {/* RIGHT PANEL */}
      <section className="relative flex items-center justify-center overflow-hidden px-4 py-10 sm:px-8 lg:min-h-screen lg:px-10 lg:py-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(#cfc5b3 1.5px, transparent 1.5px)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="sm:rotate-2 hover:rotate-0 transition relative z-10 w-full max-w-108.75 rounded-4xl border-[5px] border-black bg-white px-7 py-8 shadow-[9px_9px_0_#111] sm:px-9 sm:py-9">
          <h2 className="text-4xl font-rye font-black tracking-tight sm:text-[42px]">
            Login
          </h2>

          <p className="mt-1 font-special text-sm text-[#514b40] sm:text-base">
            Enter your details to start playing.
          </p>

          <div className="mt-6">
            <LoginForm />
          </div>

          <p className="mt-5 font-special flex flex-wrap items-center justify-center gap-2 text-sm font-bold">
            <span>New here?</span>

            <Link
              href="/signup"
              className="inline-block font-fredoka rounded-xl border-[3px] border-black bg-[#ffd23f] px-3 py-1.5 font-black shadow-[3px_3px_0_#111] transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#111]"
            >
              Create account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
