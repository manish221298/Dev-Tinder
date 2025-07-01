const { QuestionBank } = require("../models/uploadPdf");
const uploadPdfController = {};

//1.5k

uploadPdfController.create = async (req, res) => {
  const { setName, questionSet, questions } = req.body;

  try {
    if (
      !setName ||
      !questionSet ||
      !Array.isArray(questions) ||
      questions.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Please upload a valid question set with questions." });
    }

    const newQuestionsSet = new QuestionBank({
      setName,
      questionSet,
      questions,
    });

    const savedData = await newQuestionsSet.save();

    return res
      .status(201)
      .json({ message: "Pdf uploaded successfully", savedData });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Something went wrong while saving the questions.", err });
  }
};

module.exports = uploadPdfController;
