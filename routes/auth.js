const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');
const passport = require('passport');


router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgetAccount);
router.post('/reset-password', authController.resetAccount);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));



router.get('/google/callback', passport.authenticate("google"), async (req, res) => {
  console.log(req.user,"await User.findAndGenerateToken(req.body)");
  //const {user,accessToken} = await User.findAndGenerateToken(req.body);
  res.redirect('http://localhost:3005/social-verif/'+req.user.googleAuth.accessToken)
});

module.exports = router;