const mongoose = require("mongoose")


async function connectDb (){
    await mongoose.connect("mongodb+srv://garvits093:43rDBHOUx4jmrKmU@cluster0.iokxe.mongodb.net/zenith")
    
    console.log("Database connected")
    
   
}
module.exports = {connectDb}