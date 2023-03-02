const { validationResult } = require("express-validator");
const Request = require("../model/RequestsPost");
const User = require("../model/useSchema");
const postCreateRequest = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) return res.status(400).json(errors);
  try {
    const { _id } = await Request.create({
      ...req.body,
      sender: req.userId,
    });

    await User.findByIdAndUpdate(req.userId, {
      $push: {
        requestsPost: _id,
      },
    });
    await User.updateMany(
      {
        city: req.body.city,
      },
      {
        $push: {
          requestsPost: _id,
        },
      }
    );

    res.send("done");
  } catch (error) {
    res.status(500).json({ errors: "some error happened" });
  }
};

const getNotifications = async (req, res) => {
  try {
    const requests = await User.findById(req.userId)
      .populate({
        path: "requestsPost",
        options: {
          sort: {
            createdAt: -1,
          },
        },
        populate: {
          path: "sender",
          model: "Users",
          select: "email AvatarUrl fullName ",
        },
      })
      .select("requestsPost -_id");

    res.status(200).json(requests);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "some error" });
  }
};
module.exports = {
  postCreateRequest,
  getNotifications,
};
