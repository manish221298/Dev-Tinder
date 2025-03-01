require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const http = require("http");
connectDB();
const router = require("./routes/routes");
const initializeSocket = require("./utils/socket");
const app = express();
const port = 4001;

app.use(cors());
app.use(express.json());
app.use("/", router);

const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log("Server is successully listen on port", port);
    });
  })
  .catch(() => {
    console.error("Database can't established!!");
  });
