
import Link from "next/link";
import { requireAdmin } from "../../../lib/auth.js";
import ContentForm from "../../components/admin/content/ContentForm.js";

export default async function AddContentPage() {
  const admin = await requireAdmin();

  return (
    <main className="min-h-screen bg-[#0b1020] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <Link
          href="/admin"
          className="text-sm font-semibold text-cyan-400 transition hover:text-cyan-300"
        >
          ← Back to Admin Dashboard
        </Link>

        <header className="mt-6">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
            RUSH Control Center
          </p>

          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            Add New Content
          </h1>

          <p className="mt-3 text-sm text-slate-400 sm:text-base">
            Welcome, {admin.username}. Create a passage or image for your game.
          </p>
        </header>

        <section className="mt-8">
           <ContentForm /> 
        </section>
      </div>
    </main>
  );
}
