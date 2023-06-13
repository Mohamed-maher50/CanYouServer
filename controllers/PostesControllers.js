const { default: mongoose } = require("mongoose");
const Post = require("../model/posts/Post");
const User = require("../model/useSchema");
const Comment = require("../model/posts/comment");

const getAllPosts = async (req, res) => {
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
            {
              $addFields: {
                comments: {
                  $slice: ["$comments", 0, 2],
                },
              },
            },
            {
              $lookup: {
                from: "comments",
                localField: "comments",
                foreignField: "_id",
                as: "comments",
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
    res.status(500).json(error);
  }
};
const getPost = async (req, res) => {
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
    res.status(500).json({ msg: "some error" });
  }
};
const addLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      if (post.likes.includes(req.userId)) {
        await post.updateOne(
          {
            $pull: {
              likes: req.userId,
            },
          },
          { new: true }
        );
      } else {
        await post.updateOne(
          {
            $push: {
              likes: req.userId,
            },
          },
          { new: true }
        );
      }

      return res.status(200).json(post);
    }
    return res.status(404).json({ msg: "not found this post" });
  } catch (error) {
    res.status(500).json({ msg: "some error in add like" });
  }
};

const create = async (req, res) => {
  try {
    const savedPost = await Post.create({
      ...req.body,
      author: req.userId,
    });

    await User.findByIdAndUpdate(
      req.userId,
      {
        $push: {
          posts: savedPost._id,
        },
      },
      { new: true }
    );

    let post = await savedPost.populate("author", "email AvatarUrl fullName");

    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};

// add comment for specific post
const addComment = async (req, res) => {
  try {
    var newComment = await new Comment({
      postId: req.params.id,
      sender: req.userId,
      content: req.body.content,
    }).save();
    return res.status(200).json(newComment);
  } catch (error) {
    // 422 Unprocessable Entity :not complete data eg/json or body
    res.status(422).json({ msg: error });
  }
};

//get comments for specific post
const getComments = async (req, res) => {
  const { id } = req.params;
  try {
    let allComments = await Comment.find({ postId: id });
    res.status(200).json(allComments);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};
//delete comment for specific post
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findOne({
      sender: req.userId,
      _id: req.params.id,
    });
    if (!comment)
      return res.status(404).json({ msg: "not found this comment" });
    if (comment.sender != req.userId)
      return res
        .status(403)
        .json({ msg: "unauthorized only owner can delete " });
    await comment.deleteOne();
    res.status(200).json("removed");
  } catch (error) {
    // 422 Unprocessable Entity :not complete data eg/json or body
    res.status(422).json({ msg: error });
  }
};

module.exports = {
  getAllPosts,
  getPost,
  addLike,
  addComment,
  deleteComment,
  create,
  getComments,
};
