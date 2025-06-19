const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
 email: {
      type: String,
      required: [true, 'Email is required'],
      minLength: [5, 'Too small'],
      lowercase: true,
      trim: true
    },
  wheeler: {
    type: String,
    required: [true, 'Wheeler type is required'],
    enum: ['2-wheeler', '4-wheeler'] // Optional validation
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
price: {
    type: String,
    required: [true, 'price is required'],
    trim: true
  }
});

module.exports = mongoose.model('Owner', ownerSchema);
