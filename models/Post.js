import mongoose from "mongoose";
const Schema = mongoose.Schema;

//create Schema
const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  text: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
  likes: [
    {
      user: Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      comments: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    },
  ],
});
