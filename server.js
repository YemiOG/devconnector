import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import users from './routes/api/users.js';
import profile from './routes/api/profile.js';
import posts from './routes/api/posts.js';

dotenv.config()

const app = express();


mongoose
.connect(process.env.DB_CONNECT,{useNewUrlParser: true},()=> console.log('Connected to MongoDB'));

mongoose.set ('bufferCommands', false);

app.get('/', (req, res) => res.send('Hello World'));

app.use ('/api/users', users);
app.use ('/api/posts', posts);
app.use ('/api/profile', profile);

const port = process.env.PORT || 5555;
app.listen(port , () => console.log(`Server running on ${port}`));

 