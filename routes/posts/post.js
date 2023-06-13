const {
  getPost,
  deleteComment,
  addLike,
  addComment,
  getComments,
} = require("../../controllers/PostesControllers");
const { protect } = require("../../utils/protect");

const router = require("express").Router();

// get specific post
router.get("/:id", getPost);

// add comment to specific post
router.post("/:id/comment/", addComment);

//  get comments for specific post
router.get("/:id/comments/", getComments);

// add like to post
router.put("/:id/like/", protect, addLike);

// delete  comment for specific post
router.delete("/comment/:id", protect, deleteComment);

module.exports = router;
