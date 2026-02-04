const mongoose = require('mongoose')

const questionItemSchema = new mongoose.Schema({
    Question: { type: String, required: true },
    options: { type: [String], required: true },
    answer: { type: String, required: true }
})

const questionSchema = new mongoose.Schema({
    setName: { type: String, required: true },
    questionSet: { type: String, required: true },
    questions: { type: [questionItemSchema], required: true }
})

const QuestionBank = mongoose.model("QuestionBank", questionSchema)

module.exports = { QuestionBank }