const router = require("express").Router();
const { body, param } = require("express-validator");
const { sendMessage } = require("../controllers/ChatController");
const { protect } = require("../utils/protect");
router.post(
  "/newMessage/:id",
  protect,
  param("id").trim().not().isEmpty(),
  body("content").trim().not().isEmpty(),
  sendMessage
);
module.exports = router;
