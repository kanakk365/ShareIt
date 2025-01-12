import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db"
import userRouter from "./routes/user"
import contentRouter from "./routes/content"
import tagRouter from "./routes/tags"
import brainRouter from "./routes/brain"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get("/check" , (req ,res)=>{
    res.json({
        message : "i am good"
    })
})

app.use("/api/v1/user" ,userRouter )
app.use("/api/v1/content" , contentRouter)
app.use("/api/v1/tag" ,tagRouter )
app.use("/api/v1/brain" , brainRouter);


async function connect() {
    await connectDB();
    app.listen(PORT, ()=>{
        console.log(`Server is running in ${PORT} at http://localhost:3000`)
    })
}
connect()
export default app