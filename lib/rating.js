
const DIFFICULTY_WEIGHTS = {
  Easy: 1,
  Medium: 1.5,
  Hard: 2,
  Boss: 3,
};

const RATING_CHANGE = {
  excellent: 25,
  great: 15,
  good: 8,
  average: 0,
  poor: -10,
  veryPoor: -20,
};

const MIN_RATING_CHANGE = -20;
const MAX_RATING_CHANGE = 25;

/**
 * Poore game ki performance se ek final rating change calculate karta hai.
 * Is function ko game finish hone par sirf ek baar call karna hai.
 */
export function calculateRatingChange({
  attempts = [],
  questionTime = 0,
}) {
  const answeredAttempts = attempts.filter(
    (attempt) => !attempt.skipped
  );

  if (answeredAttempts.length === 0) {
    return 0;
  }

  let earnedWeight = 0;
  let possibleWeight = 0;

  for (const attempt of answeredAttempts) {
    const difficulty =
      DIFFICULTY_WEIGHTS[attempt.difficulty] ?? 1;

    possibleWeight += difficulty;

    if (attempt.correct) {
      earnedWeight += difficulty;
    }
  }

  if (possibleWeight === 0) {
    return 0;
  }

  const accuracy = (earnedWeight / possibleWeight) * 100;

  // Speed sirf secondary factor hai; accuracy se zyada important nahi.
  // Abhi isse rating change ko chhota sa adjustment milega.
  const averageTime =
    questionTime / answeredAttempts.length;

  let ratingChange;

  if (accuracy >= 90) {
    ratingChange = RATING_CHANGE.excellent;
  } else if (accuracy >= 75) {
    ratingChange = RATING_CHANGE.great;
  } else if (accuracy >= 60) {
    ratingChange = RATING_CHANGE.good;
  } else if (accuracy >= 40) {
    ratingChange = RATING_CHANGE.average;
  } else if (accuracy >= 20) {
    ratingChange = RATING_CHANGE.poor;
  } else {
    ratingChange = RATING_CHANGE.veryPoor;
  }

  // Chhota speed bonus sirf achhi accuracy ke saath.
  if (accuracy >= 75 && averageTime > 0 && averageTime <= 8) {
    ratingChange += 2;
  }

  return Math.max(
    MIN_RATING_CHANGE,
    Math.min(MAX_RATING_CHANGE, ratingChange)
  );
}

/**
 * Rating ko valid range mein rakhta hai.
 * Starting rating User model mein 500 hi rahegi.
 */
export function applyRatingChange(currentRating, ratingChange) {
  const rating = Number.isFinite(currentRating)
    ? currentRating
    : 500;

  const change = Number.isFinite(ratingChange)
    ? ratingChange
    : 0;

  return Math.max(0, rating + change);
}
