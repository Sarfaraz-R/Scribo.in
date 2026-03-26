// server/src/controllers/Auth.controllers.js
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import asyncHandler from '../utils/AsyncHandler.js';
import {
  sendLoginOTPMail,
  sendVerificationMail,
  generateOTP,
} from '../utils/Email.js';
import User from '../models/User.models.js';
import { OTPModel } from '../models/OTP.models.js';
import { InstitutionModel } from '../models/Institution.models.js';
import { status } from '../constants/constants.js';

// ─── Cookie config ────────────────────────────────────────────────────────────
// ONE shared config used everywhere — previously had two undefined variables
// (accessTokenCookieOptions / refreshTokenCookieOptions) that caused crashes
const REFRESH_COOKIE_OPTIONS = {
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  httpOnly: true, // not accessible via JS — XSS safe
  secure: process.env.NODE_ENV === 'production', // https only in prod
  sameSite: 'strict',
  path: '/',
};

const REFRESH_REUSE_GRACE_MS = 30 * 1000;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Issues a fresh access+refresh token pair, persists the refresh token,
 * and sets the httpOnly cookie.
 *
 * BUG FIX: previously referenced undefined `accessTokenCookieOptions` and
 * `refreshTokenCookieOptions`.  Also the old cookie name was inconsistent
 * between this function (set as `refreshToken`) and everywhere else (`__s_rt`).
 */
const issueTokens = async (user, res) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Keep one previous token briefly to tolerate multi-tab refresh races.
  user.previousRefreshToken = user.refreshToken || null;

  // Persist refresh token for rotation/reuse detection.
  user.refreshToken = refreshToken;
  user.refreshTokenRotatedAt = new Date();
  await user.save({ validateBeforeSave: false });

  // Set httpOnly cookie — name is `__s_rt` everywhere (was inconsistent before)
  res.cookie('__s_rt', refreshToken, REFRESH_COOKIE_OPTIONS);

  return { accessToken, refreshToken };
};

const prepareOTP = async (email, type = 'login') => {
  const otp = await generateOTP();

  await OTPModel.findOneAndUpdate(
    { email: email.toLowerCase(), purpose: 'verification' },
    { otp, purpose: 'verification' },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  try {
    if (type === 'login') await sendLoginOTPMail(email, otp);
    else await sendVerificationMail(email, otp);
  } catch (mailErr) {
    console.error('Failed to send OTP email:', mailErr);
  }

  return otp;
};

const normalizeApprovalStatus = (value) => {
  if (!value) return 'pending';
  const s = String(value).toLowerCase();
  if (s === 'active') return 'approved';
  if (s === 'pending' || s === 'approved' || s === 'rejected') return s;
  return 'pending';
};

const toSafeUser = (user) => {
  const safeUser = user.toObject();
  delete safeUser.password;
  delete safeUser.refreshToken;
  delete safeUser.emailVerificationToken;
  delete safeUser.emailVerificationExpiresAt;
  safeUser.status = normalizeApprovalStatus(safeUser.status);
  safeUser.emailVerified = Boolean(safeUser.emailVerified);
  return safeUser;
};

// ─── Controllers ──────────────────────────────────────────────────────────────

export const signin = asyncHandler(async (req, res) => {
  const { email, password, role, institution } = req.body;

  if (!email || !password)
    throw new ApiError(400, 'Email and password are required');

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    '+password +loginAttempts +lockUntil'
  );

  if (!user) throw new ApiError(404, 'User does not exist');

  // Brute-force protection
  if (user.lockUntil && user.lockUntil > Date.now()) {
    throw new ApiError(
      423,
      `Account locked. Try again after ${new Date(user.lockUntil).toLocaleTimeString()}`
    );
  }

  // Multi-tenant guard (skip for admin)
  if (role?.toUpperCase() !== 'ADMIN' && institution) {
    const inst = await InstitutionModel.findById(user.institutionId);
    if (inst?.name !== institution) {
      throw new ApiError(403, 'Unauthorized institution access');
    }
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    user.loginAttempts += 1;
    if (user.loginAttempts >= 5) {
      user.lockUntil = Date.now() + 30 * 60 * 1000;
    }
    await user.save({ validateBeforeSave: false });
    throw new ApiError(401, 'Invalid user credentials');
  }

  // Reset brute-force counters
  user.loginAttempts = 0;
  user.lockUntil = undefined;
  user.lastLoginIP = req.ip;
  await user.save({ validateBeforeSave: false });

  if (!user.emailVerified) {
    throw new ApiError(
      403,
      'Email not verified. Please verify your email before logging in.'
    );
  }

  const otp = await prepareOTP(user.email, 'login');

  const payload = { email: user.email };
  if (process.env.NODE_ENV !== 'production') payload.otp = otp;

  return res.status(200).json(new ApiResponse(200, payload, 'OTP sent'));
});

