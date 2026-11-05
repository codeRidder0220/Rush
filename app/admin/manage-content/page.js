
import Link from "next/link";
import { requireAdmin } from "../../../lib/auth.js";
import connectDB from "../../../lib/mongodb.js";
import Content from "../../models/Content.js";
import ContentStatusButton from "../../components/admin/content/ContentStatusButton.js";
import DeleteContentButton from "../../components/admin/content/DeleteContentButton.js";


export default async function ManageContentPage() {
    await requireAdmin();
    await connectDB();

    const contentList = await Content.find({})
        .select("title contentType passageDifficulty questions status createdAt")
        .sort({ createdAt: -1 })
        .lean();

    const contents = contentList.map((item) => ({
        id: item._id.toString(),
        title: item.title,
        contentType: item.contentType,
        difficulty: item.passageDifficulty,
        questionCount: item.questions?.length ?? 0,
        status: item.status,
        createdAt: item.createdAt
            ? new Date(item.createdAt).toLocaleDateString("en-IN")
            : "—",
    }));

    const publishedCount = contents.filter(
        (item) => item.status === "published"
    ).length;

    const draftCount = contents.filter(
        (item) => item.status === "draft"
    ).length;

    return (
        <main className="min-h-screen bg-[#0b1020] px-4 py-8 text-white sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-6xl">
                <Link
                    href="/admin"
                    className="text-sm font-semibold text-cyan-300 hover:text-cyan-200"
                >
                    ← Back to Dashboard
                </Link>

                <header className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
                            RUSH Control Center
                        </p>
                        <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                            Manage Content
                        </h1>
                        <p className="mt-2 text-sm text-slate-400">
                            View and organize your passages, images and questions.
                        </p>
                    </div>

                    <Link
                        href="/admin/content"
                        className="w-fit rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                    >
                        + Add Content
                    </Link>
                </header>

                <section className="mt-8 grid gap-4 sm:grid-cols-3">
                    <StatCard label="Total Content" value={contents.length} />
                    <StatCard label="Published" value={publishedCount} />
                    <StatCard label="Drafts" value={draftCount} />
                </section>

                <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#11172b]">
                    <div className="border-b border-white/10 p-5 sm:p-6">
                        <h2 className="text-xl font-bold">Content Library</h2>
                        <p className="mt-1 text-sm text-slate-400">
                            Newest content appears first.
                        </p>
                    </div>

                    {contents.length === 0 ? (
                        <div className="px-5 py-16 text-center">
                            <p className="text-4xl">📂</p>
                            <h3 className="mt-4 text-lg font-bold">Nothing here yet</h3>
                            <p className="mt-2 text-sm text-slate-400">
                                Add your first passage or image to build your library.
                            </p>
                            <Link
                                href="/admin/content"
                                className="mt-5 inline-block rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-300"
                            >
                                Create Content
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Desktop table */}
                            <div className="hidden overflow-x-auto md:block">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-white/5 text-slate-400">
                                        <tr>
                                            <th className="px-5 py-4 font-medium">Title</th>
                                            <th className="px-5 py-4 font-medium">Type</th>
                                            <th className="px-5 py-4 font-medium">Difficulty</th>
                                            <th className="px-5 py-4 font-medium">Questions</th>
                                            <th className="px-5 py-4 font-medium">Status</th>
                                            <th className="px-5 py-4 font-medium">Created</th>
                                            <th className="px-5 py-4 font-medium">Publish /Unpublish /Edit /Delete</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-white/10">
                                        {contents.map((item) => (
                                            <tr key={item.id} className="hover:bg-white/3">
                                                <td className="max-w-xs wrap-break-words px-5 py-4 font-semibold">
                                                    {item.title}
                                                </td>
                                                <td className="px-5 py-4 text-slate-300">
                                                    {item.contentType === "text" ? "📖 Text" : "🖼️ Image"}
                                                </td>
                                                <td className="px-5 py-4 text-slate-300">
                                                    {item.difficulty}
                                                </td>
                                                <td className="px-5 py-4 text-slate-300">
                                                    {item.questionCount}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <StatusBadge status={item.status} />
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-slate-400">
                                                    {item.createdAt}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        
                                                        
                                                        <DeleteContentButton id={item.id} />
                                                        <Link
                                                            href={`/admin/manage-content/${item.id}/edit`}
                                                            className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-400/20"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <ContentStatusButton id={item.id} status={item.status} />

                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>


                            {/* Mobile cards */}
                            <div className="space-y-3 p-4 md:hidden">
                                {contents.map((item) => (
                                    <article
                                        key={item.id}
                                        className="rounded-xl border border-white/10 bg-[#0b1020] p-4"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className="wrap-break-words font-bold">{item.title}</h3>
                                            <StatusBadge status={item.status} />
                                        </div>

                                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <p className="text-xs text-slate-500">Type</p>
                                                <p className="mt-1 text-slate-300">
                                                    {item.contentType === "text" ? "📖 Text" : "🖼️ Image"}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-slate-500">Difficulty</p>
                                                <p className="mt-1 text-slate-300">{item.difficulty}</p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-slate-500">Questions</p>
                                                <p className="mt-1 text-slate-300">{item.questionCount}</p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-slate-500">Created</p>
                                                <p className="mt-1 text-slate-300">{item.createdAt}</p>
                                            </div>
                                        </div>



                                        {/* Publish / Unpublish button/ edit /delete */}
                                        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
                                            <Link
                                                href={`/admin/manage-content/${item.id}/edit`}
                                                className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-400/20"
                                            >
                                                Edit
                                            </Link>

                                            <ContentStatusButton
                                                id={item.id}
                                                status={item.status}
                                            />

                                            <DeleteContentButton id={item.id} />
                                        </div>

                                    </article>
                                ))}

                            </div>

                        </>
                    )}
                </section>
            </div>
        </main>
    );
}

function StatCard({ label, value }) {
    return (
        <article className="rounded-2xl border border-white/10 bg-[#11172b] p-5">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-black text-cyan-300">{value}</p>
        </article>
    );
}

function StatusBadge({ status }) {
    const published = status === "published";

    return (
        <span
            className={`inline-flex whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold ${published
                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                : "border-orange-400/30 bg-orange-400/10 text-orange-300"
                }`}
        >
            {published ? "Published" : "Draft"}
        </span>
    );
}
