const User = require("../models/user");
const validateUsers = require("../utils/authValidator");
const bcrypt = require("bcrypt");
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

    const verifyPassord = await bcrypt.compare(password, user.password);

    console.log(verifyPassord);

    return res.status(200).send(verifyPassord);
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

module.exports = userController;
