const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];

  try {
    const tokenData = jwt.verify(token, "Mandani2216");
    const user = await User.findById(tokenData._id);
    req.user = user;
    next();
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

module.exports = authenticateUser;
