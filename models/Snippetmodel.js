const mongoose = require("mongoose")

const Snippetschema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    platform:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    tags:{
        type:Array,
        required:true
    },
    url:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now()
    }
})
module.exports = mongoose.model("Snippet",Snippetschema)