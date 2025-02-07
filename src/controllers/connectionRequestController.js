const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const connectionReqController = {};

connectionReqController.create = async (req, res) => {
  const fromUserId = req.user._id;
  const toUserId = req.params.toUserId;
  const status = req.params.status;

  try {
    const allowedStatus = ["interested", "ignored"];

    if (!allowedStatus.includes(status)) {
      return res.status(401).json({ message: "Invalid status " + status });
    }

    const validateUser = await User.findById(toUserId);

    if (!validateUser) {
      return res.status(401).json({ message: "User doesn't exist" });
    }

    const validateConnection = await connectionRequest.findOne({
      $or: [
        { toUserId, fromUserId },
        { toUserId: fromUserId, fromUserId: toUserId },
      ],
    });

    if (validateConnection) {
      return res.status(401).json({ message: "Connection already exist" });
    }

    if (toUserId.toString() === fromUserId.toString()) {
      return res
        .status(401)
        .json({ message: "You can't send connection to yourself" });
    }

    const connectionReqData = new connectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionReqData.save();

    res.status(201).json({ message: "Connection sent successully", data });
  } catch (err) {
    res.status(500).json(err);
  }
};

connectionReqController.review = async (req, res) => {
  const toUserId = req.user._id;
  const requestId = req.params.requestId;
  const status = req.params.status;

  try {
    const allowedStatus = ["accepted", "rejected"];

    if (!allowedStatus.includes(status)) {
      return res.status(401).json({ message: "Invalid status " + status });
    }

    const validateRequest = await connectionRequest.findOne({
      _id: requestId,
      status: "interested",
      toUserId: toUserId,
    });

    if (!validateRequest) {
      return res.status(401).json({ message: "Invalid Connection request" });
    }

    validateRequest.status = status;

    const data = await validateRequest.save();
    res.status(200).json({ message: "Connection request is" + status, data });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = connectionReqController;
