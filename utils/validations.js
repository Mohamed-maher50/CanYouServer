const { body, validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");
const { checkEmailExist } = require("../controllers/userControllers");
const { verifyPassword } = require("./hashPassword");

mongoose;
const isId = (id) => {
  let check = mongoose.isValidObjectId(id);
  return check;
};

const SignUpValidation = [
  body("NationalID")
    .trim()
    .not()
    .isEmpty()
    .withMessage("NationalID is required"),
  body("email")
    .trim()
    .normalizeEmail()
    .not()
    .custom(checkEmailExist)
    .not()
    .withMessage("this account already exist"),
  body("fullName").trim().not().isEmpty().withMessage("fullName is required"),
  body("birthDay")
    .trim()
    .not()
    .isEmpty()
    .isDate()
    .withMessage("date is required"),
  body("city").trim().not().isEmpty(),
  body("password")
    .isLength({ min: 7 })
    .withMessage(" password should be at least 7 characters. ")
    .not()
    .isEmpty()
    .trim()
    .custom((password, { req }) => {
      if (password != req.body.confirmPassword)
        return Promise.reject("password not equal confirm password");
      return true;
    }),
];
const LoginValidation = [
  body("email").isEmail().trim().normalizeEmail().custom(checkEmailExist),
  body("password").custom(verifyPassword).withMessage("password wrong"),
];
const handleResultValidation = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return res.status(400).json(error);

  next();
};
module.exports = {
  isId,
  SignUpValidation,
  LoginValidation,
  handleResultValidation,
};
