const quizSubmitController = {};
const { QuizSubmit, Result } = require("../models/quizSubmit");
const mongoose = require("mongoose");

quizSubmitController.submitQuiz = async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const testData = req.body;

    if (!Array.isArray(testData) || testData.length === 0) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const quizSubmission = new QuizSubmit({
      userId,
      testData: testData.map((item) => ({
        questionId: item.questionId,
        selectedAnswer: item.selectedAnswer,
      })),
    });

    await quizSubmission.save();

    return res.status(201).json({ message: "Quiz submitted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

quizSubmitController.getQuizSubmissions = async (req, res) => {
  try {
    const quizSbmissionList = await QuizSubmit.find()
      .populate("userId", "name email")
      .populate("testData.questionId", "questions options");

    return res.status(200).json(quizSbmissionList);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

quizSubmitController.getQuizResultOfIndividualUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const quizSubmission = await QuizSubmit.findOne({ userId })
      .populate("testData.questionId", "answer")
      .populate("userId", "firstName lastName email");

    if (!quizSubmission) {
      return res
        .status(404)
        .json({ message: "No quiz submission found for the user" });
    }

    const totalQuestions = quizSubmission.testData.length;
    let correctAnswers = quizSubmission.testData.filter(
      (answer) => answer.questionId.answer === answer.selectedAnswer
    ).length;

    let incorrectAnswers = totalQuestions - correctAnswers;
    let percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);
    let score = correctAnswers;

    quizSubmission.score = score;
    quizSubmission.totalQuestions = totalQuestions;
    quizSubmission.correctAnswers = correctAnswers;
    quizSubmission.incorrectAnswers = incorrectAnswers;
    quizSubmission.percentage = percentage;

    const testData = quizSubmission.testData.map((item) => ({
      questionId: item.questionId._id,
      selectedAnswer: item.selectedAnswer,
    }));

    quizSubmission.testData = testData;

    return res.status(200).json({
      message: "Quiz result calculated successfully",
      result: {
        userId: quizSubmission.userId,
        score: quizSubmission.score,
        totalQuestions: quizSubmission.totalQuestions,
        correctAnswers: quizSubmission.correctAnswers,
        incorrectAnswers: quizSubmission.incorrectAnswers,
        percentage: quizSubmission.percentage,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = quizSubmitController;
