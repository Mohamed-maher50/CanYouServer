const mongoose = require("mongoose");

const Notification = mongoose.model(
  "Notification",
  new mongoose.Schema(
    {
      from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
      to: {
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
module.exports = Notification;
