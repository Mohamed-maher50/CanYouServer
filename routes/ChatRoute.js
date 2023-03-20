const router = require("express").Router();
const { body, param } = require("express-validator");
const {
  sendMessage,

  getChat,
} = require("../controllers/ChatController");
const { protect } = require("../utils/protect");
const { isId } = require("../utils/validations");
router.post(
  "/newMessage/:id",
  protect,
  param("id").trim().not().isEmpty(),
  body("content").trim().not().isEmpty(),
  sendMessage
);
router.get(
  "/chat/:chatWith",
  param("chatWith")
    .not()
    .isEmpty()
    .custom(isId)
    .withMessage("not found id pram"),
  protect,
  getChat
);
module.exports = router;
