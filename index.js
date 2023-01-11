import "dotenv/config";
import "./database/db.js";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import productRouter from "./routes/product.route.js";

const app = express();

const whiteList = [process.env.ORIGIN1, process.env.ORIGIN2];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("😲😲😲 =>", origin);
      if (!origin || whiteList.includes(origin)) {
        return callback(null, origin);
      }
      return callback("Error de CORS origin: " + origin + " No autorizado!");
    },
    credentials: true,
  })
);

//Recibe datos JSON
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/auth", productRouter);

app.get("/", (req, res) => {
  res.send("Bienvenido a mi API!");
});

const PORT = process.env.PORT || 6001;
app.listen(PORT, () => console.log("🌞🌞🌞🌞 http://localhost:" + PORT));
