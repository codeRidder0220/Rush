"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoadingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/game");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    // yahan tumhara existing loading page JSX rahega
   
    <main
      className="flex min-h-screen items-center justify-center bg-[#8b5cf6] px-4 py-8 text-[#111111]"
      style={{
        backgroundImage:
          "radial-gradient(#ffffff40 1.5px, transparent 1.5px)",
        backgroundSize: "20px 20px",
      }}
    >
      <section className="-rotate-2 sm:-rotate-3 w-full max-w-xl rounded-2xl border-4 border-[#111111] bg-[#fff7e6] p-7 text-center shadow-[7px_7px_0_#111111] sm:p-10">
        <div className="mx-auto flex h-24 w-24 animate-bounce items-center justify-center rounded-2xl border-[3px] border-[#111111] bg-[#ffd23f] text-6xl shadow-[4px_4px_0_#111111]">
          🦉
        </div>

        <p className="mt-7 text-xs font-rye font-black tracking-[0.2em] text-[#8b5cf6]">
          RUSH ARCADE
        </p>

        <h1 className="mt-2 font-fredoka text-3xl font-black tracking-tight sm:text-6xl">
          GET READY!
        </h1>

        <p className="mt-3 text-lg font-fredoka font-semibold leading-6 text-[#444444]">
          Your next memory challenge
          <br />
          is getting ready...
        </p>

        <div
          className="mt-8 h-7 overflow-hidden rounded-lg border-[3px] border-[#111111] bg-white p-1"
          role="progressbar"
          aria-label="Game loading preview"
        >
          <div
            className="h-full w-2/3 animate-pulse rounded-sm"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, #ff6fb5 0px, #ff6fb5 10px, #ffd23f 10px, #ffd23f 20px)",
            }}
          />
        </div>

        <p className="mt-4 text-lg font-fredoka font-bold text-[#555555]">
          SHARPEN YOUR MEMORY ✦
        </p>
      </section>
    </main>
  );

}
