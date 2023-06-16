const mongoose = require("mongoose");
const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    playListId: {
      type: mongoose.Types.ObjectId,
      ref: "Playlist",
      required: true,
    },
    completed: [
      {
        type: mongoose.Types.ObjectId,
        default: [],
      },
    ],
  },
  { timestamps: true }
);
const Course = mongoose.model("Video", CourseSchema);
module.exports = Course;
