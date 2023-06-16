const { body } = require("express-validator");
const {
  addSkill,
  deleteSkill,
  getSkills,
} = require("../../controllers/userControllers");
const { protect } = require("../../utils/protect");
const { handleResultValidation } = require("../../utils/validations");
const { v_addSkills, v_deleteSkills } = require("./SkillsValidation");

const router = require("express").Router();
router.get("/", protect, getSkills);
router.post("/", v_addSkills, handleResultValidation, protect, addSkill);
router.delete("/:id", v_deleteSkills, protect, deleteSkill);
module.exports = router;
