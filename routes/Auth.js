const { Register, Login, verifyEmail } = require("../controllers/auth");
const {
  SignUpValidation,
  handleResultValidation,
  LoginValidation,
} = require("../utils/validations");

const router = require("express").Router();
router.post("/signUp", SignUpValidation, handleResultValidation, Register);
router.post("/login", LoginValidation, handleResultValidation, Login);
router.get("/:id/verify/:token", verifyEmail);
module.exports = router;
