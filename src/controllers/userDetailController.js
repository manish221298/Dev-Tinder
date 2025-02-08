const userDetailController = {};
const connectionRequest = require("../models/connectionRequest");

userDetailController.list = async (req, res) => {
  const loggedInUser = req.user._id;

  try {
    const requestedData = await connectionRequest
      .find({
        toUserId: loggedInUser,
        status: "interested",
      })
      .populate("fromUserId", "firstName lastName email");

    if (!requestedData) {
      return res.json({ message: "Pending request not found" });
    }

    return res
      .status(200)
      .json({ message: "Pending requests are ", requestedData });
  } catch (err) {
    return res.status(400).json({ message: err });
  }
};

userDetailController.acceptedList = async (req, res) => {
  const loggedInUser = req.user._id;

  try {
    const myConnection = await connectionRequest
      .find({
        $or: [
          { fromUserId: loggedInUser, status: "accepted" },
          { toUserId: loggedInUser, status: "accepted" },
        ],
      })
      .populate("toUserId", "firstName lastName email")
      .populate("fromUserId", "firstName lastName email");
    if (!myConnection) {
      return res.json({ message: "Pending request not found" });
    }
    return res
      .status(200)
      .json({ message: "Pending requests are ", myConnection });
  } catch (err) {
    return res.status(400).json({ message: err });
  }
};

module.exports = userDetailController;
