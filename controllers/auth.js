const { validationResult } = require("express-validator/src/validation-result");
const User = require("../model/useSchema");
const Token = require("../model/verifyToken");

const { sendMail, genURL } = require("../utils/SendMail");
const genJwtToken = require("../utils/genJwtToken");

const Register = async (req, res) => {
  try {
    // sign Up
    let { _id, email, city, AvatarUrl, fullName, firstVisit, isVerified } =
      await User.create({
        ...req.body,
      });
    const token = genJwtToken({ userId: _id });
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
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const Login = async (req, res) => {
  try {
    // Login
    var { email, AvatarUrl, fullName, _id, firstVisit, city } = req.body.user;

    //genJwtToken will generate new Token content user id
    const token = genJwtToken({ userId: _id });

    // response will contain user data
    // status 200 => request has been created
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
    // 422 Unprocessable Entity  server was unable to process the entity (e.g., JSON payload)
    // then response with error and skip this error
    res.status(422).json({ error: error });
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
// await sendMail(email.trim(), "verify Your email 🙌❤️", genURL(_id, token));
