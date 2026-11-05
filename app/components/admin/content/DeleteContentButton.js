
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteContent } from "../../../../actions/content.js";

export default function DeleteContentButton({ id }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this content? This action cannot be undone."
    );

    if (!confirmed) return;

    setMessage("");

    startTransition(async () => {
      const result = await deleteContent(id);

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
        onClick={handleDelete}
        disabled={isPending}
        className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs font-bold text-red-300 transition hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Deleting..." : "Delete"}
      </button>

      {message && (
        <p className="max-w-48 text-xs text-slate-400" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
