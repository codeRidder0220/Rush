
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "../../actions/auth.js";
import Link from "next/link";

export default function Navbar({ username, avatar = "🦉" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogout() {
    setLoading(true);
    setMessage("");

    try {
      const result = await logout();

      if (result.success) {
        router.replace("/");
        router.refresh();
      } else {
        setMessage(result.message || "Logout failed");
        setLoading(false);
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <nav className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[3px] border-[#111111] bg-[#ffd23f] text-2xl shadow-[2px_2px_0_#111111]">
          🦉
        </div>

        <div className="-rotate-3 rounded-xl border-4 border-[#111111] bg-[#ffd23f] px-3 py-1 shadow-[4px_4px_0_#111111] sm:px-4">
          <h1 className="font-rye text-lg font-bold leading-tight sm:text-2xl">
            RUSH.
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {username ? (
          <>
            <Link
              href="/profile"
              aria-label={`Open ${username || "Player"}'s profile`}
              className="flex items-center gap-2 rounded-full border-[3px] border-[#111111] bg-white py-1.5 pl-2 pr-3 shadow-[2px_2px_0_#111111] transition hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#111111] sm:gap-3 sm:pl-2.5 sm:pr-4"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#111111] bg-[#6bf7d6] text-xl sm:h-10 sm:w-10">
                {avatar}
              </span>

              <span className="max-w-28 font-rye truncate text-xs font-black sm:max-w-none sm:text-sm">
                Hii, {username || "Player"}
              </span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loading}
              className="rounded-full font-rye border-4 border-[#111111] bg-[#ff6fb5] px-3 py-2 text-xs font-black shadow-[2px_2px_0_#111111] transition hover:-translate-y-0.5 disabled:opacity-60 sm:px-4 sm:text-sm"
            >
              {loading ? "Logging out..." : "Logout"}
            </button>
          </>
        ) : (
          <>
            <Link
              href="/signup"
              className="font-rye rounded-full border-4 border-[#111111] bg-[#ff6fb5] px-3 py-2 text-xs font-black shadow-[2px_2px_0_#111111] transition hover:-translate-y-0.5 disabled:opacity-60 sm:px-4 sm:text-sm"
            >
              Signup
            </Link>

            <Link
              href="/login"
              className="font-rye rounded-full border-4 border-[#111111] bg-[#ff6fb5] px-3 py-2 text-xs font-black shadow-[2px_2px_0_#111111] transition hover:-translate-y-0.5 disabled:opacity-60 sm:px-4 sm:text-sm"
            >
              Login
            </Link>
          </>
        )}
      </div>


      {message && (
        <p role="alert" className="w-full text-sm font-bold text-red-600">
          {message}
        </p>
      )}
    </nav>
  );
}




