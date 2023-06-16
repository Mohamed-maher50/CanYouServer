const User = require("../model/useSchema");
const Chat = require("../model/chat/Chats");
const Message = require("../model/chat/messages");
const sendMessage = async (req, res) => {
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
  try {
    const chat = await Chat.findOne({
      $and: [
        { users: { $elemMatch: { $eq: req.params.id } } },
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
        users: [req.userId, req.params.id],
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

// to get All chats with specific user

const Chats = async (req, res) => {
  try {
    const chats = await Chat.find({
      users: {
        $eq: req.userId,
      },
    });
    res.status(200).json(chats);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};
module.exports = {
  sendMessage,
  getChat,
  Chats,
};
