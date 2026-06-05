import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import { connectToDatabase } from "./db/connection.js";
const app=express();
app.use(
  cors({
    origin: "https://creative-sunburst-161669.netlify.app",
    credentials: true,
  })
);
app.set("trust proxy", true);
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use('/uploads', express.static('uploads'));
app.use("/api/v1", appRouter);
// ✅ Start server
const PORT = process.env.PORT || 5000;
connectToDatabase()
  .then(() => {
    app.listen(PORT, () =>
      console.log("Server Open & Connected To Database 🤟")
    );
  })
  .catch((err) => console.log(err));
