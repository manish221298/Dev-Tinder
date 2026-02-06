const { QuestionBank } = require("../models/questions");
const { QuizResult } = require("../models/quizResults");
const User = require("../models/user");

const resultController = {};


resultController.getSetDetails = async (req, res) => {
    try {
        // Get all unique quizSetIds that have submissions
        const submissions = await QuizResult.distinct('quizSetId');

        if (submissions.length === 0) {
            return res.status(200).json({
                message: "No quiz sets with submissions found",
                quizSets: []
            });
        }

        // Fetch all question sets that have submissions
        const questionSets = await QuestionBank.find({
            _id: { $in: submissions }
        });

        // Get submission counts for each quiz set
        const quizSetsWithCounts = await Promise.all(
            questionSets.map(async (questionSet) => {
                const submissionCount = await QuizResult.countDocuments({
                    quizSetId: questionSet._id
                });

                return {
                    _id: questionSet._id,
                    setName: questionSet.setName,
                    questionSet: questionSet.questionSet,
                    totalQuestions: questionSet.questions.length,
                    submissionCount: submissionCount
                };
            })
        );

        return res.status(200).json({
            message: "Quiz sets with submissions retrieved successfully",
            totalSets: quizSetsWithCounts.length,
            quizSets: quizSetsWithCounts
        });
    } catch (err) {
        return res.status(500).json({
            error: "Something went wrong while fetching the quiz set details.",
            err: err.message
        });
    }
};


resultController.getUserWiseResults = async (req, res) => {
    const { quizSetId } = req.params;
    try {
        if (!quizSetId) {
            return res.status(400).json({ error: "Quiz set ID is required." });
        }

        // Verify quiz set exists
        const questionSet = await QuestionBank.findById(quizSetId);
        if (!questionSet) {
            return res.status(404).json({ error: "Question set not found." });
        }

        // Fetch all results for this quiz set with user details
        const results = await QuizResult.find({ quizSetId: quizSetId })
            .populate('userId', 'firstName lastName email photo')
            .sort({ createdAt: -1 });

        // Format the results
        const userWiseResults = results.map((result) => {
            return {
                resultId: result._id,
                userId: result.userId ? result.userId._id : null,
                user: result.userId ? {
                    firstName: result.userId.firstName,
                    lastName: result.userId.lastName,
                    email: result.userId.email,
                    photo: result.userId.photo
                } : null,
                totalQuestions: result.totalQuestions,
                correctAnswers: result.correctAnswers,
                incorrectAnswers: result.incorrectAnswers,
                score: result.score,
                results: result.results,
                submittedAt: result.createdAt
            };
        });

        return res.status(200).json({
            message: "User-wise results retrieved successfully",
            quizSetId: quizSetId,
            quizSetName: questionSet.setName,
            totalSubmissions: userWiseResults.length,
            userResults: userWiseResults
        });
    } catch (err) {
        return res.status(500).json({
            error: "Something went wrong while fetching user-wise results.",
            err: err.message
        });
    }
};

/**
 * Delete an individual user result
 * @route DELETE /result/:resultId
 */
resultController.deleteResult = async (req, res) => {
    const { resultId } = req.params;
    try {
        if (!resultId) {
            return res.status(400).json({ error: "Result ID is required." });
        }

        // Find the result to verify it exists
        const result = await QuizResult.findById(resultId);
        if (!result) {
            return res.status(404).json({ error: "Result not found." });
        }

        // Delete the result
        await QuizResult.findByIdAndDelete(resultId);

        return res.status(200).json({
            message: "Result deleted successfully",
            resultId: resultId
        });
    } catch (err) {
        return res.status(500).json({
            error: "Something went wrong while deleting the result.",
            err: err.message
        });
    }
};

module.exports = resultController;

