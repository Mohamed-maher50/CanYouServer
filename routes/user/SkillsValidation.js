const { body, param } = require("express-validator");

const v_addSkills = [
  body("skill").trim().not().isEmpty().withMessage("required value"),
];
const v_deleteSkills = [
  param("id").trim().not().isEmpty().withMessage("please provide user id"),
];
module.exports = { v_addSkills, v_deleteSkills };
