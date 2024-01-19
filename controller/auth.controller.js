const { generateToken } = require("../utils/jwt");
const User = require('../models/user');
const { forgotPasswordEmail, sendEmail, verifyYourAccount } = require("../utils/mailer");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
  
  const { email, password, username,type } = req.body;

  try {
    const emailExists = await User.findOne({ email });
    
    if (emailExists) {
      return res.status(400).json({ error: 'Email already exists.' });
    }

    const usernameExists = await User.findOne({ username });

    if (usernameExists) {
      return res.status(400).json({ error: 'Username already exists.' });
    }

    const newUser = new User({ email, password, username,type  });
    
    const rec = recoveryJWT(newUser);
    newUser.resetPasswordToken = rec;

    await newUser.save();
    
    const token = generateToken({ userId: newUser._id });
    await sendEmail(verifyYourAccount(newUser));
    return res.status(201).json({ user: newUser, accessToken:token });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

const login = async (req, res) => {

  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'email Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'pwd Invalid credentials' });
    }

    const token = generateToken({ userId: user._id });

    return res.status(200).json({ user, accessToken:token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

const recoveryJWT = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_RESET_ACCOUNT, {
    expiresIn: process.env.JWT_RESET_ACCOUNT_DURATION,
  });
};
function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}
const forgetAccount = async (req, res) => {
  try {

    let email = req.body.email

    if (!email) return res.status(401).json(`Email est manquant`);
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user)
      return res.status(401).json(`Aucun compte avec cet e-mail`);
      const random = generateRandomString(10)
      const saltRounds = 10;
      console.log(random);
      const hashedPassword = bcrypt.hashSync(random, saltRounds);
      user.password = hashedPassword;
        
      
    sendEmail(forgotPasswordEmail({user,password:random}));
    await user.save();
    return res.status(200).json({ data: user });

  } catch (err) {
    console.log(err);
    return res.status(401).json({ err })
  }
};

const resetAccount = async (req, res) => {
  try {
    let data = req.body

    if (!data.password && !data.token)
      return res.status(401).json(`Password is not correct !`);

    let user = await User.findOne({ resetPasswordToken: data.token });

    if (!user) return res.status(401).json("Token is not valid");

    const hash = await bcrypt.hash(data.password, 10);

    let oneUser = await User.findOneAndUpdate(
      { recovery_token: data.token },
      {
        password: hash,
        resetPasswordToken: null
      },
      {
        returnOriginal: false,
      }
    );

    return res.status(200).json({ data: oneUser });

  } catch (err) {
    console.log(err);
    return res.status(401).json({ err })
  }
};


module.exports = {
  register,
  login,
  forgetAccount,
  resetAccount
}