const express = require("express")
require("dotenv").config()
const jwt = require("jsonwebtoken")

async function auth(req,res,next){
    
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    const secret = process.env.JWT_SECRET;
    // console.log(token);
    const decoded = jwt.verify(token,secret)
    if (!decoded) {
        return res.status(401).json({ message: 'Invalid token' });
    }
    // console.log(decoded.userId);
    req.userId = decoded.userId;
    next()
}

module.exports=auth