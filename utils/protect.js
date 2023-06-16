const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const User = require("../model/useSchema");
const protect = async (req, res, next) => {
  var token = req.headers.authorization?.split(" ")[1];
  req.token = token;

  try {
    const { userId } = await jwt.verify(token, process.env.SECRET_KEY_JWT);
    if (!userId) return res.status(400).json({ msg: "unauthorized" });
    req.userId = userId;
    next();
  } catch (error) {
    res.status(404).json({ msg: error });
  }
};
const isId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

module.exports = { protect, isId };
