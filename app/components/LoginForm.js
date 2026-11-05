
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../actions/auth.js";

export default function LoginForm() {
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setMessage("");
    setSuccess(false);
    setLoading(true);

    try {
      const result = await login(formData);

      setMessage(result.message);
      setSuccess(result.success);

      if (result.success) {
        const destination =
          result.role === "admin" ? "/admin" : "/";

        router.replace(destination);
        router.refresh();
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-[15px] border-[3px] border-black bg-white px-4 py-3 text-base font-medium text-[#111111] shadow-[3px_4px_0_#111111] outline-none placeholder:text-[#777777] focus:border-[#8b5cf6] focus:shadow-[4px_4px_0_#22d3ee]";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="mb-2 font-fredoka block text-md font-bold text-[#111111]"
        >
          Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 font-fredoka block text-md font-bold text-[#111111]"
        >
          Password
        </label>

        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          required
          className={inputClass}
        />
      </div>

      {message && (
        <p
          role="status"
          className={`rounded-lg border-2 px-3 py-2 text-sm font-bold ${
            success
              ? "border-lime-500 bg-lime-100 text-green-800"
              : "border-red-500 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full font-fredoka rounded-2xl border-4 border-black bg-[#b6ff00] px-3 py-3 text-2xl font-black uppercase text-black shadow-[5px_5px_0_#111] transition hover:translate-y-0.5 hover:shadow-[3px_3px_0_#111] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
