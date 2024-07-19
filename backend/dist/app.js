import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import router from "./routes/router.js";
import cookieParser from "cookie-parser";
import cors from 'cors';

config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// CORS configuration
const allowedOrigin = "https://mujtaba-gpt.vercel.app";

const corsOptions = {
    origin: allowedOrigin,
    methods: ['POST'],
    credentials: true
};

app.use(cors(corsOptions));

// Handle preflight requests
//app.options('*', cors(corsOptions));

// Logging middleware
app.use(morgan("dev"));

// Routes
app.use("/api/v1", router);

// Default response for other routes

export default app;
