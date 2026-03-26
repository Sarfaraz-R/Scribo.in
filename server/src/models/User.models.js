import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  approvalStatus,
  approvalStatusEnum,
  userRoles,
  userRolesEnum,
} from '../constants/constants.js';

const { Schema, model, Types } = mongoose;

const userSchema = new Schema(
  {
    institutionId: {
      type: Types.ObjectId,
      ref: 'Institution',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: userRolesEnum, default: userRoles.student },
    status: {
      type: String,
      enum: [
        ...approvalStatusEnum,
        'ACTIVE',
        'PENDING',
        'SUSPENDED',
        'DELETED',
      ],
      default: approvalStatus.pending,
      index: true,
    },
    emailVerified: { type: Boolean, default: false, index: true },
    rollNumber: { type: String, trim: true, default: null },
    employeeId: { type: String, trim: true, default: null },
    emailVerificationToken: { type: String, default: null, select: false },
    emailVerificationExpiresAt: { type: Date, default: null, select: false },
    branchId: {
      type: Types.ObjectId,
      ref: 'Branch',
      default: null,
      index: true,
    },
    batchId: { type: Types.ObjectId, ref: 'Batch', default: null, index: true },
    sectionId: {
      type: Types.ObjectId,
      ref: 'Section',
      default: null,
      index: true,
    },
    subjects: [{ type: Types.ObjectId, ref: 'Subject' }],
    phone: String,
    refreshToken: { type: String, select: false },
    previousRefreshToken: { type: String, default: null, select: false },
    refreshTokenRotatedAt: { type: Date, default: null, select: false },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
  },
  { timestamps: true }
);

userSchema.index({ institutionId: 1, email: 1 }, { unique: true });

userSchema.index(
  { institutionId: 1, rollNumber: 1 },
  { unique: true, partialFilterExpression: { rollNumber: { $type: 'string' } } }
);

userSchema.index(
  { institutionId: 1, employeeId: 1 },
  { unique: true, partialFilterExpression: { employeeId: { $type: 'string' } } }
);


userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id, role: this.role },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

userSchema
  .virtual('isEmailVerified')
  .get(function getIsEmailVerified() {
    return this.emailVerified;
  })
  .set(function setIsEmailVerified(value) {
    this.emailVerified = value;
  });

export default model('User', userSchema);
