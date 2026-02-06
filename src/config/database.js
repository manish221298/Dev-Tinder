const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect("mongodb://localhost:27017/devTinder");
  // await mongoose.connect(
  //   "mongodb+srv://iammnsh01:7HoYuMMrIRlMFCWf@devtinder.gxcuq.mongodb.net/?retryWrites=true&w=majority&appName=DevTinder"
  // );
};

module.exports = connectDB;

// nginx config

// server_name 51.20.122.54;

//     location /api/ {
//         proxy_pass http://localhost:4001/;  # Pass the request to the Node.js app
//         proxy_http_version 1.1;
//         proxy_set_header Upgrade $http_upgrade;
//         proxy_set_header Connection 'upgrade';
//         proxy_set_header Host $host;
//         proxy_cache_bypass $http_upgrade;
//     }
