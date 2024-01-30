const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const dotenv = require('dotenv');

dotenv.config();

const template = (fileName, data) => {
    const content = fs.readFileSync("./views/" + fileName).toString();
    const inject = handlebars.compile(content);
    return inject(data);
  };

emailClient = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "iammanechiam254qsd@gmail.com",
    pass: "ffwjshuromwkhkzp",
  },
});

function verifyYourAccount(data) {

  return {
    from: process.env.EMAIL_NODEMAILER,
    to: `${data.email}`,
    subject: `verify Your Account`,
    // text: template('verify-account.txt', { name, email, token, url: process.env.FRONT_URL }),
    html: template("verify-account.html", {
      firstName: data.username,
      token:data.resetPasswordToken,
      url: process.env.FRONT_URL,
    }),
  };
}

function verifyYourAccountToken(data) {

    return {
      from: process.env.EMAIL_NODEMAILER,
      to: `${data.email}`,
      subject: `Your Token Account`,
      // text: template('verify-account.txt', { name, email, token, url: process.env.FRONT_URL }),
      html: template("token-account.html", {
        firstName: data.username,
        token:data.token,
        url: process.env.FRONT_URL,
      }),
    };
  }

function sendEmailToUser({ data}) {

  return {
    from: process.env.EMAIL_NODEMAILER,
    to: `${data.email}`,
    subject:data.object,
    // text: template('verify-account.txt', { name, email, token, url: process.env.FRONT_URL }),
    html: template("model-email.html", {
      text: data.content,
    }),
  };
}
function multipleMails({ data}) {
  console.log(data);
  const emailAddresses = data.usersId;
  console.log(emailAddresses);
  
  return {
    from: process.env.EMAIL_NODEMAILER,
    to: emailAddresses.join(', '),
    subject: data.object,
    html: data.content,
  };
}

function sendEmail(data) {
  if (!emailClient) {
    return;
  }
  return new Promise((resolve, reject) => {
    emailClient
      ? emailClient.sendMail(data, (err, info) => {
          if (err) {
            reject(err);
          } else {
            resolve(info);
          }
        })
      : "";
  });
}

function forgotPasswordEmail(data) {
  console.log(data);
  return {
    from: process.env.EMAIL_NODEMAILER,
    to: data.user.email,
    subject: `Your verify email password`,
    html: template("forgot-password.html", {
      name: data.user.firstName,
      email: data.user.email,
      tempPass: data.password,
      url: process.env.FRONT_URL,
    }),
  };
}
module.exports = {
  verifyYourAccount,
  forgotPasswordEmail,
  sendEmail,
  emailClient,
  sendEmailToUser,
  multipleMails,
  verifyYourAccountToken
};
