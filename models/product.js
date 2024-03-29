const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  images: [{
    type: String, 
    required: true,
  }],
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
