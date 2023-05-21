const {
  createPlayList,
  createSubject,
  getSubjects,
  getMyPlayList,
  SearchPlayList,

  enrollCourse,
  getPlayList,
  completed,
  addComment,
  getComments,
  getMyEnrolledPlayLists,
} = require("../controllers/CoursesController");

const { protect } = require("../utils/protect");

const router = require("express").Router();
router.post("/create/playlist", protect, createPlayList);
router.post("/create/subject", protect, createSubject);
router.post("/search/playLists", protect, SearchPlayList);
router.post("/addComment/:id", protect, addComment);
router.put("/enroll/playLists/:id", protect, enrollCourse);
router.put("/completed/:courseId", protect, completed);
router.get("/getSubject/:playListId", protect, getSubjects);
router.get("/getPlaylist/:playlistId", protect, getPlayList); // to get playlist /:id of playList
router.get("/getMyPlayLists", protect, getMyPlayList);
router.get("/comments/:CourseId", protect, getComments);
router.get("/enrolled/playlist", protect, getMyEnrolledPlayLists);
module.exports = router;
