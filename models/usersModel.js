const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      minLength: [5, 'Too small'],
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [5, 'Too small'],
      trim: true,
      select: false
    },
    verified: {
      type: Boolean,
      default: false
    },
    verificationCode: {
      type: String,
      select: false
    },
    verificationCodeValidation: {
      type: Number,
      select: false
    },
    forgotPasswordCode: {
      type: String,
      select: false
    },
    forgotPasswordCodeValidation: {
      type: Number,
      select: false
    }
  },
  {
    timestamps: true // ✅ Correct placement
  }
);

module.exports = mongoose.model('user', userSchema);
