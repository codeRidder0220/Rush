
"use client";

export default function ContentDetails({
  title,
  setTitle,
  contentType,
  setContentType,
  passageDifficulty,
  setPassageDifficulty,
  passage,
  setPassage,
  imageUrl,
  setImageUrl,
}) {
  const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none focus:border-cyan-400";

  const labelClass = "mb-2 block text-sm font-medium text-slate-200";

  return (
    <section className="space-y-5 rounded-2xl border border-white/10 bg-[#11172b] p-5 sm:p-7">
      <h2 className="text-xl font-bold">Content Details</h2>

      <div>
        <label htmlFor="content-title" className={labelClass}>
          Content Title
        </label>

        <input
          id="content-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={150}
          required
          placeholder="e.g. The Mystery of Black Holes"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="content-type" className={labelClass}>
          Content Type
        </label>

        <select
          id="content-type"
          value={contentType}
          onChange={(event) => setContentType(event.target.value)}
          className={inputClass}
        >
          <option value="text">Text Passage</option>
          <option value="image">Image URL</option>
        </select>
      </div>

      <div>
        <label htmlFor="passage-difficulty" className={labelClass}>
          Reading Difficulty
        </label>

        <select
          id="passage-difficulty"
          value={passageDifficulty}
          onChange={(event) => setPassageDifficulty(event.target.value)}
          className={inputClass}
        >
          <option value="Easy">Easy — 10 seconds</option>
          <option value="Medium">Medium — 20 seconds</option>
          <option value="Hard">Hard — 30 seconds</option>
          <option value="Very Hard">Very Hard — 25 seconds</option>
        </select>
      </div>

      {contentType === "text" ? (
        <div>
          <label htmlFor="passage-text" className={labelClass}>
            Passage Text
          </label>

          <textarea
            id="passage-text"
            value={passage}
            onChange={(event) => setPassage(event.target.value)}
            required
            rows={7}
            placeholder="Write the passage players will read and remember..."
            className={`${inputClass} resize-y`}
          />
        </div>
      ) : (
        <div>
          <label htmlFor="image-url" className={labelClass}>
            Image URL
          </label>

          <input
            id="image-url"
            type="url"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            required
            placeholder="https://example.com/image.jpg"
            className={inputClass}
          />
        </div>
      )}
    </section>
  );
}
