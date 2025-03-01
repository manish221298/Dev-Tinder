const express = require("express");
const authenticateUser = require("../middlewares/auth");
const userController = require("../controllers/userController");
const profileController = require("../controllers/profileController");
const connectionReqController = require("../controllers/connectionRequestController");
const userDetailController = require("../controllers/userDetailController");
const chatController = require("../controllers/chatController");

const route = express.Router();

route.post("/user/signup", userController.register);
route.post("/user/signin", userController.login);

// list of profile api
route.get("/profile/list", authenticateUser, profileController.list);
route.patch("/profile/update", authenticateUser, profileController.update);

// connection request
route.post(
  "/request/send/:status/:toUserId",
  authenticateUser,
  connectionReqController.create
);

route.post(
  "/request/review/:status/:requestId",
  authenticateUser,
  connectionReqController.review
);

// user details

route.get(
  "/user/request/received",
  authenticateUser,
  userDetailController.list
);

route.get(
  "/user/connection/accepted",
  authenticateUser,
  userDetailController.acceptedList
);

route.get("/feed", authenticateUser, userDetailController.feedApi);

// get chat data
route.get("/chat/:targetUserId", authenticateUser, chatController.list);

module.exports = route;
