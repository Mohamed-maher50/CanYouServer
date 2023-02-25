const mongoose = require("mongoose");
mongoose.connect(process.env.DB_CONNECTION_URL, (err) => {
  if (err) console.log(err);
  console.log("connect success");
});
