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
    const chat = await Chat.findOne({
      $and: [
        { users: { $elemMatch: { $eq: req.params.id } } },
        { users: { $elemMatch: { $eq: req.userId } } },
      ],
    });

    if (!chat) {
      const newChat = await Chat.create({
        users: [req.userId, req.params.id],
        messages: [newMessage._id],
      });
    } else {
      await chat.updateOne({
        $push: {
          messages: newMessage._id,
        },
      });
    }
    res.send("done");
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "some error" });
  }
};
module.exports = {
  sendMessage,
};
