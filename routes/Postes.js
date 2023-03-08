const { body, param } = require("express-validator");
const {
  getAllPosts,
  getPosts,
  addLike,
  deleteComment,
  addComment,
} = require("../controllers/PostesControllers");
const { protect } = require("../utils/protect");
const { isId } = require("../utils/validations");
const router = require("express").Router();

router.get("/getPosts", protect, getAllPosts);
router.get("/posts/:id", protect, getPosts);
router.put(
  "/posts/:postId",
  param("postId").custom(isId),

  protect,
  addLike
);
router.post(
  "/posts/:postId",
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
module.exports = router;