export const register = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    role,
    institutionId,
    institutionCode,
    rollNumber,
    employeeId,
  } = req.body;

  if (
    [name, email, password, role].some((f) => !f || String(f).trim() === '')
  ) {
    throw new ApiError(400, 'All required fields must be provided');
  }

  if (!institutionId && !institutionCode) {
    throw new ApiError(400, 'institutionId or institutionCode is required');
  }

  const normalizedRole = String(role).toUpperCase();
  if (normalizedRole === 'STUDENT' && !rollNumber) {
    throw new ApiError(400, 'rollNumber is required for student registration');
  }
  if (normalizedRole === 'FACULTY' && !employeeId) {
    throw new ApiError(400, 'employeeId is required for faculty registration');
  }

  const inst = institutionId
    ? await InstitutionModel.findById(institutionId)
    : await InstitutionModel.findOne({ code: institutionCode });

  if (!inst || inst.subscription.status !== status.active) {
    throw new ApiError(404, 'Institution inactive or not found');
  }

  if (inst.domain && !email.toLowerCase().endsWith(inst.domain.toLowerCase())) {
    throw new ApiError(403, `Registration requires @${inst.domain} email`);
  }

  const existingUser = await User.findOne({
    email: email.toLowerCase(),
    institutionId: inst._id,
  });
  if (existingUser)
    throw new ApiError(409, 'User already exists at this institution');

  const isStudent = normalizedRole === 'STUDENT';

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    phone,
    role: normalizedRole,
    institutionId: inst._id,
    status: 'pending',
    emailVerified: false,
    rollNumber: isStudent ? rollNumber : null,
    employeeId: isStudent ? null : employeeId,
    lastLoginIP: req.ip,
  });

  const otp = await prepareOTP(user.email, 'register');

  const createdUser = toSafeUser(user);

  const responseData = { user: createdUser };
  if (process.env.NODE_ENV !== 'production') {
    responseData.otp = otp;
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        responseData,
        'Registration successful. OTP sent to your email. Verify OTP to continue. Account will remain pending until admin approval.'
      )
    );
});

export const verifyUser = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const validOTP = await OTPModel.findOneAndDelete({
    email: email.toLowerCase(),
    otp,
    purpose: 'verification',
  });

  if (!validOTP) throw new ApiError(400, 'Invalid or expired OTP');

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new ApiError(404, 'User not found');

  // Mark user email verified, but keep approval status pending.
  if (!user.emailVerified) {
    user.emailVerified = true;
  }
  user.status = normalizeApprovalStatus(user.status);
  user.lastLoginAt = new Date();

  // Issue tokens (also saves refreshToken to user doc + sets cookie)
  const { accessToken } = await issueTokens(user, res);

  const safeUser = toSafeUser(user);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: safeUser, accessToken },
        'Verification successful'
      )
    );
});

export const verifyEmailByToken = asyncHandler(async (req, res) => {
  const { token } = req.params;
  if (!token) throw new ApiError(400, 'Verification token is required');

  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpiresAt: { $gt: new Date() },
  }).select('+emailVerificationToken +emailVerificationExpiresAt');

  if (!user) {
    throw new ApiError(400, 'Invalid or expired verification token');
  }

  user.emailVerified = true;
  user.status = normalizeApprovalStatus(user.status);
  user.emailVerificationToken = null;
  user.emailVerificationExpiresAt = null;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: toSafeUser(user) },
        'Email verified successfully. Awaiting admin approval.'
      )
    );
});


export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies.__s_rt; // ✅ correct cookie name
  // console.log("incomingToken ---------------->  "+incomingToken);
  // console.log("Req cme with cookies : "+req.cookies);
  if (!incomingToken) throw new ApiError(401,'Unauthorized');

  let decoded;
  try {
    decoded = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const user = await User.findById(decoded._id).select(
    '+refreshToken +previousRefreshToken +refreshTokenRotatedAt'
  );
  if (!user) throw new ApiError(404, 'User not found');

  const matchesCurrent = user.refreshToken === incomingToken;
  const matchesPrevious = user.previousRefreshToken === incomingToken;
  const rotatedAt = user.refreshTokenRotatedAt
    ? new Date(user.refreshTokenRotatedAt).getTime()
    : 0;
  const withinGrace = Date.now() - rotatedAt <= REFRESH_REUSE_GRACE_MS;

  // If token is stale and outside grace, treat as reuse attempt.
  if (!matchesCurrent && !(matchesPrevious && withinGrace)) {
    throw new ApiError(401, 'Token reuse detected. Please log in again.');
  }

  // Issue new token pair (rotation)
  const { accessToken } = await issueTokens(user, res);

  const safeUser = toSafeUser(user);

  return res
    .status(200)
    .json(
      new ApiResponse(200, { user: safeUser, accessToken }, 'Token refreshed')
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.__s_rt;

  if (incomingRefreshToken) {
    try {
      const decoded = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await User.findByIdAndUpdate(decoded._id, {
        $unset: {
          refreshToken: 1,
          previousRefreshToken: 1,
          refreshTokenRotatedAt: 1,
        },
      });
    } catch {
      // Token may be expired — still clear the cookie
    }
  }

  return res
    .status(200)
    .clearCookie('__s_rt', { ...REFRESH_COOKIE_OPTIONS, maxAge: 0 })
    .json(new ApiResponse(200, {}, 'Logged out successfully'));
});
