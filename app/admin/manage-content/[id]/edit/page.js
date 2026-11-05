
import Link from "next/link";
import { notFound } from "next/navigation";
import mongoose from "mongoose";

import { requireAdmin } from "../../../../../lib/auth.js";
import connectDB from "../../../../../lib/mongodb.js";
import Content from "../../../../models/Content.js";
import ContentForm from "../../../../components/admin/content/ContentForm.js";

export default async function EditContentPage({ params }) {
  await requireAdmin();

  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    notFound();
  }

  await connectDB();

  const content = await Content.findById(id).lean();

  if (!content) {
    notFound();
  }

  // Convert MongoDB values to plain serializable data.
  const initialData = {
    id: content._id.toString(),
    title: content.title || "",
    contentType: content.contentType || "text",
    passageDifficulty: content.passageDifficulty || "Easy",
    passage: content.passage || "",
    imageUrl: content.imageUrl || "",
    questions: (content.questions || []).map((question) => ({
      _id: question._id?.toString(),
      questionText: question.questionText || "",
      type: question.type || "mcq",
      options: question.options || [],
      correctAnswer: question.correctAnswer || "",
      acceptedAnswers: question.acceptedAnswers || [],
      difficulty: question.difficulty || "Easy",
    })),
  };

  return (
    <main className="min-h-screen bg-[#0b1020] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin/manage-content"
          className="text-sm text-cyan-300 transition hover:text-cyan-200"
        >
          ← Back to Manage Content
        </Link>

        <header className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            RUSH Control Center
          </p>

          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            Edit Content
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Update the passage, difficulty, image URL, or questions.
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/3 p-5 sm:p-7">
          <ContentForm initialData={initialData} />
        </section>
      </div>
    </main>
  );
}
