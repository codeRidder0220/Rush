
"use client";

import { useState } from "react";
import { signup } from "../../actions/auth.js";

export default function SignupForm() {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setSuccess(false);
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const result = await signup(formData);

      setMessage(result.message);
      setSuccess(result.success);

      if (result.success) {
        form.reset();
        window.location.href =
          result.role === "admin" ? "/admin" : "/";
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-[15px] border-[3px] border-black bg-white px-4 py-3 text-base font-medium text-[#111] shadow-[3px_4px_0_#111] outline-none placeholder:text-[#777] focus:border-[#8b5cf6] focus:shadow-[4px_4px_0_#22d3ee]";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="username"
          className="mb-1 font-fredoka block text-md font-bold"
        >
          Display name
        </label>
        <input
          id="username"
          name="username"
          type="text"
          minLength={3}
          maxLength={30}
          placeholder="Choose a username"
          autoComplete="username"
          required
          className={inputClass}
        />
        <p className="mt-1 font-special text-xs text-[#555044]">
          This name shows on the leaderboard.
        </p>
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1 font-fredoka block text-md font-bold"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1 font-fredoka block text-md font-bold"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          minLength={8}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          required
          className={inputClass}
        />
        <p className="mt-1 font-special text-xs text-[#555044]">
          At least 8 characters.
        </p>
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
        className="w-full font-fredoka rounded-2xl border-4 border-black bg-[#b6ff00] px-3 py-3 text-xl font-black uppercase shadow-[5px_5px_0_#111] transition hover:translate-y-0.5 hover:shadow-[3px_3px_0_#111] disabled:cursor-not-allowed disabled:opacity-60 sm:text-2xl"
      >
        {loading ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
}
