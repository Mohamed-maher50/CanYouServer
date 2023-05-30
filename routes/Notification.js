const {
  newNotification,
  getNotification,
} = require("../controllers/notification");
const { protect } = require("../utils/protect");

const router = require("express").Router();

// router.post("/", protect, newNotification);
router.get("/", protect, getNotification);
module.exports = router;
