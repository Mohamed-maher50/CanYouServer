const User = require("../model/useSchema");
const Post = require("../model/posts/Post");
const Avatar = async (req, res) => {
  const { imgUrl } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        $set: {
          AvatarUrl: imgUrl,
          firstVisit: false,
        },
      },
      { new: true }
    ).select("email firstVisit AvatarUrl fullName");
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json(error);
  }
};

const SearchUsers = async (req, res) => {
  try {
    const query = req.query.searchValue;
    if (!query) return res.status(200).json([]);
    const users = await User.find({
      fullName: {
        $regex: query,
        $options: "i",
      },
    })
      .select("-password -firstName -lastName -firstVisit")
      .limit(5);
    res.status(200).json(users);
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
    res.status(200).json(user);
  } catch (error) {
    res.sendStatus(400);
  }
};
const SendFollow = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndUpdate(
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
    res.status(200).json({ data: followUser });
  } catch (error) {
    res.status(500).json({ error: "some error happened in make follow" });
  }
};

// to find user data
const Details = async (req, res) => {
  // get User id from params request
  const { id } = req.params;

  try {
    // then find user by id from mongodb
    // select will make select specific data from document
    const user = await User.findById(id).select(
      "followers following fullName AvatarUrl"
    );

    // after find response will be user data
    // 200 success
    res.status(200).json(user);
  } catch (error) {
    // if there error then return error and skip request
    res.status(422).json({ msg: error });
  }
};

const firstVisit = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, {
      $set: {
        firstVisit: false,
      },
    });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ msg: "done" });
  }
};
const checkEmailExist = async (email, { req }) => {
  const user = await User.findOne({ email });

  if (!user) return Promise.reject("can't not found this account");
  req.body.hashPassword = user.password;
  req.body.user = user;
  return true;
};
const addSkill = async (req, res) => {
  try {
    let { skills } = await User.findByIdAndUpdate(
      req.userId,
      {
        $push: {
          skills: req.body.skill,
        },
      },
      { new: true }
    );

    res.status(200).json(skills);
  } catch (error) {
    return res.status(500).json({ msg: "can't make this addition" });
  }
};
const getSkills = async (req, res) => {
  try {
    const { skills } = await User.findById(req.userId).select("skills -_id");
    console.log(skills);
    res.status(200).json(skills);
  } catch (error) {
    res.status(422).json({ msg: error });
  }
};
const deleteSkill = async (req, res) => {
  const { id } = req.params;

  try {
    await User.findByIdAndUpdate(
      req.userId,
      {
        $pull: {
          skills: { _id: id },
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
const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("following -_id")
      .populate("following", "fullName AvatarUrl email ");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
const UpRate = async (req, res) => {
  const allUser = await User.updateOne({
    $set: {
      rate: req.body.rate,
    },
  });
  allUser.save();
};

module.exports = {
  Avatar,
  addSkill,
  getSkills,
  SearchUsers,
  getUser,
  SendFollow,
  Details,
  firstVisit,
  checkEmailExist,
  deleteSkill,
  getFriends,
  UpRate,
};
