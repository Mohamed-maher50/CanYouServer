const mongoose = require("mongoose");
const { isEmail } = require("validator");
const { hastPassword } = require("../utils/hashPassword");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Last Name"],
    trim: true,
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
  posts: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Post",
    },
  ],
});

userSchema.pre("save", async function () {
  this.fullName = this.firstName + " " + this.lastName;
  this.password = await hastPassword(this.password);
});

module.exports = mongoose.model("Users", userSchema);
