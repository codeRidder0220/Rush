const average = (values) =>
  values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

const recentWeighted = (values) => {
  if (!values.length) return 0;
  let weightedTotal = 0;
  let weightTotal = 0;
  values.forEach((value, index) => {
    const weight = Math.pow(0.72, values.length - 1 - index);
    weightedTotal += value * weight;
    weightTotal += weight;
  });
  return weightedTotal / weightTotal;
};

const deviation = (values) =>
  values.length > 1
    ? Math.sqrt(average(values.map((value) => (value - average(values)) ** 2)))
    : 0;

const compareRecentGames = (values) => {
  if (values.length < 10) {
    return { label: "Not enough games", difference: null, recentAverage: null, previousAverage: null };
  }

  const previous = values.slice(-10, -5);
  const recent = values.slice(-5);
  const difference = average(recent) - average(previous);
  const threshold = Math.max(3, deviation(values) * 0.25);

  return {
    label: difference > threshold ? "Improving" : difference < -threshold ? "Declining" : "Stable",
    difference: Math.round(difference * 10) / 10,
    recentAverage: Math.round(average(recent) * 10) / 10,
    previousAverage: Math.round(average(previous) * 10) / 10,
  };
};

export function buildForecast({
  results = [],
  sessions = [],
  currentRating = 500,
  ratingHistory = [],
}) {
  // Incoming results are newest-first from MongoDB; calculations and chart run oldest-first.
  const games = [...results].reverse();
  const scores = games.map((game) => Number(game.score) || 0);
  const answeredCounts = games
    .map((game) => (Number(game.correct) || 0) + (Number(game.wrong) || 0))
    .filter((count) => count > 0);
  const accuracies = games
    .map((game) => {
      const correct = Number(game.correct) || 0;
      const wrong = Number(game.wrong) || 0;
      return correct + wrong ? (100 * correct) / (correct + wrong) : null;
    })
    .filter((value) => value !== null);

  const score = Math.round(recentWeighted(scores));
  const accuracy = Math.round(recentWeighted(accuracies));
  const typicalQuestions = Math.max(1, Math.round(recentWeighted(answeredCounts)));
  const recentScores = scores.slice(-5);
  const changes = ratingHistory
    .map((entry) => Number(entry.rating))
    .filter(Number.isFinite)
    .reduce((deltas, rating, index, all) => {
      if (index > 0) deltas.push(rating - all[index - 1]);
      return deltas;
    }, []);
  const delta = Math.max(-12, Math.min(12, Math.round(recentWeighted(changes.slice(-5)))));
  const scoreTrend = compareRecentGames(scores);
  const accuracyTrend = compareRecentGames(accuracies);

  const difficulty = {
    Easy: { attempts: 0, correct: 0, wrong: 0, skipped: 0 },
    Medium: { attempts: 0, correct: 0, wrong: 0, skipped: 0 },
    Hard: { attempts: 0, correct: 0, wrong: 0, skipped: 0 },
    Boss: { attempts: 0, correct: 0, wrong: 0, skipped: 0 },
  };

  sessions.forEach((session) =>
    (session.attempts || []).forEach((attempt) => {
      const stats = difficulty[attempt.difficulty];
      if (!stats) return;
      stats.attempts += 1;
      if (attempt.skipped) stats.skipped += 1;
      else if (attempt.correct) stats.correct += 1;
      else stats.wrong += 1;
    })
  );

  Object.values(difficulty).forEach((stats) => {
    stats.accuracy = stats.correct + stats.wrong
      ? Math.round((100 * stats.correct) / (stats.correct + stats.wrong))
      : null;
  });

  const qualified = Object.entries(difficulty).filter(
    ([, stats]) => stats.correct + stats.wrong >= 3
  );
  const strongest = qualified.slice().sort((a, b) => b[1].accuracy - a[1].accuracy)[0]?.[0] || null;
  const weakest = qualified.slice().sort((a, b) => a[1].accuracy - b[1].accuracy)[0]?.[0] || null;
  const confidence = games.length >= 20
    ? "Moderate"
    : games.length >= 8
      ? "Low–moderate"
      : games.length >= 3
        ? "Low"
        : "Very low";

  const insights = [];
  if (scoreTrend.difference !== null) {
    insights.push({
      title: "Score trend: " + scoreTrend.label,
      body: "Latest 5-game average: " + scoreTrend.recentAverage +
        " · Previous 5-game average: " + scoreTrend.previousAverage +
        " · Change: " + (scoreTrend.difference > 0 ? "+" : "") + scoreTrend.difference,
    });
  }
  if (accuracyTrend.difference !== null) {
    insights.push({
      title: "Accuracy trend: " + accuracyTrend.label,
      body: "Latest 5-game average: " + accuracyTrend.recentAverage +
        "% · Previous 5-game average: " + accuracyTrend.previousAverage + "%",
    });
  }
  if (strongest && weakest && strongest !== weakest) {
    insights.push({
      title: "Strength: " + strongest,
      body: strongest + " accuracy is " + difficulty[strongest].accuracy +
        "%; " + weakest + " is a practice opportunity (" + difficulty[weakest].accuracy + "%).",
    });
  }
  if (!insights.length) {
    insights.push({
      title: "Build your baseline",
      body: "Play at least 10 games to compare your latest five scores with the previous five.",
    });
  }

  const scoreSpread = deviation(recentScores);
  const predictedCorrect = Math.round((accuracy / 100) * typicalQuestions);

  return {
    games: games.length,
    score,
    accuracy,
    rangeLow: Math.max(0, Math.round(score - scoreSpread * 1.25)),
    rangeHigh: Math.round(score + scoreSpread * 1.25),
    correct: predictedCorrect,
    wrong: typicalQuestions - predictedCorrect,
    questions: typicalQuestions,
    delta,
    rating: Math.max(0, Number(currentRating) + delta),
    rating5: Math.max(0, Math.round(Number(currentRating) + delta * 5 * 0.65)),
    rating10: Math.max(0, Math.round(Number(currentRating) + delta * 10 * 0.65)),
    last5: Math.round(average(changes.slice(-5))),
    confidence,
    difficulty,
    strongest,
    weakest,
    insights,
    history: scores.slice(-10),
    scoreTrend,
  };
}
