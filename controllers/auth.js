const { validationResult } = require("express-validator/src/validation-result");
const User = require("../model/useSchema");
const jwt = require("jsonwebtoken");
const Register = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return res.status(400).json(error);
  try {
    let { _id, email, city, AvatarUrl, id, firstVisit, fullName } =
      await User.create({
        ...req.body,
      });
    const token = await jwt.sign(id, process.env.SECRET_KEY_JWT);
    res.status(201).json(
      JSON.stringify({
        user: {
          email,
          AvatarUrl,
          firstVisit,
          fullName,
          city,
          _id,
        },
        token: token,
      })
    );
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
    console.log(error);
    res.status(500).json({ error: error });
  }
};
module.exports = {
  Register,
  Login,
};
