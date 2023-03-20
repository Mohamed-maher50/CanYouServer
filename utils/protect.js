const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const User = require("../model/useSchema");
const protect = async (req, res, next) => {
  var token = req.headers.authorization?.split(" ")[1];
  req.token = token;

  try {
    const result = await jwt.verify(
      token,
      process.env.SECRET_KEY_JWT,
      (err, result) => {
        if (err?.name == "JsonWebTokenError")
          return { msg: "please try login" };

        return result;
      }
    );
    if (result.msg) return res.status(400).send("please try login");
    if (!result) return res.status(400).send("unauthorized");
    req.userId = result;

    next();
  } catch (error) {
    res.status(404).json({ msg: error });
  }
};
const isId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

module.exports = { protect, isId };
