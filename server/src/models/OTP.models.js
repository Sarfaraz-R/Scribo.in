import mongoose, { Schema } from 'mongoose';

const OTPSchema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    enum: ['verification', 'password_reset','institution-registration'],
    default: 'verification',
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
});

export const OTPModel = mongoose.model('OTP', OTPSchema);
