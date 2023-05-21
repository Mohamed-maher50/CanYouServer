const mongoose = require("mongoose");
mongoose.connect(
  process.env.ATLSURL,
  { useNewUrlParser: true },
  (err) => {
    if (err) return console.log(err);
    console.log("connect success");
  }
);
