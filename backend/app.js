import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

import cors from "cors";
import ConnectionDB from "./src/config/db.js";
import ResumeRoutes from "./src/routes/resume.route.js";

const app = express();
const Port = process.env.PORT || 3000;
ConnectionDB();

app.use(express.json());
app.use(cookieParser()); 

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5000"],
    credentials: true,
  }),
);

app.use("/api/v1", ResumeRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ sucess: true, message: "Backend is working ✅" });
});

app.listen(Port, () => {
  console.log("Server Is Connected...", Port);
});
