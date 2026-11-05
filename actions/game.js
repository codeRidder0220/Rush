
"use server";

import connectDB from "../lib/mongodb.js";
import { getCurrentUser } from "../lib/auth.js";
import Content from "../app/models/Content.js";
import GameSession from "../app/models/GameSession.js";
import GameResult from "../app/models/GameResult.js";
import User from "../app/models/User.js";
import { calculateRatingChange, applyRatingChange, } from "@/lib/rating";


const readingTimes = {
    Easy: 10,
    Medium: 20,
    Hard: 30,
    "Very Hard": 25,
};

export async function startGame() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return {
                success: false,
                message: "Please login to start a game.",
            };
        }

        const userId = user._id ?? user.id ?? user.userId;

        if (!userId) {
            console.error("Authenticated user has no ID:", user);

            return {
                success: false,
                message: "User ID missing. Please log out and log in again.",
            };
        }

        await connectDB();

        const contents = await Content.find({
            status: "published",
        })
            .select("_id")
            .lean();

        if (contents.length === 0) {
            return {
                success: false,
                message: "No published content is available yet.",
            };
        }

        const randomIndex = Math.floor(Math.random() * contents.length);

        const selectedContent = await Content.findById(
            contents[randomIndex]._id
        ).lean();

        if (!selectedContent || selectedContent.questions.length < 6) {
            return {
                success: false,
                message: "This content is not ready for a game.",
            };
        }

        const duration =
            readingTimes[selectedContent.passageDifficulty] ?? 10;

        const startedAt = new Date();
        const readingEndsAt = new Date(
            startedAt.getTime() + duration * 1000
        );

        const session = await GameSession.create({
            user: userId,
            content: selectedContent._id,
            score: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            livesRemaining: 3,
            attemptedQuestionIds: [],
            startedAt,
            readingEndsAt,
            questionStartedAt: null,
            questionTime: 0,
            status: "reading",
        });

        return {
            success: true,
            game: {
                sessionId: session._id.toString(),
                contentId: selectedContent._id.toString(),
                title: selectedContent.title,
                contentType: selectedContent.contentType,
                passage: selectedContent.passage,
                imageUrl: selectedContent.imageUrl,
                passageDifficulty: selectedContent.passageDifficulty,
                readingDuration: duration,
                readingEndsAt: readingEndsAt.getTime(),
            },
        };
    } catch (error) {
        console.error("Start game error:", error);

        return {
            success: false,
            message: "Could not start the game. Please try again.",
        };
    }
}

export async function getReadingGame(sessionId) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return {
                success: false,
                message: "Please login to continue.",
            };
        }

        const userId = user._id ?? user.id ?? user.userId;

        if (
            typeof sessionId !== "string" ||
            !/^[a-f\d]{24}$/i.test(sessionId)
        ) {
            return {
                success: false,
                message: "Invalid game session.",
            };
        }

        await connectDB();

        const session = await GameSession.findOne({
            _id: sessionId,
            user: userId,
            status: "reading",
        }).lean();

        if (!session) {
            return {
                success: false,
                message: "Reading session not found.",
            };
        }

        const content = await Content.findOne({
            _id: session.content,
            status: "published",
        }).lean();

        if (!content) {
            return {
                success: false,
                message: "Game content not found.",
            };
        }

        return {
            success: true,
            game: {
                sessionId: session._id.toString(),
                contentId: content._id.toString(),
                title: content.title,
                contentType: content.contentType,
                passage: content.passage,
                imageUrl: content.imageUrl,
                passageDifficulty: content.passageDifficulty,
                readingDuration:
                    readingTimes[content.passageDifficulty] ?? 10,
                readingEndsAt: session.readingEndsAt.getTime(),
            },
        };
    } catch (error) {
        console.error("Get reading game error:", error);

        return {
            success: false,
            message: "Could not resume the reading session.",
        };
    }
}


