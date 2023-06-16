const {
  getAllPosts,
  create,

  posts,
} = require("../../controllers/PostesControllers");
const { protect } = require("../../utils/protect");

const router = require("express").Router({ mergeParams: true });
// create new post

router.post("/", protect, create);
// route components post
router.use("/post", protect, require("./post"));
// get all posts
router.get("/", protect, getAllPosts);

// get user posts
router.get("/:id", posts);

module.exports = router;
