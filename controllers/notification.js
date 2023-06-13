const Notification = require("../model/notifications");
const newNotification = async (data) => {
  return await Notification.create({
    ...data,
  });
};
const getNotification = async (req, res) => {
  try {
    console.log(req.userId);
    const allNotifications = await Notification.find({
      to: req.userId,
    }).populate("from", "fullName AvatarUrl email");
    console.log(allNotifications);
    res.status(200).json(allNotifications);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "error can't  get notification sorry" });
  }
};
module.exports = { newNotification, getNotification };
