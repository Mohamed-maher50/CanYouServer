const { validationResult } = require("express-validator");
const Request = require("../model/RequestsPost");
const User = require("../model/useSchema");
const { newNotification } = require("./notification");
const postCreateRequest = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) return res.status(400).json(errors);
  try {
    const request = await Request.create({
      ...req.body,
      sender: req.userId,
    });
    await User.findByIdAndUpdate(req.userId, {
      $push: {
        requestsPost: request._id,
      },
    });
    await User.updateMany(
      {
        city: req.body.city,
      },
      {
        $push: {
          requestsPost: request._id,
        },
      }
    );

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ errors: "some error happened" });
  }
};

const getNotifications = async (req, res) => {
  try {
    console.log(req.userId);
    const user = await User.findById(req.userId).select("city");
    const requests = await Request.find({
      $and: [
        {
          $or: [
            { city: user.city },
            {
              city: "all",
            },
          ],
        },
        {
          canceled: {
            $ne: [req.userId],
          },
        },
        {
          sender: {
            $ne: req.userId,
          },
        },
      ],
    }).sort({
      updatedAt: -1,
    });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ msg: "some error" });
  }
};
const accepted = async (req, res) => {
  const { requestID } = req.params;
  const request = await Request.findById(requestID);
  try {
    if (request.sender == req.userId)
      return res.status(403).json({ msg: "you can accept yourself" });
    if (request.isAccepted == req.userId)
      return res.status(403).json({ msg: "you can't accept you yourself" });
    if (!request.isAccepted) {
      await request.updateOne({
        $set: {
          isAccepted: req.userId,
        },
      });
      const userAccepted = await User.findById(req.userId).select("fullName");
      let genNotification = await newNotification({
        from: req.userId,
        to: request.sender,
        content: `${userAccepted.fullName} accept your request he need to help you let's go🙋‍♂️🙌.`,
      });
      console.log(genNotification);
      return res.status(200).json(request);
    }
    res.status(403).json({ msg: "accepted before" });
  } catch (error) {
    res.status(500).json({ msg: "not complete" });
  }
};
const canceled = async (req, res) => {
  try {
    const { requestID } = req.params;
    const request = await Request.findById(requestID);
    if (request.sender == req.userId)
      return res.status(403).json({ msg: "you can canceled yourself" });
    if (request.canceled?.includes(req.userId))
      return res.status(403).json({ msg: "you already canceled " });
    if (request.isAccepted == req.userId)
      return res.status(403).json({ msg: "you already accepted " });
    await request.updateOne({
      $addToSet: {
        canceled: req.userId,
      },
    });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ msg: "not complete" });
  }
};
module.exports = {
  postCreateRequest,
  getNotifications,
  accepted,
  canceled,
};
