const { validationResult } = require("express-validator/src/validation-result");
const User = require("../model/useSchema");
const Token = require("../model/verifyToken");
const jwt = require("jsonwebtoken");

const { sendMail, genURL } = require("../utils/SendMail");
const { genToken } = require("../utils/genToken");

const Register = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return res.status(400).json(error);
  try {
    let { _id, email, city, AvatarUrl, id, fullName, firstVisit, isVerified } =
      await User.create({
        ...req.body,
      });
    const { token } = await genToken(_id);

    await sendMail(email.trim(), "verify Your email 🙌❤️", genURL(_id, token));
    const userToken = await jwt.sign(id, process.env.SECRET_KEY_JWT);

    res.status(201).json({
      user: {
        email,
        AvatarUrl,
        firstVisit,
        fullName,
        isVerified,
        city,
        _id,
      },
      token: userToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};
const Login = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return res.status(400).json(error);
  try {
    if (!req.body.user) return res.status(401).json({ error: "ldkf" });
    var { email, AvatarUrl, fullName, id, _id, firstVisit, city } =
      req.body.user;
    const token = await jwt.sign(id, process.env.SECRET_KEY_JWT);
    return res.status(201).json({
      user: {
        email,
        AvatarUrl,
        fullName,
        _id,
        city,
        firstVisit,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
const verifyEmail = async (req, res) => {
  const { id, token } = req.params;
  try {
    const data = await Token.findOne({ userId: id, token });
    if (!data) return res.status(400).json({ msg: "this not valid link" });
    await data.deleteOne();
    const user = await User.findByIdAndUpdate(id, {
      isVerified: true,
    });

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "some error" });
  }
};
module.exports = {
  Register,
  Login,
  verifyEmail,
};
