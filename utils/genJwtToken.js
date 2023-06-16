const jwt = require("jsonwebtoken");
const genJwtToken = (data) => {
  try {
    return jwt.sign(data, process.env.SECRET_KEY_JWT);
  } catch (error) {
    return error;
  }
};

module.exports = genJwtToken;
