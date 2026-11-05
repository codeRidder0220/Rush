
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "../../../actions/auth.js";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogout() {
    setLoading(true);
    setMessage("");

    try {
      const result = await logout();

      if (result.success) {
        router.replace("/login");
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
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        className="rounded-xl border border-orange-400/30 bg-orange-400/10 px-4 py-2 text-sm font-semibold text-orange-300 transition hover:bg-orange-400/20 disabled:opacity-60"
      >
        {loading ? "Logging out..." : "↗ Logout"}
      </button>

      {message && (
        <p role="status" className="text-xs text-red-300">
          {message}
        </p>
      )}
    </div>
  );
}
