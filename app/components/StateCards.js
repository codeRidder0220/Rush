
export default function StatsCards({
  bestScore = 0,
  dailyStreak = 0,
  maxStreak = 0,
  
}) {
  return (
    <section className="grid h-full min-h-0 grid-rows-2 gap-3">
      {/* Best Score card */}
      <div className="flex min-h-0 items-center justify-between rounded-3xl border-4 border-[#111111] bg-[#ffd23f] px-5 py-4 text-[#111111] shadow-[5px_5px_0_#111111]">
        <h2 className="text-base font-fredoka font-black sm:text-3xl">
          Best Score
        </h2>

        <p className="text-3xl font-fredoka font-black sm:text-4xl">
          {bestScore}
        </p>
      </div>

      {/* Daily Streak card */}
      <div className="flex min-h-0 flex-col justify-center gap-2 overflow-hidden rounded-3xl border-4 border-[#111111] bg-[#ff7a00] px-5 py-2 text-[#111111] shadow-[5px_5px_0_#111111]">

        

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-fredoka font-black sm:text-2xl">
              Daily Streak
            </h2>

            <p className="text-xl font-fredoka font-black">
              {dailyStreak}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-special font-black sm:text-xs">
              MAX STREAK
            </p>
            <p className="text-xl font-special font-black">
              {maxStreak}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {Array.from({ length: 7 }, (_, index) => (
            <span
              key={index}
              className={`h-5 w-5 rounded-full border-2 border-[#111111] ${
                index < Math.min(dailyStreak, 7)
                  ? "bg-[#111111]"
                  : "bg-white"
              }`}
            />
          ))}
        </div>

        {/* Marquee */}
        <div className="overflow-hidden pt-3">
          <div className="flex w-max animate-marquee whitespace-nowrap">
            {[1, 2, 3, 4].map((item) => (
              <span
                key={item}
                className="mr-8 text-xs font-special font-bold text-black tracking-wider sm:text-xs"
              >
                 🔥PLAY DAILY TO MAINTAIN STREAK ...
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
