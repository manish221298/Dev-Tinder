const User = require("../models/user");
const validateUsers = require("../utils/authValidator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userController = {};

userController.register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    validateUsers(email, password);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await user.save();
    return res.status(201).send("User Registered Successfully !");
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

userController.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send("Invald email or password");
    }

    // const verifyPassword = await bcrypt.compare(password, user.password);
    const verifyPassword = await user.passwordVerify(password);

    if (!verifyPassword) {
      throw new Error("Invald email or password");
    }

    // const token = await jwt.sign({ _id: user._id }, "Mandani2216");
    const token = await user.getJWT();

    return res.status(200).send({ token: token });
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

module.exports = userController;
