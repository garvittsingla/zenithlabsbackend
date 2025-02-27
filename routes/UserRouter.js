const express = require("express")
const UserRouter = express.Router()
const User = require("../models/Usermodel")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
require("dotenv").config()
const jwt = require("jsonwebtoken");

UserRouter.post("/signup", async (req, res) => {
    const { username, password } = req.body
    const existing = await User.findOne({ username: username })
    if (existing) {
        return res.status(400).json({ message: "User already exists" })
    }

    bcrypt.hash(password, 10, async function (err, hashed) {
        if (err) {
            return res.status(500).json({ message: "Something went wrong" })
        }

        const newUser = await User.create({ username: username, password: hashed })
        if (newUser) {
            return res.status(200).json({ message: "User registered" })
        } else {
            res.status(500).json({ message: "Something went wrong" })
        }
    })
})

UserRouter.post("/signin", async (req, res) => {
    const { username, password } = req.body
    try {
        const found = await User.findOne({ username: username })
        if (!found) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        bcrypt.compare(password, found.password, (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Something went wrong" })
            }
            if (result) {
                const token = jwt.sign({ userId: found._id }, process.env.JWT_SECRET)
                return res.status(200).json({ message: "Signin successful", token: token })
            } else {
                return res.status(401).json({ message: "Invalid credentials" })
            }
        })
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" })
    }
})

module.exports = UserRouter
