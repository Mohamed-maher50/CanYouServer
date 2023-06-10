const { validationResult } = require("express-validator/src/validation-result");
const User = require("../model/useSchema");
const Token = require("../model/verifyToken");
const jwt = require("jsonwebtoken");
const crypto = require("crypto")
const {_Sendmail}  = require("../utils/_Sendmail")
const { sendMail, genURL } = require("../utils/SendMail");
const { genToken } = require("../utils/genToken");
const { hastPassword } = require("../utils/hashPassword");
const bcrypt = require("bcryptjs")


// 2) Edite 
const Register = async (req, res) => {

  const SixDigits = Math.floor((Math.random()*1000000)+1).toString()
  
  const hashedResetCode = crypto.createHash('sha256').update(SixDigits).digest("hex")

  try {  

    const data = await User.create({
       ...req.body, 
      
      passwordResetCode     : hashedResetCode,
      passwordResetExpire   : Date.now() + 10 * 60 * 1000,
      passwordResetverified : false
    })


    const message = `Hi ${data.fullName} , \n we received a request to reset code to  register new account . \n ${SixDigits} \n Enter this code to complete the register. \n `
    await _Sendmail({email:data.email , subject:"Your reset code, Valid for a 10m" ,message , })


    const userToken = await jwt.sign({id :data?._id}, process.env.SECRET_KEY_JWT);

    res.status(201).json({
      user: data,
      token: userToken,
    });


  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const VerifieResetCode = async(req , res , next )=>{

  try{
    const passwordResetCode = crypto.createHash("sha256").update(req.body.resetCode).digest("hex")
    const user = await User.findOne({passwordResetCode , passwordResetExpire:{$gt : Date.now()} })
    
    if(!user) next(new Error("ResetCode Invalid or Expired"))
  
  
    user.passwordResetverified = true
    await user.save()
    res.status(200).json({status:"success"})

  }catch(err){ res.status(404).json({status:"fail"})}
}




const Login = async (req, res , next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) return res.status(400).json(error);
  try {

    if (!req.body.user) return res.status(401).json({ error: "ldkf" });

    var { email, AvatarUrl, fullName, id, _id, firstVisit, city } =
    req.body.user;
    const token = await jwt.sign(id, process.env.SECRET_KEY_JWT);

    return res.status(201).json({
      user: {
        email,
        AvatarUrl,
        fullName,
        _id,
        city,
        firstVisit,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};




const verifyEmail = async (req, res) => {
  const { id, token } = req.params;
  try {
    const data = await Token.findOne({ userId: id, token });
    if (!data) return res.status(400).json({ msg: "this not valid link" });
    await data.deleteOne();
    const user = await User.findByIdAndUpdate(id, {
      isVerified: true,
    });

    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ msg: "some error" });
  }
};
module.exports = {
  Register,
  Login,
  verifyEmail,
  VerifieResetCode
};
