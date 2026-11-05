
export default function WelcomeSection() {
  return (
    <section className="mt-8">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-lime-400">
        Ready, Player One?
      </p>

      <h2 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">
        Test your memory.
        <br />
        <span className="text-cyan-400">Beat your best.</span>
      </h2>

      <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
        Read carefully, remember the details, and answer before your
        lives run out. Think you have what it takes?
      </p>
    </section>
  );
}
