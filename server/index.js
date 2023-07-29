const express = require("express");
const dotenv = require("dotenv");
dotenv.config("./.env");
const dbConnect = require("./dbConnect");
const authRouter = require("./Routers/authRouter");
const postRouter = require("./Routers/postRouter");
const userRouter = require("./Routers/userRouter");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");

// import {v2 as cloudinary} from 'cloudinary';
const cloudinary=require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key:  process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});
//middleware
app.use(express.json({limit:"10mb"})); // it is responsible for the insomnia/any request to the auth controller i.e body.req
app.use(morgan("common")); // it will show logs whenever we hit for the send for request and response
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN,
  })
);

app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.use("/user", userRouter);
// app.get("/", (req, res) => {
//   res.status(200).send("OK FROM SERVER");
// });

const PORT = process.env.PORT || 4001;
dbConnect();

app.listen(PORT, () => {
  console.log(`listening on PORT : ${PORT}`);
});
