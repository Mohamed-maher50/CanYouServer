const mongoose = require("mongoose");
const CoursesSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    coverImg: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    videos: [
      {
        type: mongoose.Types.ObjectId,
        default: [],
        ref: "Videos",
      },
    ],
    students: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);
const Courses = mongoose.model("CoursesPlaylist", CoursesSchema);
module.exports = Courses;
