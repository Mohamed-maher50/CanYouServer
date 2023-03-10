const router = require("express").Router();

const {
  Avatar,
  addSkill,
  getSkills,
  SearchUsers,
  getUser,
  SendFollow,
  getCardInfo,
  postNewPost,
  firstVisit,
  checkEmailExist,
  deleteSkill,
} = require("../controllers/userControllers");
const { protect } = require("../utils/protect");
const { body } = require("express-validator");
const { verifyPassword } = require("../utils/hashPassword");
const { Register, Login } = require("../controllers/auth");

router.post(
  "/auth/register",
  body("email")
    .trim()
    .normalizeEmail()
    .not()
    .custom(checkEmailExist)
    .withMessage("this account already exist"),
  body("firstName").trim().not().isEmpty().withMessage("firstName is required"),
  body("lastName").trim().not().isEmpty().withMessage("lastName is required"),
  body("city").trim().not().isEmpty(),
  body("password")
    .not()
    .isEmpty()
    .trim()
    .custom((password, { req }) => {
      if (password != req.body.confirmPassword)
        return Promise.reject("password not equal confirm password");
      return true;
    }),
  Register
);
router.post(
  "/auth/login",
  body("email").isEmail().trim().normalizeEmail().custom(checkEmailExist),
  body("password")
    .isLength({ min: 2 })
    .withMessage("password must be at least 7 chars long")
    .custom(verifyPassword),
  Login
);
router.get("/profile/card/:id", protect, getCardInfo);
router.put("/avatar", protect, Avatar);
router.post("/addSkill", protect, addSkill);
router.delete("/deleteSkill/:skill", protect, deleteSkill);
router.get("/getSkills", protect, getSkills);
router.get("/search", protect, SearchUsers);
router.get("/profile/:id", getUser);
router.put("/profile/follow", protect, SendFollow);
router.post("/createPost", protect, postNewPost);
router.put("/firstVisit", protect, firstVisit);

module.exports = router;
