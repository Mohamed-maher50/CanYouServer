const {
  createSubject,
  addComment,
  getSubjects,
  getComments,
  completed,
} = require("../../controllers/CoursesController");
const { protect } = require("../../utils/protect");

const router = require("express").Router();

//to create new in your playlist
router.post("/", protect, createSubject);

// to create new comment in specific video
router.post("/comments/:id", protect, addComment);
// all comments for enrolled video
router.get("/comments/:id", protect, getComments);
router.put("/completed/:courseId", protect, completed);

// to get content of enrolled playlist
router.get("/:id", protect, getSubjects);
module.exports = router;
