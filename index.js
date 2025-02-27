const express = require("express")
const cors =   require("cors")
const {connectDb} = require("./db")
const userRouter = require("./routes/UserRouter")
const SnippetRouter = require("./routes/SnippetRouter")

const port = 8000
const app = express()
connectDb()

app.use(express.json())
app.use(cors())
app.use("/api/user",userRouter)
app.use("/api/snippet",SnippetRouter)


app.listen(8000,()=>{
    console.log("Server running on port 8000")
})