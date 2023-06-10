const Token = require("../model/verifyToken");
const crypto = require("crypto");
const genToken = async (id) => {
  return await new Token({
    userId: id,
    token: crypto.randomBytes(32).toString("hex"),
  }).save();
};
module.exports = {
  genToken,
};
