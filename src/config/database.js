const mongoose = require("mongoose");

const connectDB = async () => {
  // await mongoose.connect('mongodb://localhost:27017/devTinder')
  await mongoose.connect(
    "mongodb+srv://iammnsh01:7HoYuMMrIRlMFCWf@devtinder.gxcuq.mongodb.net/?retryWrites=true&w=majority&appName=DevTinder"
  );
};

module.exports = connectDB;
