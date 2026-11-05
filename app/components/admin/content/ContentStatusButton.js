
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateContentStatus } from "../../../../actions/content.js";

export default function ContentStatusButton({ id, status }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const nextStatus = status === "published" ? "draft" : "published";

  function handleClick() {
    setMessage("");

    startTransition(async () => {
      const result = await updateContentStatus(id, nextStatus);

      setMessage(result.message);

      if (result.success) {
        router.refresh();
      }
    });
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={`rounded-lg border px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
          status === "published"
            ? "border-orange-400/30 bg-orange-400/10 text-orange-300 hover:bg-orange-400/20"
            : "border-lime-400/30 bg-lime-400/10 text-lime-300 hover:bg-lime-400/20"
        }`}
      >
        {isPending
          ? "Updating..."
          : status === "published"
            ? "Unpublish"
            : "Publish"}
      </button>

      {message && (
        <p className="max-w-48 text-xs text-slate-400" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
