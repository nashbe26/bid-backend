const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const connectionTypes = ['local', 'facebook', 'google', 'apple'];

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  type: {
    type: String,
  },
  username: {
    type: String,
  },
  lastName: {
    type: String,
  },
  firstName: {
    type: String,
  },
  tokenEmail: {
    type: String,
  },
  googleAuth: {
    id: String,
    accessToken: String,
  },
 provider: {
    type: String,
    enum: connectionTypes, // Use the predefined connection types
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  bids_created: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Bid', 
    },
  ],
  fav_bid: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Bid', 
    },
  ],
  bids_won: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Bid', 
    },
  ],
  notifications: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Notification', 
    },
  ],
  emailVerificationToken: String,
  resetPasswordToken: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
  
    const saltRounds = 10;
    try {
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      user.password = hashedPassword;
      return next();
    } catch (error) {
      return next(error);
    }
  });

const User = mongoose.model('User', userSchema);

module.exports = User;
