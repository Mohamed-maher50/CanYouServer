const { default: mongoose, Mongoose } = require("mongoose");

module.exports = mongoose.model(
  "Comment",
  new mongoose.Schema({
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
    content: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Users",
      },
    ],
  })
);
