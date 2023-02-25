const mongoose = require("mongoose");
mongoose.connect(process.env.ATLSURL,{ useNewUrlParser: true } ,(err) => {
  if (err) console.log(err);
  console.log("connect success");
});
// fK31oBGl445hbuIM
