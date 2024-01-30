const mongoose = require('mongoose');


const bidSchema = new mongoose.Schema({
  prod_id: {
    type: mongoose.Types.ObjectId,
    ref: 'Product', 
    required: true,
  },
  message_bid: [{
    type: mongoose.Types.ObjectId,
    ref: 'MessageBid', 
  }],
  winner: {
    type: mongoose.Types.ObjectId,
    ref: 'User', 
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'User', 
  },
  last_amount: {
    type: Number,
    required: true, 
    default:0
  },
  mode: {
    type: String, 
    default:"Manuel"
  },
  status: {
    type: String, 
  },
  type: {
    type: String, 
  },
  time: {
    type: String, 
  },
  date: {
    type: String, 
  },
  time_end: {
    type: String, 
  },
  date_end: {
    type: String, 
  },
  date_work_start: {
    type: String, 
  },
  date_work_end: {
    type: String, 
  },
  see_work:{
    type:String
  }
}, { timestamps: true });

const Bid = mongoose.model('Bid', bidSchema);

module.exports = Bid;
