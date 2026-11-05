
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateAvatar } from "../../../actions/profile.js";

const avatars = [
    "🦉", "🐸", "🦊", "🐼", "🐵", "🐱",
    "🦁", "🦖", "👽", "🤖", "👻", "🦄",
    "💀", "🥷", "🤡", "🐧", "🦝", "🐻",
];

export default function AvatarPicker({ currentAvatar = "🦉" }) {
    const [selected, setSelected] = useState(currentAvatar);
    const [isOpen, setIsOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const router = useRouter();

    async function handleSave() {
        setSaving(true);
        setMessage("");

        try {
            const result = await updateAvatar(selected);

            if (!result.success) {
                setMessage(result.message || "The avatar wasn't save.");
                return;
            }

            setSelected(result.avatar);
            setIsOpen(false);
            setMessage("Avatar saved!");
            router.refresh();
        } catch {
            setMessage("Something went wrong! please try again.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="flex flex-col items-center gap-3">
            <button
                type="button"
                onClick={() => {
                    setSelected(currentAvatar);
                    setMessage("");
                    setIsOpen(true);
                }}
                aria-label="Change avatar"
                className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#111111] bg-[#6bf7d6]  text-5xl shadow-[5px_5px_0_#111111] transition hover:-translate-y-1"
            >
                {currentAvatar}
            </button>

            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="rounded-full  font-special border-2 border-[#111111] bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0_#111111] hover:cursor-pointer hover:scale-103 transition"
            >
                Change avatar ✨
            </button>

            {message && (
                <p role="status" className="text-sm font-bold">
                    {message}
                </p>
            )}

            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                    onClick={() => !saving && setIsOpen(false)}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="avatar-title"
                        className="w-full max-w-md rounded-3xl border-4 border-[#111111] bg-[#fff7e6] p-5 shadow-[8px_8px_0_#111111]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h2
                            id="avatar-title"
                            className="text-2xl font-rye font-black"
                        >
                            Pick your player 🕹️
                        </h2>

                        <p className="mt-1 font-special text-sm">
                            Please select your favourite avatar...
                        </p>

                        <div className="mt-5 grid grid-cols-6 gap-2">
                            {avatars.map((avatar) => (
                                <button
                                    key={avatar}
                                    type="button"
                                    onClick={() => setSelected(avatar)}
                                    aria-label={`Select ${avatar}`}
                                    aria-pressed={selected === avatar}
                                    className={`flex aspect-square items-center justify-center rounded-xl border-2 border-[#111111] text-2xl ${selected === avatar
                                        ? "bg-[#b6ff00] shadow-[3px_3px_0_#111111]"
                                        : "bg-white"
                                        }`}
                                >
                                    {avatar}
                                </button>
                            ))}
                        </div>

                        {message && (
                            <p role="alert" className="mt-3 text-sm font-bold text-red-600">
                                {message}
                            </p>
                        )}

                        <div className="mt-5 flex gap-3">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                disabled={saving}
                                className="flex-1 rounded-xl font-rye border-2 border-[#111111] bg-white px-3 py-3 font-black"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 font-rye rounded-xl border-2 border-[#111111] bg-[#ffd23f] px-3 py-3 font-black shadow-[3px_3px_0_#111111] disabled:opacity-60"
                            >
                                {saving ? "Saving..." : "Save avatar"}
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}
