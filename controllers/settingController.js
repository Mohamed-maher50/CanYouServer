const User = require("../model/useSchema");
const theme = async (req, res) => {
  try {
    const user = await User.updateOne(req.userId, {
      theme: req.body.theme,
    });
    user.save();
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(404);
  }
};
const lang = async (req, res) => {
  try {
    const user = await User.updateOne(req.userId, {
      lang: req.body.lang,
    });
    user.save();
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(404);
  }
};
module.exports = {
  theme,
  lang,
};
