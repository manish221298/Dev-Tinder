const userDetailController = {};
const { set } = require("mongoose");
const connectionRequest = require("../models/connectionRequest");
const user = require("../models/user");

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

userDetailController.feedApi = async (req, res) => {
  const loggedInUser = req.user._id;
  const page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  limit = limit > 20 ? 20 : limit;
  const skip = (page - 1) * limit;
  console.log("sip", skip, limit);

  try {
    const myConnectionReq = await connectionRequest
      .find({
        $or: [{ fromUserId: loggedInUser }, { toUserId: loggedInUser }],
      })
      .select("fromUserId toUserId -_id");

    const uniqueReqId = new Set();

    myConnectionReq.forEach((req) => {
      uniqueReqId.add(req.fromUserId.toString());
      uniqueReqId.add(req.toUserId.toString());
    });

    const feedUsers = await user
      .find({
        $and: [
          { _id: { $nin: [...uniqueReqId] } },
          { _id: { $ne: loggedInUser } },
        ],
      })
      .select("firstName lastName email skills")
      .skip(skip)
      .limit(limit);
    console.log(feedUsers);

    return res.status(200).json({ feedUsers });
  } catch (err) {
    return res.status(400).json({ message: err });
  }
};

module.exports = userDetailController;
