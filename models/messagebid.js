const mongoose = require('mongoose');

const messageBidSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  bid_amount: {
    type: String,
  },
}, { timestamps: true });

const MessageBid = mongoose.model('MessageBid', messageBidSchema);

module.exports = MessageBid;
