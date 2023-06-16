const router = require("express").Router();
const { body, param } = require("express-validator");
const { sendMessage, getChat, Chats } = require("../controllers/Chats");
const { protect } = require("../utils/protect");
const { isId, handleResultValidation } = require("../utils/validations");
router.post(
  "/:id",
  protect,
  param("id").trim().not().isEmpty(),
  body("content").trim().not().isEmpty(),
  handleResultValidation,
  sendMessage
);

// get all chats for specific user
router.get("/", protect, Chats);
// to get old chat with your friend
router.get(
  "/:id",
  param("id").not().isEmpty().custom(isId).withMessage("not found id pram"),
  handleResultValidation,
  protect,
  getChat
);
module.exports = router;
