const { check, validationResult } = require("express-validator");
const { checkEmailExist } = require("../controllers/userControllers");

const v_layer = (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(500).json({ error: err.array() });
  }
  next();
};

exports.v_register = [
  check("NationalID")
    .trim()
    .not()
    .isEmpty()
    .withMessage("NationalID is required"),
  check("email")
    .trim()
    .normalizeEmail()
    .not()
    .custom(checkEmailExist)
    .not()
    .withMessage("this account already exist"),
  check("fullName").trim().not().isEmpty().withMessage("fullName is required"),
  check("birthDay").trim().isEmpty().withMessage("required date"),
  check("city").trim().not().isEmpty(),
  check("password")
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
  v_layer,
];
