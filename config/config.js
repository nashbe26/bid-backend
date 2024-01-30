const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/user'); // Your User model
const dotenv = require('dotenv')
const moment = require('moment');

const jwt = require('jsonwebtoken');
dotenv.config();

GOOGLE_CLIENT_ID = "346052481883-n9ai8vbebqd0p3evb2l5p2tnsmol4qn6.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET = "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"


const options = {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3005/api/v1/auth/google/callback',
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/userinfo.profile'],
    state: true
};

const googleStrategy = new GoogleStrategy(options, async (accessToken, refreshToken, profile, cb) => {

    let user = await User.findOne({ "googleAuth.id": profile.id });
    if (!user) {
        let userna = profile.displayName.split(' ')
        
        user = new User({
            googleAuth: { id: profile.id },
            provider: "google",
            firstName: userna[0],
            lastName: userna[1],
            photo:profile.photos[0].value,
            username: profile.displayName,
            email: profile.emails[0].value,

        });

        await user.save();

    }
    const playload = {
        exp: moment().add(process.env.JWT_EXPIRATION_MINUTES, 'minutes').unix(),
        iat: moment().unix(),
        userId: user._id
    };

    const access = await jwt.sign(playload, process.env.JWT_SECRET);
    user.googleAuth.accessToken = access;

    await user.save()
    
    return cb(null, user);
});

passport.serializeUser((user, done) => {
    return done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id).catch((err) => {
        return done(err, null);
    });

    if (user) done(null, user);
});

module.exports = {
    googleStrategy
}