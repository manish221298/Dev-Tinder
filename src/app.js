const express = require('express')
const connectDB = require("./config/database")
connectDB()
const app = express()
const port = 4001




app.listen(port, () =>{
    console.log("Server is successully listen on port", port);
})