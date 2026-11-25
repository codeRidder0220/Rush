"use client";

import { buildForecast } from "@/lib/performanceForecast";

const palettes = {
  Easy: "#b6ff00",
  Medium: "#22d3ee",
  Hard: "#ff6fb5",
  Boss: "#8b5cf6",
};

function Tile({ label, value, detail, color }) {
  return (
    <div className="rounded-2xl border-[3px] border-black p-3 shadow-[3px_3px_0_#111]" style={{ background: color }}>
      <p className="font-special text-xs font-black uppercase">{label}</p>
      <p className="mt-1 font-fredoka text-3xl font-black">{value}</p>
      {detail && <p className="text-xs font-fredoka font-bold">{detail}</p>}
    </div>
  );
}

export default function PerformanceForecast({
  results = [],
  sessions = [],
  currentRating = 500,
  ratingHistory = [],
}) {
  const forecast = buildForecast({ results, sessions, currentRating, ratingHistory });
  const maxScore = Math.max(1, ...forecast.history);
  const trend = forecast.scoreTrend;

  return (
    <section className="mt-6 rounded-3xl border-4 border-black bg-white p-4 shadow-[6px_6px_0_#111] sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-special text-xs font-black uppercase tracking-widest">Personal data analysis</p>
          <h2 className="mt-1 font-rye text-2xl font-black sm:text-3xl">RUSH PERFORMANCE LAB</h2>
          <p className="font-fredoka text-sm font-bold">{forecast.games} games analysed</p>
        </div>
        <span className="rounded-full border-2 border-black bg-[#ffd23f] px-3 py-1 font-fredoka text-sm font-black">
          Confidence: {forecast.confidence}
        </span>
      </header>

      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile label="Next game score" value={forecast.games ? forecast.score : "—"} detail={forecast.games ? `Likely ${forecast.rangeLow}–${forecast.rangeHigh}` : "Play to start"} color="#ffd23f" />
        <Tile label="Expected accuracy" value={forecast.games ? `${forecast.accuracy}%` : "—"} detail="Recency-weighted estimate" color="#22d3ee" />
        <Tile label="Expected correct" value={forecast.games ? `${forecast.correct} / ${forecast.questions}` : "—"} detail="Based on typical answered count" color="#b6ff00" />
        <Tile label="Rating delta" value={forecast.games ? `${forecast.delta > 0 ? "+" : ""}${forecast.delta}` : "—"} detail={forecast.games ? `Projected rating ${forecast.rating}` : "No data"} color="#ff6fb5" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border-[3px] border-black bg-[#fff7e6] p-4">
          <h3 className="font-rye text-lg font-black">Rating outlook</h3>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl border-2 border-black bg-white p-2"><p className="text-xs font-special font-bold">NEXT</p><p className="font-fredoka text-xl font-black">{forecast.rating}</p></div>
            <div className="rounded-xl border-2 border-black bg-[#22d3ee] p-2"><p className="text-xs font-special font-bold">5 GAMES</p><p className="font-fredoka text-xl font-black">{forecast.rating5}</p></div>
            <div className="rounded-xl border-2 border-black bg-[#b6ff00] p-2"><p className="text-xs font-special font-bold">10 GAMES</p><p className="font-fredoka text-xl font-black">{forecast.rating10}</p></div>
          </div>
          <p className="mt-3 font-fredoka text-sm">Current rating: <b>{currentRating}</b> · Recent avg change: <b>{forecast.last5}</b></p>
          <p className="text-xs text-gray-600">Projections are damped to avoid assuming endless growth.</p>
        </div>

        <div className="rounded-2xl border-[3px] border-black p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-rye text-lg font-black">Recent scores</h3>
            <span className="rounded-full border-2 border-black bg-[#ffd23f] px-2 py-1 text-xs font-fredoka font-black">
              {trend.label}
            </span>
          </div>

          {forecast.history.length === 0 ? (
            <p className="mt-3 font-special text-sm">Your completed game scores will appear here.</p>
          ) : (
            <>
              <div className="mt-4 flex h-32 items-end gap-2 border-b-2 border-black pb-1">
                {forecast.history.map((value, index) => (
                  <div key={index} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
                    <span className="text-[10px] font-fredoka font-bold">{value}</span>
                    <div
                      title={`Game ${index + 1}: ${value} points`}
                      className="w-full max-w-9 rounded-t-md border-2 border-black bg-[#8b5cf6]"
                      style={{ height: `${Math.max(6, (value / maxScore) * 78)}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[10px] font-special font-bold">
                <span>Older games</span><span>Latest game →</span>
              </div>
              {trend.difference === null ? (
                <p className="mt-3 text-sm font-fredoka font-bold">
                  Play {Math.max(0, 10 - forecast.games)} more {10 - forecast.games === 1 ? "game" : "games"} to compare the latest five against the previous five.
                </p>
              ) : (
                <div className="mt-3 rounded-xl border-2 border-black bg-[#fff7e6] p-3">
                  <p className="font-fredoka font-black">
                    {trend.label === "Improving" ? "↗" : trend.label === "Declining" ? "↘" : "→"} {trend.difference > 0 ? "+" : ""}{trend.difference} points
                  </p>
                  <p className="text-xs font-special">
                    Latest 5-game average: <b>{trend.recentAverage}</b> · Previous 5-game average: <b>{trend.previousAverage}</b>
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border-[3px] border-black bg-[#fff7e6] p-4">
        <h3 className="font-rye text-lg font-black">Difficulty skill</h3>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Object.entries(forecast.difficulty).map(([name, stats]) => (
            <div key={name} className="rounded-xl border-2 border-black p-3" style={{ background: palettes[name] }}>
              <p className="font-fredoka font-black">{name}</p>
              <p className="text-2xl font-fredoka font-black">{stats.accuracy === null ? "—" : `${stats.accuracy}%`}</p>
              <p className="text-xs font-bold">{stats.correct + stats.wrong} answered · {stats.skipped} skipped</p>
            </div>
          ))}
        </div>
        <p className="mt-3 font-special text-sm font-bold">
          {forecast.strongest
            ? `Strongest: ${forecast.strongest} · Practice focus: ${forecast.weakest}`
            : "Need at least 3 answered questions per difficulty to label skill."}
        </p>
      </div>

      <div className="mt-4">
        <h3 className="font-rye text-lg font-black">Insights</h3>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {forecast.insights.map((insight, index) => (
            <article key={index} className="rounded-xl border-2 border-black bg-[#22d3ee]/20 p-3">
              <p className="font-fredoka font-black">{insight.title}</p>
              <p className="font-special text-sm">{insight.body}</p>
            </article>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-600">
        Method: recency-weighted averages and historical variability. This is statistical forecasting, not a trained ML model. Predictions improve with more games.
      </p>
    </section>
  );
}
