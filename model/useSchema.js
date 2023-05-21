const mongoose = require("mongoose");
const { isEmail } = require("validator");
const { hastPassword } = require("../utils/hashPassword");
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full Name"],
    trim: true,
  },
  NationalID: {
    type: String,
    required: [true, "National ID"],
    trim: true,
    max: 11,
    min: 11,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "email"],
    trim: true,
    validate: [isEmail, "invalid email"],
  },
  password: {
    type: String,
    required: [true, "password"],
  },
  firstVisit: {
    type: Boolean,
    default: true,
  },
  AvatarUrl: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2016/11/18/23/38/child-1837375_960_720.png",
  },
  skills: [String],
  fullName: String,
  following: [{ type: mongoose.Types.ObjectId, ref: "Users" }],
  followers: [{ type: mongoose.Types.ObjectId, ref: "Users" }],

  followerNumber: {
    type: Number,
  },
  phone: {
    type: String,
  },
  birthDay: {
    type: Date,
    required: true,
    trim: true,
  },
  posts: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Post",
    },
  ],
  requestsPost: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Request",
    },
  ],
  city: {
    type: String,
    default: "Cairo",
  },
  chats: [
    {
      type: mongoose.Types.ObjectId,
      default: [],
      ref: "Chat",
    },
  ],
  rate: {
    type: Number,
    default: 0,
  },
});

userSchema.pre("save", async function () {
  this.password = await hastPassword(this.password);
});

module.exports = mongoose.model("Users", userSchema);
