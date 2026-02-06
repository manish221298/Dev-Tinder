const mongoose = require("mongoose");

const quizSubmitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    testData: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Questions",
          required: true,
        },
        selectedAnswer: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const resultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    testData: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        selectedAnswer: {
          type: String,
          required: true,
        },
      },
    ],
    score: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    correctAnswers: {
      type: Number,
      required: true,
    },
    incorrectAnswers: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
const Result = mongoose.model("Result", resultSchema);

const QuizSubmit = mongoose.model("QuizSubmit", quizSubmitSchema);
module.exports = { QuizSubmit, Result };
