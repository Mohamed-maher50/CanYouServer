const bcryptjs = require("bcryptjs");

const hastPassword = async (password) => {
  const salt = await bcryptjs.genSalt();
  const hastedPassword = await bcryptjs.hash(password, salt);
  return hastedPassword;
};


const verifyPassword = async (password, { req }) => {
  const checkResult = await bcryptjs.compare(password, req.body.hashPassword);

  if (!checkResult) return Promise.reject("password not correct");
  return true;
};
module.exports = {
  hastPassword,
  verifyPassword,
};
