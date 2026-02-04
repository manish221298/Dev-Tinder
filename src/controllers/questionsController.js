const { QuestionBank } = require("../models/questions")
const { QuizResult } = require("../models/quizResults")
const questionController = {}

//1.5k

questionController.create = async (req, res) => {
    const { setName, questionSet, questions } = req.body;
    try {
        if (!setName || !questionSet || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ error: "Please upload a valid question set with questions." });
        }
        const newQuestionsSet = new QuestionBank({
            setName,
            questionSet,
            questions
        })
        const savedData = await newQuestionsSet.save()
        return res.status(201).json({ message: "Pdf uploaded successfully", savedData })
    } catch (err) {
        return res.status(500).json({ error: "Something went wrong while saving the questions.", err })
    }
}

questionController.list = async (req, res) => {
    try {
        const questionsList = await QuestionBank.find({}).select('setName questionSet questions')
        const questionSetsSummary = questionsList.map(questionSet => ({
            _id: questionSet._id,
            setName: questionSet.setName,
            questionSet: questionSet.questionSet,
            totalCount: questionSet.questions.length
        }))
        return res.status(200).json({ message: "Question sets retrieved successfully", questionSetsSummary })
    } catch (err) {
        return res.status(500).json({ error: "Something went wrong while fetching the question sets.", err })
    }
}

questionController.getById = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).json({ error: "Question set ID is required." });
        }
        const questionSet = await QuestionBank.findById(id);
        if (!questionSet) {
            return res.status(404).json({ error: "Question set not found." });
        }
        return res.status(200).json({ message: "Question set retrieved successfully", questionSet })
    } catch (err) {
        return res.status(500).json({ error: "Something went wrong while fetching the question set.", err })
    }
}

questionController.submit = async (req, res) => {
    const { quizSetId, results } = req.body;
    try {
        // Validate input
        if (!quizSetId) {
            return res.status(400).json({ error: "Quiz set ID is required." });
        }
        if (!Array.isArray(results) || results.length === 0) {
            return res.status(400).json({ error: "Results array is required and must not be empty." });
        }

        // Fetch the question set
        const questionSet = await QuestionBank.findById(quizSetId);
        if (!questionSet) {
            return res.status(404).json({ error: "Question set not found." });
        }

        // Create a map of question IDs to questions for quick lookup
        const questionMap = new Map();
        questionSet.questions.forEach((question) => {
            questionMap.set(question._id.toString(), question);
        });

        // Evaluate each answer
        let correctCount = 0;
        let totalQuestions = results.length;
        const evaluatedResults = results.map((result) => {
            const question = questionMap.get(result.questionId);

            if (!question) {
                return {
                    question: result.question,
                    questionId: result.questionId,
                    selectedAnswer: result.selectedAnswer,
                    correctAnswer: null,
                    isCorrect: false,
                    error: "Question not found in question set"
                };
            }

            const isCorrect = result.selectedAnswer !== null &&
                result.selectedAnswer.trim().toLowerCase() === question.answer.trim().toLowerCase();

            if (isCorrect) {
                correctCount++;
            }

            return {
                question: result.question,
                questionId: result.questionId,
                selectedAnswer: result.selectedAnswer,
                correctAnswer: question.answer,
                isCorrect: isCorrect
            };
        });

        // Calculate score
        const score = totalQuestions > 0 ? ((correctCount / totalQuestions) * 100).toFixed(2) : 0;

        // Save results to database
        const quizResult = new QuizResult({
            quizSetId: quizSetId,
            userId: req.user ? req.user._id : null,
            results: evaluatedResults,
            totalQuestions: totalQuestions,
            correctAnswers: correctCount,
            incorrectAnswers: totalQuestions - correctCount,
            score: parseFloat(score)
        });

        const savedResult = await quizResult.save();

        return res.status(200).json({
            message: "Quiz submitted successfully",
            resultId: savedResult._id,
            quizSetId: quizSetId,
            totalQuestions: totalQuestions,
            correctAnswers: correctCount,
            incorrectAnswers: totalQuestions - correctCount,
            score: parseFloat(score)
        });
    } catch (err) {
        return res.status(500).json({ error: "Something went wrong while submitting the quiz.", err: err.message })
    }
}


module.exports = questionController