const { getAllPosts, getPosts } = require("../controllers/PostesControllers");
const { protect } = require("../utils/protect");
const router = require("express").Router();

router.get("/getPosts", protect, getAllPosts);
router.get("/posts/:id", protect, getPosts);
module.exports = router;
