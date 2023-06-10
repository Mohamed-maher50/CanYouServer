const nodemailer = require("nodemailer")
const {Email , Password} = process.env

exports. _Sendmail = async(option)=>{
    
    const transporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:465,
        secure:true,
        auth:{
            user:Email,
            pass : Password
        }
    })

    const mailOptions  = {
        from : Email,
        to : option.email,
        subject : option.subject,
        text : option.message
    }

    await transporter.sendMail(mailOptions)
}

