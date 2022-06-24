import "dotenv/config"
import "./database/db.js"
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js"
import blogRouter from "./routes/blog.route.js"




const app = express();
app.use(cors())
//Recibe datos JSON
app.use(express.json())

app.use("/api/v1/auth",authRouter)
app.use("/api/v1/blogs", blogRouter);

const PORT = process.env.PORT || 6000
app.listen(PORT, () => console.log("🌞🌞🌞🌞 http://localhost:" + PORT))