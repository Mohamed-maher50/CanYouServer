const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imgBody: {
      type: String,
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Users",
      },
    ],
    comments: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Post", postSchema);
