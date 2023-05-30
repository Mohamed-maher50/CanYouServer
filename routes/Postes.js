const { body, param } = require("express-validator");
const {
  getAllPosts,
  getPosts,
  addLike,
  deleteComment,
  addComment,
  getComments,
} = require("../controllers/PostesControllers");
const { protect } = require("../utils/protect");
const { isId } = require("../utils/validations");
const router = require("express").Router();

router.get("/getPosts", protect, getAllPosts);
router.get("/posts/:id", protect, getPosts);
router.put(
  "/posts/likes/:postId",
  param("postId").custom(isId),
  protect,
  addLike
);
router.post(
  "/posts/comments/:postId",
  param("postId").custom(isId).withMessage("not valid id"),
  body("content").not().isEmpty().withMessage("enter content"),
  protect,
  addComment
);
router.delete(
  "/posts/:commentId",
  param("commentId").custom(isId),
  protect,
  deleteComment
);
router.get("/comments/getComments/:id", getComments);
module.exports = router;
