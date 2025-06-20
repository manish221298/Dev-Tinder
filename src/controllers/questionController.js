const questionController = {};
const { Questions } = require("../models/question");

questionController.create = async (req, res) => {
  const { questions, answer, options } = req.body;
  try {
    if (
      !questions ||
      !answer ||
      !Array.isArray(options) ||
      options.length < 4
    ) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const newQuestions = new Questions({
      questions,
      answer,
      options,
    });

    await newQuestions.save();
    return res
      .status(201)
      .json({ message: "Question created successfully", data: newQuestions });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

questionController.list = async (req, res) => {
  try {
    const questionList = await Questions.find();

    return res.status(200).json({
      message: "Questions retrieved successfully",
      questionList,
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = questionController;
