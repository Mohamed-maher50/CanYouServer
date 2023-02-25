const mongoose = require("mongoose");
mongoose.connect(process.env.ATLSURL,  {
            usenewurlparser:true,
            usecreateindex:true,
            usefindmodify:true,
            useunifiedtropology:true,
            urlencoded:true
        } ,(err) => {
  if (err) console.log(err);
  console.log("connect success");
});
// fK31oBGl445hbuIM
