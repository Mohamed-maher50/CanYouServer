const User = require("../model/useSchema");
const Chat = require("../model/Chats");
const Message = require("../model/messages");
const { validationResult } = require("express-validator");

const sendMessage = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.array());

  try {
    const newMessage = await new Message({
      sender: req.userId,
      content: req.body.content,
    }).save();
    const chat = await Chat.findById(req.params.id);
    if (chat)
      await chat.updateOne({
        $push: {
          messages: newMessage._id,
        },
      });
    res.status(200).json(newMessage);
  } catch (error) {
    res.status(500).json({ msg: "some error" });
  }
};
const getChat = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json(errors);
  try {
    const chat = await Chat.findOne({
      $and: [
        { users: { $elemMatch: { $eq: req.params.chatWith } } },
        { users: { $elemMatch: { $eq: req.userId } } },
      ],
    })
      .populate({
        path: "users",
        select: "AvatarUrl fullName",
        model: "Users",
      })
      .populate({
        path: "messages",
        options: {
          sort: { createdAt: 1 },
        },
        populate: {
          path: "sender",
          select: "AvatarUrl fullName",
          model: "Users",
        },
      });

    if (!chat) {
      const createChat = await Chat.create({
        users: [req.userId, req.params.chatWith],
        messages: [],
      });
      const chat = await Chat.findById(createChat._id).populate("users");
      return res.status(200).json(chat);
    }
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ msg: "not allowed" });
  }
};
module.exports = {
  sendMessage,
  getChat,
};
