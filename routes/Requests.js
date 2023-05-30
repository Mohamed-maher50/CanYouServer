const router = require("express").Router();
const { body } = require("express-validator");
const {
  postCreateRequest,
  getNotifications,
  canceled,
} = require("../controllers/Requests");
const { protect } = require("../utils/protect");
const { accepted } = require("../controllers/Requests");
router.post(
  "/createRequest",
  body("body").trim().not().isEmpty().withMessage("required body").isString(),
  body("city").trim().not().isEmpty().withMessage("required filed").isString(),
  protect,
  postCreateRequest
);
router.post("/accept/:requestID", protect, accepted);
router.post("/canceled/:requestID", protect, canceled);
router.get("/getNotifications", protect, getNotifications);
module.exports = router;
