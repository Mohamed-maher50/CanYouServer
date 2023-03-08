const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      required: true,
    },
    filed: {
      type: String,
      required: true,
    },
    skills: [String],
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
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