export async function getGameQuestions(sessionId) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return {
                success: false,
                message: "Please login to continue.",
            };
        }
        const userId = user?._id ?? user?.id ?? user?.userId;

        if (!userId) {
            return {
                success: false,
                message: "User ID missing. Please log out and log in again.",
            };
        }

        if (
            typeof sessionId !== "string" ||
            !/^[a-f\d]{24}$/i.test(sessionId)
        ) {
            return {
                success: false,
                message: "Invalid game session.",
            };
        }

        await connectDB();

        const session = await GameSession.findOne({
            _id: sessionId,
            user: userId,
        });

        if (!session) {
            return {
                success: false,
                message: "Game session not found.",
            };
        }

        if (session.status === "reading") {
            if (Date.now() < session.readingEndsAt.getTime()) {
                return {
                    success: false,
                    message: "Reading time is not complete yet.",
                };
            }

            session.status = "questions";
            session.questionStartedAt = new Date();
            await session.save();
        }

        if (session.status !== "questions") {
            return {
                success: false,
                message: "This game is no longer active.",
            };
        }

        const content = await Content.findOne({
            _id: session.content,
            status: "published",
        })
            .select("questions")
            .lean();

        if (!content || content.questions.length < 6) {
            return {
                success: false,
                message: "Questions are not available.",
            };
        }

        const questions = content.questions.map((question) => ({
            _id: question._id.toString(),
            questionText: question.questionText,
            type: question.type,
            options: question.options,
            difficulty: question.difficulty,
        }));

        return {
            success: true,
            questions,
            game: {
                sessionId: session._id.toString(),
                score: session.score,
                lives: session.livesRemaining,
                attemptedQuestionIds: session.attemptedQuestionIds,
            },
        };
    } catch (error) {
        console.error("Get game questions error:", error);

        return {
            success: false,
            message: "Questions load nahi ho paaye.",
        };
    }
}


