import { requireAdmin } from "../../lib/auth.js";
import connectDB from "../../lib/mongodb.js";
import Content from "../models/Content.js";
import Link from "next/link";
import LogoutButton from "../components/admin/LogoutButton.js";



function getStats(totalContent, publishedContent, draftContent) {
    return [
        {
            title: "Total Content",
            value: totalContent,
            description: "Passages and images",
            icon: "📚",
            accent: "border-violet-500/40 bg-violet-500/10",
            color: "text-violet-300",
        },
        {
            title: "Published",
            value: publishedContent,
            description: "Available in game",
            icon: "✅",
            accent: "border-emerald-500/40 bg-emerald-500/10",
            color: "text-emerald-300",
        },
        {
            title: "Drafts",
            value: draftContent,
            description: "Not published yet",
            icon: "📝",
            accent: "border-orange-500/40 bg-orange-500/10",
            color: "text-orange-300",
        },
    ];
}


const navigation = [
    { label: "Dashboard", icon: "⌂", href: "/admin", active: true },
    { label: "Add Content", icon: "＋", href: "/admin/content" },
    { label: "Manage Content", icon: "☷", href: "/admin/manage-content" },
];

export default async function AdminPage() {
    const admin = await requireAdmin();

    await connectDB();

    const [totalContent, publishedContent, draftContent] = await Promise.all([   //3eeno query ko parallel chlayega , bcz ek ke baad ek wait na krna pde
        Content.countDocuments({}),   //sare content document count krega 
        Content.countDocuments({ status: "published" }),  // only published count krega
        Content.countDocuments({ status: "draft" }),  //only draft
    ]);

    const stats = getStats(totalContent, publishedContent, draftContent);

    const recentContent = await Content.find({})
        .select("title contentType passageDifficulty status createdAt")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

    return (
        <main className="min-h-screen w-full overflow-x-hidden bg-[#0b1020] text-white">
            <header className="border-b border-white/10 bg-[#10132b]">
                <div className="mx-auto flex max-w-[1600px] flex-row items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
                    <div>
                        <h1 className="text-3xl font-black tracking-wider text-cyan-400">
                            RUSH<span className="text-orange-400">.</span>
                        </h1>
                        <p className="text-xs text-slate-400">
                            Read. Remember. Rush.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-3">
                        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2">
                            <span className="text-2xl">👾</span>
                            <div>
                                <p className="font-semibold">{admin.username}</p>
                                <p className="text-xs text-cyan-300">Administrator</p>
                            </div>
                        </div>

                        <LogoutButton />
                    </div>
                </div>
            </header>

            <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[230px_minmax(0,1fr)]">
                <aside className="border-b border-white/10 p-4 lg:min-h-[calc(100vh-85px)] lg:border-b-0 lg:border-r">
                    <p className="px-3 pb-3 pt-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                        Control Panel
                    </p>

                    <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${item.active
                                    ? "border border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                                    : "text-slate-300 hover:bg-white/5"
                                    }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-8 hidden rounded-2xl border border-violet-400/20 bg-violet-400/5 p-4 lg:block">
                        <p className="text-2xl">🎮</p>
                        <p className="mt-2 font-bold">Ready, Admin?</p>
                        <p className="mt-1 text-sm leading-6 text-slate-400">
                            Great content makes great games.
                        </p>
                    </div>
                </aside>

                <section className="min-w-0 p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
                                RUSH Control Center
                            </p>
                            <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                                Admin Dashboard
                            </h2>
                            <p className="mt-2 text-sm text-slate-400 sm:text-base">
                                Manage your game content, passages and questions.
                            </p>
                        </div>

                        <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300">
                            🛡️ Admin access
                        </span>
                    </div>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {stats.map((stat) => (
                            <article
                                key={stat.title}
                                className={`rounded-2xl border p-5 ${stat.accent}`}
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <p className="font-semibold text-slate-200">
                                        {stat.title}
                                    </p>
                                    <span className="text-2xl">{stat.icon}</span>
                                </div>

                                <p className={`mt-5 text-4xl font-black ${stat.color}`}>
                                    {stat.value}
                                </p>
                                <p className="mt-2 text-sm text-slate-400">
                                    {stat.description}
                                </p>
                            </article>
                        ))}
                    </div>

                    <section className="mt-8 rounded-2xl border border-white/10 bg-[#11172b] p-5 sm:p-6">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">⚡</span>
                            <div>
                                <h3 className="text-xl font-bold">Quick Actions</h3>
                                <p className="mt-1 text-sm text-slate-400">
                                    Start building your game content.
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                            <Link
                                href="/admin/content"
                                className="block rounded-xl border border-violet-400/30 bg-violet-500/10 p-5 transition hover:bg-violet-500/15"
                            >
                                <p className="text-lg font-bold text-violet-200">
                                    ＋ Add New Content
                                </p>
                                <p className="mt-2 text-sm leading-6 text-slate-400">
                                    Create a passage or add an image with its questions.
                                </p>
                                <p className="mt-4 text-xs font-semibold text-violet-300">
                                    OPEN CONTENT FORM →
                                </p>
                            </Link>

                            <Link
                                href="/admin/manage-content"
                                className="block rounded-xl border border-cyan-400/30 bg-cyan-500/10 p-5 transition hover:bg-cyan-500/15"
                            >
                                <p className="text-lg font-bold text-cyan-200">
                                    ☷ Manage Content
                                </p>
                                <p className="mt-2 text-sm leading-6 text-slate-400">
                                    View, edit, delete and publish your existing content.
                                </p>
                                <p className="mt-4 text-xs font-semibold text-cyan-300">
                                    OPEN CONTENT LIBRARY →
                                </p>
                            </Link>

                        </div>
                    </section>


                    <section className="mt-6 rounded-2xl border border-white/10 bg-[#11172b] p-5 sm:p-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <h3 className="text-xl font-bold">Recent Content</h3>

                            <Link
                                href="/admin/manage-content"
                                className="text-sm font-semibold text-cyan-300 hover:text-cyan-200"
                            >
                                View All →
                            </Link>
                        </div>

                        {recentContent.length === 0 ? (
                            <div className="mt-5 rounded-xl border border-dashed border-white/15 px-4 py-10 text-center">
                                <p className="text-4xl">📂</p>
                                <p className="mt-3 font-semibold">No content yet</p>
                                <p className="mt-2 text-sm text-slate-400">
                                    Add your first passage or image to get started.
                                </p>

                                <Link
                                    href="/admin/content"
                                    className="mt-4 inline-block rounded-xl bg-cyan-400 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-300"
                                >
                                    + Add Content
                                </Link>
                            </div>
                        ) : (
                            <div className="mt-5 space-y-3">
                                {recentContent.map((item) => (
                                    <article
                                        key={item._id.toString()}
                                        className="flex flex-col justify-between gap-3 rounded-xl border border-white/10 bg-[#0b1020] p-4 sm:flex-row sm:items-center"
                                    >
                                        <div className="min-w-0">
                                            <h4 className="wrap-break-words font-semibold text-white">
                                                {item.title}
                                            </h4>

                                            <p className="mt-1 text-sm text-slate-400">
                                                {item.contentType === "text" ? "📖 Text Passage" : "🖼️ Image"}{" "}
                                                · {item.passageDifficulty}
                                            </p>
                                        </div>

                                        <span
                                            className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${item.status === "published"
                                                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                                                : "border-orange-400/30 bg-orange-400/10 text-orange-300"
                                                }`}
                                        >
                                            {item.status === "published" ? "Published" : "Draft"}
                                        </span>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>

                </section>
            </div>
        </main>
    );
}
