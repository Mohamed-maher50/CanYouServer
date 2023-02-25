const mongoose = require("mongoose");
mongoose.connect(process.env.ATLSURL,(err) => {
  if (err)return console.log(err);
  console.log("connect success");
});
// fK31oBGl445hbuIM
