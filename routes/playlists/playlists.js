const {
  createPlayList,
  getMyPlayList,
  SearchPlayList,
  enrollCourse,
  getPlayList,
  getMyEnrolledPlayLists,
} = require("../../controllers/CoursesController");
const { protect } = require("../../utils/protect");
const router = require("express").Router();

// to create new playlist
router.post("/", protect, createPlayList);

// my playlist was created
router.get("/", protect, getMyPlayList);

//search in playlist
router.get("/search", protect, SearchPlayList);

// to update enrolled video
router.put("/enroll/:id", protect, enrollCourse);

//my playlist was enrolled
router.get("/enrolled", protect, getMyEnrolledPlayLists);

// deep route
router.use("/video", require("./Video"));
// to get specific
router.get("/:id", protect, getPlayList);
module.exports = router;
