import express from "express";
import { config } from "dotenv";
import morgan from "morgan"
import router from "./routes/router.js";
import cookieParser from "cookie-parser";
import cors from 'cors'

config();
const app = express();

// use for Read some data from client side
// Middlewares
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET))

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

// Middleware to set CORS headers explicitly
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});


  // Middleware to clear unwanted cookies
// app.use((req, res, next) => {
//   res.clearCookie(".Tunnels.Relay.WebForwarding.Cookies", {
//     path: "/",
//     domain: "turbo-winner-9xg9g96xqp5fpr79-5137.app.github.dev",
//     httpOnly: true,
//     secure: true,
//   });
//   next();
// });

// remove it in production
app.use(morgan("dev"));

app.use("/api/v1", router);

export default app


/*
  Type of HTTP Request
  1: GET 
  // if We want to Get Data From backend or Database
  2: PUT /
  / If we want to modify, Mutate or Update Some Data
  3: POST 
  // If we want to send or Read some Data From Client. Such that Create Post
  4: DELETE
  // Delete Some Data
*/

/*
app.get("/hello", (req,res,next)=>{
      return res.send("Get Request");
})

app.post("/posts", (req,res,next)=>{
  console.log(req.body.name);
  return res.send("Post Request");
})
app.put("/put", (req,res,next)=>{
  console.log(req.body.name);
  return res.send("put Request");
})

app.delete("/user/:id", (req,res,next)=>{
  console.log(req.params.id);
  return res.send("delete Request");
})

*/
