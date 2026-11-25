
"use client";

import { useState } from "react";

export default function RushAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(e) {
    e.preventDefault();

    const text = message.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Sorry! RUSH AI is temporarily unavailable.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <style jsx>{`
        @keyframes rushFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-9px) rotate(-2deg);
          }
        }

        @keyframes rushGlow {
          0%, 100% {
            box-shadow: 0 0 0 0 #ffd23f70, 3px 3px 0 #111;
          }
          50% {
            box-shadow: 0 0 0 9px #ffd23f00, 3px 3px 0 #111;
          }
        }

        @keyframes rushPop {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.94);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .rush-ai-launcher {
          animation: rushFloat 3s ease-in-out infinite,
                     rushGlow 2.5s ease-out infinite;
        }

        .rush-ai-window {
          animation: rushPop 0.3s ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .rush-ai-launcher,
          .rush-ai-window {
            animation: none;
          }
        }
      `}</style>

      {isOpen && (
        <div className="rush-ai-window mb-3 flex h-[440px] w-[min(350px,calc(100vw-40px))] flex-col overflow-hidden rounded-2xl border-2 border-black bg-white shadow-[5px_5px_0_#111]">
          <div className="flex items-center justify-between border-b-2 border-black bg-[#ffd23f] p-4">
            <div>
              <h2 className="text-lg font-black">🤖 RUSH AI</h2>
              <p className="text-xs font-bold">
                Your gaming assistant
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-2xl font-black"
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-3">
            {messages.length === 0 && (
              <div className="rounded-xl bg-[#fff7e6] p-3 text-sm font-medium">
                Hey! 👋 I'm RUSH AI. Ask me anything about gaming, quizzes or tips!
              </div>
            )}

            {messages.map((item, index) => (
              <div
                key={index}
                className={`max-w-[90%] whitespace-pre-wrap break-words rounded-xl p-3 text-sm ${
                  item.role === "user"
                    ? "ml-auto bg-[#b6ff00]"
                    : "mr-auto bg-[#fff0c2]"
                }`}
              >
                {item.text}
              </div>
            ))}

            {loading && (
              <p className="text-sm font-bold">
                RUSH AI is thinking...
              </p>
            )}
          </div>

          <form
            onSubmit={sendMessage}
            className="flex gap-2 border-t-2 border-black p-3"
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask RUSH AI..."
              className="min-w-0 flex-1 rounded-lg border-2 border-black px-3 py-2 text-sm outline-none"
            />

            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="rounded-lg border-2 border-black bg-[#b6ff00] px-3 font-black disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="rush-ai-launcher ml-auto flex items-center gap-2 rounded-full border-2 border-black bg-[#ffd23f] px-5 py-3 font-black transition-transform duration-200 hover:scale-110"
      >
        🤖 RUSH AI
      </button>
    </div>
  );
}
