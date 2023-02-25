const express = require("express");
const { GetHome } = require("../controllers/homeController");
const router = express.Router();

router.get("/home", GetHome);
module.exports = router;
