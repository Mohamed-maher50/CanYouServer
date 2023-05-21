const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Request",
  new mongoose.Schema(
    {
      body: {
        type: String,
        required: true,
        max: 300,
      },
      city: {
        type: String,
        required: true,
      },
      sender: {
        type: mongoose.Types.ObjectId,
        ref: "Users",
      },
      isAccepted: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  )
);
