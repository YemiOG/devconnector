import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import passport from "passport";
import bodyParser from "body-parser";
import users from "./routes/api/users.js";
import profile from "./routes/api/profile.js";
import posts from "./routes/api/posts.js";

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () =>
  console.log("Connected to MongoDB")
);

app.get("/", (req, res) => res.send("Hello World"));

app.use(passport.initialize());

app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/profile", profile);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on ${port}`));
