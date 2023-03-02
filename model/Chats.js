const mongoose = require("mongoose");
const chatModel = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Messages",
      },
    ],
  },
  { timestamps: true }
);
const Chat = mongoose.model("Chat", chatModel);
module.exports = Chat;
