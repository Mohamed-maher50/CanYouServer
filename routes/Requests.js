const router = require("express").Router();
const { body } = require("express-validator");
const {
  postCreateRequest,
  getNotifications,
} = require("../controllers/Requests");
const { protect } = require("../utils/protect");
router.post(
  "/createRequest",
  body("body").trim().not().isEmpty().withMessage("required body").isString(),
  body("city").trim().not().isEmpty().withMessage("required filed").isString(),
  protect,
  postCreateRequest
);
router.get("/getNotifications", protect, getNotifications);
module.exports = router;
