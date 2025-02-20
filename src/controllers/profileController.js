const profileController = {};
const user = require("../models/user");

profileController.list = async (req, res) => {
  const userd = req.user._id;
  try {
    const userData = await user.findById(userd);
    return res.status(200).json({ userData });
  } catch (err) {
    return res.status(400).json({ message: err });
  }
};

profileController.update = async (req, res) => {
  const userd = req.user._id;

  try {
    const userData = await user.findById(userd);

    if (!userData) {
      return res.status(400).json({ message: "Invalid request" });
    }

    Object.assign(userData, req.body);

    await userData.save();

    return res.status(200).json({ userData });
  } catch (err) {
    return res.status(400).json({ message: err });
  }
};

module.exports = profileController;
