const mongoose = require('mongoose')


const connectDB = async() => {
    await mongoose.connect('mongodb://localhost:27017/devTinder')
}

connectDB().then(() => {
    console.log("Database is Established");
    
}).catch(() => {
    console.error("Database can't established!!")
})



module.exports = connectDB