import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import router from "./routes/router.js";
import cookieParser from "cookie-parser";
import cors from 'cors';

config();
const app = express();

// Use for reading data from the client side
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

const allowedOrigins = ['https://mujtaba-gpt.vercel.app'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"]
};

// Apply CORS middleware to all routes
app.use(cors(corsOptions));

// Explicitly handle preflight requests
app.options('*', cors(corsOptions));

// Middleware to log request headers for debugging
app.use((req, res, next) => {
  console.log('Request Headers:', req.headers);
  next();
});


// Test route to verify CORS
app.get('/api/v1/test-cors', (req, res) => {
  res.json({ message: 'CORS is working' });
});

app.use("/api/v1", router);

// Error handling middleware
app.use((err, req, res, next) => {
  if (err) {
    console.error('Error:', err.message);
    res.status(500).send('CORS Error: ' + err.message);
  } else {
    next();
  }
});

export default app;
