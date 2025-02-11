const profileController = {};
const user = require("../models/user");

profileController.list = async (req, res) => {
  const userd = req.user._id;
  try {
    const userData = await user.findById(userd);
    return res.status(400).json({ userData });
  } catch (err) {
    return res.status(400).json({ message: err });
  }
};

module.exports = profileController;
