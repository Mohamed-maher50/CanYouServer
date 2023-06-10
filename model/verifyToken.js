const { default: mongoose } = require("mongoose");

module.exports = mongoose.model(
  "VerifyToken",
  new mongoose.Schema({
    userId: {
      type: mongoose.Types.ObjectId,
      unique: true,
      ref: "Users",
    },
    token: {
      type: String,
      required: true,
    },
    createAt: {
      type: Date,
      default: Date.now(),
      expires: 3600,
    },
  })
);
