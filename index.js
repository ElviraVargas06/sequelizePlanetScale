import "dotenv/config"
import "./database/db.js"
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js"
import blogRouter from "./routes/blog.route.js"




const app = express();




//Recibe datos JSON
app.use(express.json())

app.use("/api/v1/auth",authRouter)
app.use("/api/v1/blogs", blogRouter);

app.get("/", (req, res)=>{
    res.send("Bienvenido a mi API!")
})

const PORT = process.env.PORT || 6000
app.listen(PORT, () => console.log("🌞🌞🌞🌞 http://localhost:" + PORT))