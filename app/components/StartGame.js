"use client";
import Link from "next/link";

export default function StartGame({ avatar = "🦉" }) {
  return (
    <section
      className="relative h-full overflow-hidden rounded-2xl border-4 border-[#111111] bg-[#8b5cf6] p-5 text-[#111111] shadow-[6px_6px_0_#111111] sm:p-8"
      style={{
        backgroundImage:
          "radial-gradient(#ffffff35 1.5px, transparent 1.5px)",
        backgroundSize: "18px 18px",
      }}
    >
      <div className="relative flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="max-w-xl">
          <span className="inline-block  rounded-full border-2 border-[#111111] bg-[#ffd23f] px-3 py-1 text-xs font-black tracking-wide">
            ★ READY, PLAYER?
          </span>

          <h2 className="mt-4 text-3xl font-fredoka font-black leading-tight tracking-tight sm:text-4xl">
            Ready to test
            <br />
            your memory?
          </h2>

          <p className="mt-3 font-special max-w-md text-sm font-semibold leading-6 sm:text-base">
            Read it. Remember it. Beat the challenge!
            You have 3 lives. Make every answer count.
          </p>

          <Link
            href="/game/loading"
            onClick={() => {
              sessionStorage.removeItem("readingSessionId");
            }}
            className="group mt-6 font-rye inline-flex items-center justify-center rounded-xl border-4 border-[#111111] bg-[#b6ff00] px-6 py-3 font-black shadow-[4px_4px_0_#111111] transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0_#111111] active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <span>START GAME</span>
            <span className="ml-3 text-xl transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl border-[3px] border-[#111111] bg-[#fff7e6] text-7xl shadow-[5px_5px_0_#111111] sm:h-40 sm:w-40">
          {avatar}
        </div>
      </div>
    </section>
  );
}
