const mongoose = require('mongoose')

const resultItemSchema = new mongoose.Schema({
    question: { type: String, required: true },
    questionId: { type: String, required: true },
    selectedAnswer: { type: String, default: null },
    correctAnswer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true }
}, { _id: false })

const quizResultSchema = new mongoose.Schema({
    quizSetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "QuestionBank",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    results: [resultItemSchema],
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    incorrectAnswers: { type: Number, required: true },
    score: { type: Number, required: true }
}, { timestamps: true })

const QuizResult = mongoose.model("QuizResult", quizResultSchema)

module.exports = { QuizResult }

