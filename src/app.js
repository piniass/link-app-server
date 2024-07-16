import express from "express";
import fileUpload from "express-fileupload";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser"
import cors from 'cors'
const app = express()

app.use(cors({
    origin: ['https://linkeados.vercel.app/', 'http://localhost:5173'],
    credentials: true
}))
app.use(morgan('dev'))
app.use(express.json())
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir:'./upload'
}))
app.use(cookieParser())
app.use("/api",authRoutes)
export default app;