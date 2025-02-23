require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
connectDB();
const User = require("./models/user");
const router = require("./routes/routes");
const app = express();
const port = 4001;

app.use(cors());
app.use(express.json());
app.use("/", router);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log("Server is successully listen on port", port);
    });
  })
  .catch(() => {
    console.error("Database can't established!!");
  });
