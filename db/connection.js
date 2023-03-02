const mongoose = require("mongoose");
<<<<<<< HEAD
mongoose.connect(
  process.env.DB_CONNECTION_URL,
  { useNewUrlParser: true },
  (err) => {
    if (err) return console.log(err);
    console.log("connect success");
  }
);
=======
mongoose.connect(process.env.ATLSURL,(err) => {
  if (err)return console.log(err);
  console.log("connect success");
});
>>>>>>> f6e49321522ccb605fe0d64427834c841bcbe645
// fK31oBGl445hbuIM
