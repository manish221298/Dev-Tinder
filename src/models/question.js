const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    questions: { type: String, required: true },
    options: { type: [String], required: true },
    answer: { type: String },
  },
  { timestamps: true }
);

const Questions = mongoose.model("Questions", questionSchema);

module.exports = { Questions };
