const router = require("express").Router();

const {Avatar,addSkill,getSkills,SearchUsers,getUser,SendFollow,getCardInfo,postNewPost,firstVisit,checkEmailExist,deleteSkill,getFriends,UpRate,} = require("../controllers/userControllers");
const { protect } = require("../utils/protect");
const { body } = require("express-validator");
const { verifyPassword } = require("../utils/hashPassword");
const { Register, Login, verifyEmail, VerifieResetCode } = require("../controllers/auth");
const { v_register } = require("../validation/v_user");

// 1) Edite 
router.post("/auth/register" , v_register , Register);
router.post("/auth/verify", VerifieResetCode);



router.post(
  "/auth/login",
  body("email").isEmail().trim().normalizeEmail().custom(checkEmailExist),
  body("password").custom(verifyPassword).withMessage("password wrong"),
  Login
);
router.get("/profile/card/:id", protect, getCardInfo);
router.get("/search", protect, SearchUsers);
router.get("/getSkills", protect, getSkills);
router.get("/profile/:id", getUser);
router.get("/getFriends", protect, getFriends);
router.post("/addSkill", protect, addSkill);
router.post("/createPost", protect, postNewPost);
router.post("/done", UpRate);
router.put("/avatar", protect, Avatar);
router.put("/profile/follow", protect, SendFollow);
router.put("/firstVisit", protect, firstVisit);
router.delete("/deleteSkill/:id", protect, deleteSkill);
router.get("/:id/verify/:token", verifyEmail);



module.exports = router;
