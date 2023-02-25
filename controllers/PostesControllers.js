const { default: mongoose } = require("mongoose");
const Post = require("../model/Post");
const User = require("../model/useSchema");
const getAllPosts = async (req, res) => {
  console.log(req.userId);
  try {
    const usersPosts = await User.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.userId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "author",
          as: "post",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "author",
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "posts",
          foreignField: "_id",
          as: "posts",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "author",
              },
            },
          ],
        },
      },
      {
        $addFields: {
          posts: {
            $concatArrays: ["$posts", "$post"],
          },
        },
      },
      {
        $unwind: "$posts",
      },
      {
        $sort: {
          "posts.updatedAt": -1,
        },
      },
      {
        $replaceRoot: { newRoot: "$posts" },
      },
      {
        $project: {
          _id: 1,
          author: {
            posts: 0,
            password: 0,
            lastName: 0,
            firstVisit: 0,
          },
        },
      },
      {
        $unwind: "$author",
      },
    ]);

    res.send(usersPosts);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const getPosts = async (req, res) => {
  const { id } = req.params;
  try {
    const posts = await User.findById(id)
      .populate({
        path: "posts",

        populate: {
          path: "author",
          select: "email fullName AvatarUrl skills ",
          model: "Users",
        },
      })
      .select("posts -_id")
      .sort("createdAt");

    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "some error" });
  }
};
module.exports = {
  getAllPosts,
  getPosts,
};
