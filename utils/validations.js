const { default: mongoose } = require("mongoose");

mongoose;
const isId = (id) => {
  let check = mongoose.isValidObjectId(id);
  return check;
};
module.exports = {
  isId,
};
