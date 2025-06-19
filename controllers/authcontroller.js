const { doHash, hmacProcess, doHashValidation } = require('../utils/hashing');
const User = require('../models/usersModel');
const { signupSchema } = require('../middlewares/validater');
const crypto = require('crypto');
const transport = require('../middlewares/sendMail');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const { email, password } = req.body;

  const { error } = signupSchema.validate({ email, password });
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  try {
    const existing = await User.findOne({ email });

    if (existing && existing.verified) {
      return res.status(409).json({ success: false, message: 'User already exists and verified' });
    } else if (existing) {
      return res.status(409).json({ success: false, message: 'User already exists but not verified' });
    }

    const hashed = await doHash(password, 12);
    const newUser = new User({ email, password: hashed });
    await newUser.save();

    res.status(201).json({ success: true, message: 'Now verify yourself' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.sendVerification = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (existingUser.verified) {
      return res.status(400).json({ success: false, message: 'User already verified' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    const info = await transport.sendMail({
      from: process.env.NODE_CODE_SENDING_EMAIL,
      to: existingUser.email,
      subject: 'Verification Code',
      html: `
        <div style="font-family:sans-serif;">
          <h2>Your Verification Code</h2>
          <p>Use this OTP to verify your account:</p>
          <h3>${otp}</h3>
          <p>This OTP is valid for 5 minutes only.</p>
        </div>
      `
    });

    if (info.accepted[0] === existingUser.email) {
      const hashedOtp = hmacProcess(otp, process.env.HMAC_VERIFICATION_CODE_SECRET);
      existingUser.verificationCode = hashedOtp;
      existingUser.verificationCodeValidation = Date.now();
      await existingUser.save();
      res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error sending OTP' });
  }
};

exports.otpVerfication = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const existingUser = await User.findOne({ email }).select('+verificationCode +verificationCodeValidation');

    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'Email does not exist' });
    }

    if (existingUser.verified) {
      return res.status(400).json({ success: false, message: 'Email already verified' });
    }

    const hashedOtp = hmacProcess(otp.toString(), process.env.HMAC_VERIFICATION_CODE_SECRET);

    if (existingUser.verificationCode !== hashedOtp) {
      return res.status(400).json({ success: false, message: 'OTP does not match' });
    }

    const currentTime = Date.now();
    if (currentTime - existingUser.verificationCodeValidation > 5 * 60 * 1000) {
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }

    existingUser.verified = true;
    await existingUser.save();
    return res.status(201).json({ success: true, message: 'Verification successful, now login' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  const { error } = signupSchema.validate({ email, password });

  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  try {
    const existingUser = await User.findOne({ email }).select('+password');

    if (!existingUser) {
      return res.status(400).json({ success: false, message: 'Account not found. Please sign up.' });
    }

    if (!existingUser.verified) {
      return res.status(403).json({ success: false, message: 'Email not verified' });
    }

    const isPasswordCorrect = await doHashValidation(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    const token = jwt.sign({
      userId: existingUser._id,
      email: existingUser.email
    }, process.env.TOKEN_SECRET, { expiresIn: '2h' });

    return res.cookie('Authorization', 'Bearer ' + token, {
      expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    }).json({
      success: true,
      token,
      message: 'Logged in successfully'
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    return res.status(200).json({
      success: true,
      user: {
        email: user.email,
        userId: user.userId
      }
    });
  } catch (err) {
    console.error("Error verifying token:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.signout = async (req, res) => {
  res.clearCookie('Authorization');
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
};
