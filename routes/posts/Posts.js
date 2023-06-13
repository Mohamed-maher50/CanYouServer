const { getAllPosts, create } = require("../../controllers/PostesControllers");
const { protect } = require("../../utils/protect");

const router = require("express").Router({ mergeParams: true });
// create new post

router.post("/", protect, create);

// get all posts
router.get("/", protect, getAllPosts);

// route components post
router.use("/post", protect, require("./post"));

module.exports = router;
