const express = require("express");
const authenticateUser = require("../middlewares/auth");
const userController = require("../controllers/userController");
const profileController = require("../controllers/profileController");
const connectionReqController = require("../controllers/connectionRequestController");

const route = express.Router();

route.post("/user/signup", userController.register);
route.post("/user/signin", userController.login);

// list of profile api
route.get("/profile/list", authenticateUser, profileController.list);

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

module.exports = route;
