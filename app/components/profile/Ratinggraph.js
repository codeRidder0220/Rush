
"use client";

export default function RatingGraph({ history = [] }) {
  const points = history
    .filter((item) => Number.isFinite(Number(item.rating)))
    .map((item) => ({
      rating: Number(item.rating),
      date: item.playedAt,
    }));

  if (points.length === 0) {
    return (
      <section className="rounded-2xl border-[3px] border-black bg-white p-6 shadow-[5px_5px_0_#111]">
        <h2 className="text-xl font-rye font-black">Rating Progress</h2>
        <div className="mt-5 rounded-xl border-2 border-dashed border-gray-300 py-12 text-center">
          <p className="text-3xl">📈</p>
          <p className="mt-2 font-bold font-fredoka">Your journey starts here!</p>
          <p className="mt-1 text-sm text-gray-500 font-special">
            Play a game to start tracking your rating.
          </p>
        </div>
      </section>
    );
  }

  const width = 700;
  const height = 260;
  const left = 58;
  const right = 20;
  const top = 24;
  const bottom = 45;

  const values = points.map((point) => point.rating);
  const minRating = Math.min(...values);
  const maxRating = Math.max(...values);
  const range = Math.max(maxRating - minRating, 100);
  const low = Math.floor((minRating - range * 0.15) / 50) * 50;
  const high = Math.ceil((maxRating + range * 0.15) / 50) * 50;

  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;

  const getX = (index) =>
    points.length === 1
      ? left + chartWidth / 2
      : left + (index / (points.length - 1)) * chartWidth;

  const getY = (rating) =>
    top + ((high - rating) / (high - low)) * chartHeight;

  const plotted = points.map((point, index) => ({
    x: getX(index),
    y: getY(point.rating),
    ...point,
  }));

  const line = plotted
    .map((point, index) =>
      `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  const area =
    `${line} L ${plotted[plotted.length - 1].x} ${top + chartHeight} ` +
    `L ${plotted[0].x} ${top + chartHeight} Z`;

  const gridValues = Array.from(
    { length: 5 },
    (_, index) => high - ((high - low) / 4) * index
  );

  return (
    <section className="rounded-2xl border-[3px] border-black bg-white p-4 shadow-[5px_5px_0_#111] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-rye font-black sm:text-2xl">
            Rating Progress
          </h2>
          <p className="mt-1 font-special text-md text-gray-800">
            Your rating after each game
          </p>
        </div>

        <div className="rounded-xl border-2 border-black bg-[#ffd23f] px-4 py-2">
          <p className="text-sm font-fredoka font-bold">CURRENT RATING</p>
          <p className="text-2xl font-fredoka font-black">
            {points[points.length - 1].rating}
          </p>
        </div>
      </div>

      <div className="mt-5 w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="Rating history graph"
          className="w-full min-w-120 font-fredoka"
        >
          <defs>
            <linearGradient id="rating-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.08" />
            </linearGradient>
          </defs>

          {gridValues.map((value, index) => {
            const y = getY(value);

            return (
              <g key={index}>
                <line
                  x1={left}
                  y1={y}
                  x2={width - right}
                  y2={y}
                  stroke="#bdbdbd"
                  strokeDasharray="5 5"
                />
                <text
                  x={left - 9}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="12"
                  fill="#555"
                >
                  {Math.round(value)}
                </text>
              </g>
            );
          })}

          <path d={area} fill="url(#rating-fill)" />
          <path
            d={line}
            fill="none"
            stroke="#111111"
            strokeWidth="3.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {plotted.map((point, index) => (
            <g key={`${index}-${point.rating}`}>
              <circle
                cx={point.x}
                cy={point.y}
                r="6"
                fill={index === plotted.length - 1 ? "#ff7a00" : "white"}
                stroke="#111111"
                strokeWidth="2.5"
              />
              <text
                x={point.x}
                y={height - 15}
                textAnchor="middle"
                fontSize="11"
                fill="#444"
              >
                {index === plotted.length - 1
                  ? "Latest"
                  : `Game ${index + 1}`}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}
