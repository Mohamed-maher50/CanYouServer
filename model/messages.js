const mongoose = require("mongoose");

const Message = mongoose.model(
  "Messages",
  new mongoose.Schema(
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
      content: {
        type: String,
        trim: true,
      },
    },
    { timestamps: true }
  )
);
module.exports = Message;