export async function submitGameQuestion({
    sessionId,
    questionId,
    answer,
    skip = false,
}) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return {
                success: false,
                message: "Please login again.",
            };
        }

        const userId = user._id ?? user.id ?? user.userId;

        if (!userId) {
            return {
                success: false,
                message: "User ID missing. Please login again.",
            };
        }

        if (
            typeof sessionId !== "string" ||
            !/^[a-f\d]{24}$/i.test(sessionId) ||
            typeof questionId !== "string" ||
            !/^[a-f\d]{24}$/i.test(questionId)
        ) {
            return {
                success: false,
                message: "Invalid game or question ID.",
            };
        }

        if (
            typeof skip !== "boolean" ||
            (!skip &&
                (typeof answer !== "string" || !answer.trim()))
        ) {
            return {
                success: false,
                message: "first select your answer or type.",
            };
        }

        await connectDB();

        const session = await GameSession.findOne({
            _id: sessionId,
            user: userId,
            status: "questions",
        });

        if (!session) {
            return {
                success: false,
                message: "Active game not found. Please start from Dashboard.",
            };
        }

        if (session.livesRemaining <= 0) {
            return {
                success: false,
                message: "Game over. Now, answer would not submitted.",
            };
        }

        if (session.attemptedQuestionIds.includes(questionId)) {
            return {
                success: false,
                message: "This question was attempted earlier.",
            };
        }

        const content = await Content.findById(session.content).lean();

        if (!content || content.status !== "published") {
            return {
                success: false,
                message: "Game content not found.",
            };
        }

        const question = content.questions.find(
            (item) => item._id.toString() === questionId
        );

        if (!question) {
            return {
                success: false,
                message: "Question doesn't found.",
            };
        }

        if (
            !skip &&
            question.type === "mcq" &&
            !question.options.includes(answer)
        ) {
            return {
                success: false,
                message: "Please select valid option.",
            };
        }

        const points = {
            Easy: { correct: 10, wrong: -5 },
            Medium: { correct: 20, wrong: -8 },
            Hard: { correct: 30, wrong: -11 },
            Boss: { correct: 50, wrong: -15 },
        };

        let correct = false;
        let delta = 0;

        if (!skip) {
            const normalize = (value) =>
                String(value ?? "").trim().toLowerCase();

            const acceptedAnswers = [
                question.correctAnswer,
                ...(question.acceptedAnswers ?? []),
            ].filter(
                (value) =>
                    value != null && String(value).trim() !== ""
            );

            correct = acceptedAnswers.some(
                (value) => normalize(value) === normalize(answer)
            );

            const scoreRule =
                points[question.difficulty] ?? points.Easy;

            delta = correct ? scoreRule.correct : scoreRule.wrong;
        }

        // Count the time spent on this question, up to submission.
        // Feedback delay is excluded because the clock will be
        // restarted separately when the next question appears.
        const now = new Date();

        if (session.questionStartedAt) {
            const elapsedSeconds = Math.max(
                0,
                Math.round(
                    (now.getTime() -
                        new Date(session.questionStartedAt).getTime()) /
                    1000
                )
            );

            session.questionTime += elapsedSeconds;
        }

        session.attemptedQuestionIds.push(questionId);

        if (!Array.isArray(session.attempts)) {
            session.attempts = [];
        }

        session.attempts.push({
            questionId: String(questionId),
            difficulty: question.difficulty,
            correct: !skip && correct,
            skipped: skip,
        });


        if (!skip) {
            session.score += delta;

            if (correct) {
                session.correctAnswers += 1;
            } else {
                session.wrongAnswers += 1;
                session.livesRemaining = Math.max(
                    0,
                    session.livesRemaining - 1
                );
            }
        }

        const gameOver = session.livesRemaining <= 0;

        const allQuestionsAttempted =
            session.attemptedQuestionIds.length >=
            content.questions.length;

        const finished = gameOver || allQuestionsAttempted;

        if (finished) {
            session.status = "finished";
            session.finishedAt = now;
            session.questionStartedAt = null;

            await session.save();

            const readingTime = Math.max(
                0,
                Math.round(
                    (new Date(session.readingEndsAt).getTime() -
                        new Date(session.startedAt).getTime()) / 1000
                )
            );

            const completionTime = Math.max(
                0,
                Math.round(
                    (now.getTime() -
                        new Date(session.startedAt).getTime()) / 1000
                )
            );

            await GameResult.create({
                user: session.user,
                content: session.content,
                score: session.score,
                correctAnswers: session.correctAnswers,
                wrongAnswers: session.wrongAnswers,
                livesRemaining: session.livesRemaining,
                completionTime,
                questionTime: session.questionTime,
                readingTime,
                startedAt: session.startedAt,
                finishedAt: now,
                completed: allQuestionsAttempted && !gameOver,
            });
        } else {
            // Pause the clock during feedback. The next question's
            // clock will start when the client displays that question.
            session.questionStartedAt = null;
            await session.save();
        }





        if (finished) {
            const player = await User.findById(session.user);

            if (player) {
                const previousBest = player.bestScore ?? 0;

                session.newPersonalBest = session.score > previousBest;
                await session.save();

                if (session.newPersonalBest) {
                    player.bestScore = session.score;
                    await player.save();
                }

                await session.save();

                console.log(
                    "SAVED PERSONAL BEST FLAG:",
                    session.newPersonalBest
                );



                if (!session.ratingApplied) {
                    const ratingChange = calculateRatingChange({
                        attempts: session.attempts,
                        questionTime: session.questionTime ?? 0,
                    });

                    player.rating = applyRatingChange(
                        player.rating,
                        ratingChange
                    );

                    // Purane users ke liye history array initialize karo
                    if (!Array.isArray(player.ratingHistory)) {
                        player.ratingHistory = [];
                    }

                    // Nayi rating ko graph ke liye save karo
                    player.ratingHistory.push({
                        rating: player.rating,
                        playedAt: new Date(),
                    });

                    session.ratingApplied = true;

                    await player.save();

                    await session.save();

                    console.log("RATING CHANGE:", ratingChange);
                    console.log("NEW RATING:", player.rating);
                }


            }




            // Streak sirf successful completed game par update hogi.
            if (allQuestionsAttempted && !gameOver) {
                const player = await User.findById(session.user);

                if (player) {
                    // India date ko YYYY-MM-DD format mein convert karo
                    function getIndiaDate(date = new Date()) {
                        const parts = new Intl.DateTimeFormat("en-US", {
                            timeZone: "Asia/Kolkata",
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                        }).formatToParts(date);

                        const year = parts.find((part) => part.type === "year").value;
                        const month = parts.find((part) => part.type === "month").value;
                        const day = parts.find((part) => part.type === "day").value;

                        return `${year}-${month}-${day}`;
                    }

                    // Date ko normalize karo:
                    // String date already YYYY-MM-DD ho to usko as-is use karo.
                    // MongoDB Date object ho to India date mein convert karo.
                    function normalizeStreakDate(value) {
                        if (!value) return null;

                        if (
                            typeof value === "string" &&
                            /^\d{4}-\d{2}-\d{2}$/.test(value)
                        ) {
                            return value;
                        }

                        return getIndiaDate(new Date(value));
                    }

                    const now = new Date();
                    const today = getIndiaDate(now);

                    // Yesterday ko date-only arithmetic se calculate karo
                    const [year, month, day] = today.split("-").map(Number);

                    const yesterdayDate = new Date(
                        Date.UTC(year, month - 1, day - 1)
                    );

                    const yesterday = [
                        yesterdayDate.getUTCFullYear(),
                        String(yesterdayDate.getUTCMonth() + 1).padStart(2, "0"),
                        String(yesterdayDate.getUTCDate()).padStart(2, "0"),
                    ].join("-");

                    const lastStreakDate = normalizeStreakDate(
                        player.lastStreakDate
                    );

                    const previousStreak = Number(player.dailyStreak) || 0;

                    let nextStreak;

                    if (lastStreakDate === today) {
                        // Aaj already game complete kiya hai:
                        // streak ko dobara increment mat karo
                        nextStreak = previousStreak;
                    } else if (lastStreakDate === yesterday) {
                        // Kal game complete kiya tha:
                        // consecutive streak increment karo
                        nextStreak = previousStreak + 1;
                    } else {
                        // Ek ya zyada din miss hue:
                        // streak ko 1 se restart karo
                        nextStreak = 1;
                    }

                    player.dailyStreak = nextStreak;
                    player.lastStreakDate = today;

                    player.maxStreak = Math.max(
                        Number(player.maxStreak) || 0,
                        nextStreak
                    );

                    await player.save();

                    console.log("STREAK CHECK:", {
                        today,
                        yesterday,
                        previousLastStreakDate: lastStreakDate,
                        dailyStreak: player.dailyStreak,
                        maxStreak: player.maxStreak,
                    });
                }
            }
        }



        return {
            success: true,
            correct: skip ? null : correct,
            skipped: skip,
            pointsChanged: delta,
            score: session.score,
            lives: session.livesRemaining,
            attemptedQuestionIds: session.attemptedQuestionIds,
            questionTime: session.questionTime,
            gameOver,
            finished,
        };
    } catch (error) {
        console.error("Submit game question error:", error);

        return {
            success: false,
            message: "Answer couldn't be submitted. Try again.",
        };
    }
}


