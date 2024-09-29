const express = require('express')

const app = express()
const port = 4001

// play with multiple req, res handeler
app.use("/user", (req, res, next) => {
   next() // called to next req-res handler and return response handler 2
    res.send("Response handler 1")
    // next()  // not called next handler if next is there called
},
(req, res, next) => {
    next()
    res.send("Response handler 2")
    // next()
},
(req, res, next) => {
    next()
    res.send("Response handler 3")
}
)

app.listen(port, () =>{
    console.log("Server is successully listen on port", port);
})