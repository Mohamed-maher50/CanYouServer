const mongoose = require("mongoose");
mongoose.connect(
  process.env.DB_CONNECTION_URL,
  { useNewUrlParser: true },
  (err) => {
    if (err) return console.log(err);
    console.log("connect success");
  }
);
// fK31oBGl445hbuIM