export async function startNextQuestionClock(sessionId) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return { success: false, message: "Please login again." };
        }

        const userId = user._id ?? user.id ?? user.userId;

        if (
            typeof sessionId !== "string" ||
            !/^[a-f\d]{24}$/i.test(sessionId)
        ) {
            return { success: false, message: "Invalid game ID." };
        }

        await connectDB();

        const session = await GameSession.findOne({
            _id: sessionId,
            user: userId,
            status: "questions",
        });

        if (!session) {
            return { success: false, message: "Active game not found." };
        }

        if (!session.questionStartedAt) {
            session.questionStartedAt = new Date();
            await session.save();
        }

        return { success: true };
    } catch (error) {
        console.error("Start question clock error:", error);

        return {
            success: false,
            message: "Question timer couldn't start.",
        };
    }
}


export async function getGameResult(sessionId) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return {
                success: false,
                message: "Please login again.",
            };
        }

        const userId = user._id ?? user.id ?? user.userId;

        if (
            !userId ||
            typeof sessionId !== "string" ||
            !/^[a-f\d]{24}$/i.test(sessionId)
        ) {
            return {
                success: false,
                message: "Invalid game session.",
            };
        }

        await connectDB();

        const session = await GameSession.findOne({
            _id: sessionId,
            user: userId,
            status: "finished",
        })
            .populate("content", "title")
            .lean();



        if (!session) {
            return {
                success: false,
                message: "Finished game result not found.",
            };
        }

        console.log("PERSONAL BEST DEBUG:", session.newPersonalBest);

        return {
            success: true,
            result: {
                title: session.content?.title ?? "RUSH Game",
                score: session.score,
                newPersonalBest: session.newPersonalBest ?? false,
                correctAnswers: session.correctAnswers,
                wrongAnswers: session.wrongAnswers,
                livesRemaining: session.livesRemaining,
                questionTime: session.questionTime ?? 0,
                completed:
                    session.attemptedQuestionIds.length >=
                    (await Content.findById(session.content?._id)
                        .select("questions")
                        .lean())?.questions?.length &&
                    session.livesRemaining > 0,
            },
        };
    } catch (error) {
        console.error("Get game result error:", error);

        return {
            success: false,
            message: "Result couldn't be loaded. try again.",
        };
    }
}
