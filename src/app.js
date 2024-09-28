const express = require('express')

const app = express()
const port = 4001

app.use("/user", (req, res) => {

    const queryData = req.query
    res.send({"data is": queryData})
})

// app.use("/user/:id/:password", (req, res) => {

//     const paramsData = req.params
//     console.log(paramsData);
    
//     res.send({"data is": paramsData})
// })






app.listen(port, () =>{
    console.log("Server is successully listen on port", port);
})


// xfnbgjcvb