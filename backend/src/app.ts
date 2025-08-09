import "reflect-metadata";
import dotenv from "dotenv"
import express from "express";
import bodyParser from "body-parser";
import cors from "cors"

import "./config/User/auth/di"
import authRoutes from "./presentation/routes/user/authRoute"

const app = express();

app.use(cors());
app.use(bodyParser.json());


app.use("/auth",authRoutes);

const PORT = process.env.PORT;

app.listen(PORT,() => {
    console.log("Server running on PORT : ",PORT)
})

export default app;

