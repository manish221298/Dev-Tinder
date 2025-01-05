const validator = require("validator");

const validateUsers = (email, password) => {
  const isEmail = validator.isEmail(email);

  if (!isEmail) {
    throw new Error("Invalid email format");
  }

  const strongPassword = validator.isStrongPassword(password);

  if (!strongPassword) {
    throw new Error("Please enter strong password");
  }
};

module.exports = validateUsers;
