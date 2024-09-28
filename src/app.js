const express = require('express')

const app = express()
const port = 4001

app.use("/hello", (req, res) => {
    res.send("Hello World")
})




app.use("/users", (req, res) => {
    res.send("User will get in this route right?")
})

app.use("/emp", (req, res) => {
    res.send("Emp will get in this route")
})

app.listen(port, () =>{
    console.log("Server is successully listen on port", port);
})


// xfnbgjcvb