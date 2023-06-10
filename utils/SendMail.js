const nodemailer = require("nodemailer");

const sendMail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "mohamedmaher.mm330@gmail.com",
        pass: "pomaysxutbgrwgow",
      },
    });


    await transporter.sendMail({
      from: "mohamedmaher.mm330@gmail.com",
      to: email,
      subject,
      text,
    });
    
    console.log("email send successfully");
  } catch (error) {
    console.log(error);
  }
};
const htmlTemplate = `


`;

const genURL = (id, token) =>
  `http://localhost:3000/users/${id}/verify/${token}`;
module.exports = {
  sendMail,
  htmlTemplate,
  URL,
  genURL,
};
