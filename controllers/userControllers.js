const User = require("../model/useSchema");
const jwt = require("jsonwebtoken");
const Post = require("../model/Post");
const { validationResult } = require("express-validator/src/validation-result");
const Avatar = async (req, res) => {
  const { imgUrl } = req.body;
  try {
    const userExist = await User.findByIdAndUpdate(
      req.userId,
      {
        $set: {
          AvatarUrl: imgUrl,
          firstVisit: false,
        },
      },
      { new: true }
    ).select("email firstVisit AvatarUrl fullName");
    res.status(200).json(JSON.stringify({ user: userExist }));
  } catch (error) {
    res.status(400).json(error);
  }
};
const addSkill = async (req, res) => {
  const { data } = req.body;
  if (!data) return res.status(400).json("Enter Value");
  const skills = await User.findByIdAndUpdate(
    req.userId,
    {
      $push: {
        skills: data,
      },
    },
    { new: true }
  ).select("skills -_id");

  res.status(200).json(skills);
};
const getSkills = async (req, res) => {
  const skills = await User.findById(req.userId).select("skills -_id");
  res.status(200).json(skills);
};
const SearchUsers = async (req, res) => {
  try {
    const query = req.query.searchValue;
    if (!query) return res.status(200).json(JSON.stringify([]));
    const users = await User.find({
      fullName: {
        $regex: query,
        $options: "i",
      },
    })
      .select("-password -firstName -lastName -firstVisit")
      .limit(5);
    res.status(200).json(JSON.stringify(users));
  } catch (error) {
    res.status(500).json({ msg: "some error in server" });
  }
};
const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select(
      "-password -firstName -lastName -firstVisit"
    );
    res.status(200).json(JSON.stringify(user));
  } catch (error) {
    res.sendStatus(400);
  }
};
const SendFollow = async (req, res) => {
  const { id } = req.body;
  try {
    const following = await User.findByIdAndUpdate(
      req.userId,
      {
        $addToSet: {
          following: id,
        },
      },
      { new: true }
    ).select("-password -firstVisit");
    const followUser = await User.findByIdAndUpdate(
      id,
      {
        $addToSet: {
          followers: req.userId,
        },
      },
      { new: true }
    ).select("-password");
    res.status(200).json(JSON.stringify({ data: followUser }));
  } catch (error) {
    res.status(500).json({ error: "some error happened in make follow" });
  }
};
const getCardInfo = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select(
    "followers following fullName AvatarUrl"
  );

  res.status(200).json(JSON.stringify(user));
};
const postNewPost = async (req, res) => {
  const { title, userType, filed, skills } = req.body.data;
  try {
    const savedPost = await Post.create({
      title,
      userType,
      filed,
      skills,
      author: req.userId,
    });

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        $push: {
          posts: savedPost._id,
        },
      },
      { new: true }
    );

    res.status(200).json(JSON.stringify(savedPost));
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};
const firstVisit = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        $set: {
          firstVisit: false,
        },
      },
      {
        new: true,
      }
    );
    res.status(200).send({ msg: "done" });
  } catch (error) {
    res.status(400).json({ msg: "done" });
  }
};
const checkEmailExist = async (email, { req }) => {
  const user = await User.findOne({ email });
  if (!user) return Promise.reject("can't not found this account");
  req.body.hashPassword = user.password;
  req.body.user = user;
  return true;
};
const deleteSkill = async (req, res) => {
  const { skill } = req.params;
  console.log(req.params);
  try {
    await User.findByIdAndUpdate(
      req.userId,
      {
        $pull: {
          skills: skill,
        },
      },
      {
        new: true,
      }
    );
    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ msg: "some error in server delete skill" });
  }
};
module.exports = {
  Avatar,
  addSkill,
  getSkills,
  SearchUsers,
  getUser,
  SendFollow,
  getCardInfo,
  postNewPost,
  firstVisit,
  checkEmailExist,
  deleteSkill,
};
