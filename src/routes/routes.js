const express = require("express");
const userController = require("../controllers/userController");

const route = express.Router();

route.post("/user/signup", userController.register);
route.post("user/signin", userController.login);

module.exports = route;
