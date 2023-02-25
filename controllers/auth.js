const { validationResult } = require("express-validator/src/validation-result");
const User = require("../model/useSchema");
const jwt = require("jsonwebtoken");
const Register = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return res.status(400).json({ error: error.array() });
  try {
    let { id, email, AvatarUrl, firstVisit, fullName } = await User.create({
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
        },
        token: token,
      })
    );
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
const Login = async (req, res) => {
  const error = validationResult(req);
  console.log(req.body.user);
  if (!error.isEmpty()) return res.status(401).json({ error: error.array() });
  try {
    var { email, AvatarUrl, fullName, id, firstVisit } = req.body.user;
    const token = await jwt.sign(id, process.env.SECRET_KEY_JWT);
    return res.status(201).json({
      user: {
        email,
        AvatarUrl,
        fullName,
        id,
        firstVisit,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
module.exports = {
  Register,
  Login,
};
