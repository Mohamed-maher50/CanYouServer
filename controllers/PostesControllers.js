const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");
const Post = require("../model/Post");
const User = require("../model/useSchema");
const Comment = require("../model/comment");
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
    res.status(500).json({ msg: "some error" });
  }
};
const addLike = async (req, res) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) return res.status(400).json(errors);
    const post = await Post.findById(req.params.postId);
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
    // return res.status(404).json({ msg: "not found this post" });
  } catch (error) {
    res.status(500).json({ msg: "some error in add like" });
  }
};
const addComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json(errors);
  try {
    const post = await Post.findById(req.params.postId);

    if (post) {
      const newComment = await new Comment({
        sender: req.userId,
        content: req.body.content,
      }).save();
      const newPost = await post.updateOne(
        {
          $addToSet: {
            comments: newComment._id,
          },
        },
        { new: true }
      );

      return res.status(200).json(post);
    }
    return res.status(404).json("not found this posts");
  } catch (error) {
    res.status(500).json({ msg: "some error in add comment" });
  }
};
const deleteComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json(errors);
  try {
    const isOwnerPost = await Post.findOneAndUpdate(
      {
        comments: {
          $elemMatch: {
            $eq: req.params.commentId,
          },
        },
      },
      {
        $pull: {
          comments: req.params.commentId,
        },
      }
    );

    const isDeleted = await Comment.findOneAndDelete({
      sender: req.userId,
      _id: req.params.commentId,
    });

    res.status(200).json("removed");
  } catch (error) {
    res.send(error);
  }
};
const getComments = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id)
      .select("comments -_id")
      .populate({
        path: "comments",
        populate: {
          path: "sender",
          model: "Users",
          select: "email AvatarUrl fullName city ",
        },
      });
    res.send(post);
  } catch (error) {
    res.status(500).json({ msg: "some error get Comments" });
  }
};
module.exports = {
  getAllPosts,
  getPosts,
  addLike,
  addComment,
  deleteComment,
  getComments,
};
