import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import users from "./routes/api/users.js";
import profile from "./routes/api/profile.js";
import cors from 'cors';
import posts from "./routes/api/posts.js";
import passport from "passport";

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () =>
  console.log("Connected to MongoDB")
);

app.get("/", (req, res) => res.send("Hello World"));

//Passport middleware
app.use(passport.initialize());
//Passport config
import passportConfig from "./config/passport.js";
passportConfig(passport);

// Use routes
app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/profile", profile);

const port = process.env.PORT || 5555;
app.listen(port, () => console.log(`Server running on ${port}`));
