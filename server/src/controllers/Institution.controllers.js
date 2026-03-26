import mongoose from 'mongoose';
import asyncHandler from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { InstitutionModel } from '../models/Institution.models.js';
import UserModel from '../models/User.models.js';
import { OTPModel } from '../models/OTP.models.js';
import { generateSlug } from '../utils/Helper.js';
import { generateOTP, sendSuperAdminMail } from '../utils/Email.js';
import { userRoles, status } from '../constants/constants.js';

const registerInstitution = asyncHandler(async (req, res) => {
  const { name, domain, plan, adminName, adminEmail, password, phone } =
    req.body;

  // 1. Validate required fields
  const requiredFields = { name, plan, adminName, adminEmail, password };
  const missingField = Object.entries(requiredFields).find(
    ([, val]) => !val || val.trim() === ''
  );
  if (missingField) {
    throw new ApiError(400, `Field '${missingField[0]}' is required`);
  }

  // 2. Pre-check for conflicts BEFORE doing anything else
  const slug = generateSlug(name);

  const orConditions = [{ slug }];
  if (domain && domain.trim() !== '') {
    orConditions.push({ domain: domain.toLowerCase().trim() });
  }

  const existingInst = await InstitutionModel.findOne({ $or: orConditions });
  if (existingInst) {
    throw new ApiError(409, 'Institution or domain already exists');
  }

  const existingAdmin = await UserModel.findOne({
    email: adminEmail.toLowerCase().trim(),
  });
  if (existingAdmin) {
    throw new ApiError(409, 'Email already registered');
  }

  // 3. Generate OTP and store ALL registration data in the OTP record
  //    Nothing is written to Institution or User collections yet.
  const otp = await generateOTP();

  await OTPModel.findOneAndDelete({
    email: adminEmail.toLowerCase().trim(),
    purpose: 'institution-registration',
  });

  await OTPModel.create({
    email: adminEmail.toLowerCase().trim(),
    otp,
    purpose: 'institution-registration',
    // Store the full payload so we can create records after verification
    metadata: {
      name: name.trim(),
      slug,
      domain: domain ? domain.toLowerCase().trim() : '',
      plan,
      adminName: adminName.trim(),
      password, // will be hashed by the User model pre-save hook on creation
      phone: phone ? phone.trim() : null,
      lastLoginIP:
        req.ip ||
        req.headers['x-forwarded-for'] ||
        req.socket?.remoteAddress ||
        null,
    },
  });

  // 4. Send the OTP email — no DB records created yet
  await sendSuperAdminMail(adminEmail.toLowerCase().trim(), otp);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { email: adminEmail },
        'Verification code sent to email'
      )
    );
});

/**
 * @description Verifies OTP and activates institution + admin
 */
const verifyInstitutionRegistration = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new ApiError(400, 'Email and OTP are required');
  }

  // 1. Find the pending OTP record that holds all registration data
  const otpRecord = await OTPModel.findOne({
    email: email.toLowerCase().trim(),
    otp,
    purpose: 'institution-registration',
  });

  if (!otpRecord) {
    throw new ApiError(400, 'Invalid or expired OTP');
  }

  const { name, slug, domain, plan, adminName, password, phone, lastLoginIP } =
    otpRecord.metadata;

  // 2. Re-check for conflicts (edge case: someone registered same name during OTP window)
  const orConditions = [{ slug }];
  if (domain && domain !== '') orConditions.push({ domain });

  const existingInst = await InstitutionModel.findOne({ $or: orConditions });
  if (existingInst) {
    await OTPModel.deleteOne({ _id: otpRecord._id });
    throw new ApiError(409, 'Institution or domain already registered');
  }

  // 3. OTP is valid — now create institution and admin inside a transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [institution] = await InstitutionModel.create(
      [
        {
          name,
          slug,
          domain,
          subscription: {
            plan,
            status: status.active, // active immediately since email is now verified
            expiresAt:
              plan === 'trial'
                ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
                : null,
          },
        },
      ],
      { session }
    );

    const [newAdmin] = await UserModel.create(
      [
        {
          institutionId: institution._id,
          name: adminName,
          email: email.toLowerCase().trim(),
          password, // hashed by pre-save hook
          phone,
          role: userRoles.admin,
          status: status.active, // active immediately
          isEmailVerified: true, // verified right now
          lastLoginAt: new Date(),
          lastLoginIP,
          loginAttempts: 0,
        },
      ],
      { session }
    );

    institution.superAdmin = newAdmin._id;
    await institution.save({ session });

    // 4. Clean up the OTP record
    await OTPModel.deleteOne({ _id: otpRecord._id }, { session });

    await session.commitTransaction();
    session.endSession();

    return res
      .status(201)
      .json(new ApiResponse(201, null, 'Account activated successfully'));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    if (error instanceof ApiError) throw error;
    console.error('[verifyInstitutionRegistration] Transaction failed:', error);
    throw new ApiError(500, error.message || 'Activation failed');
  }
});

/**
 * @description Fetches all active institutions for frontend dropdowns
 * @route GET /api/auth/institutions
 */
const getAllInstitutions = asyncHandler(async (req, res) => {
  // console.log(InstitutionModel)
  const institutions = await InstitutionModel.find({
    'subscription.status': 'ACTIVE',
  })
    .select('name slug _id')
    .lean();
  // console.log('Fetched institutions:', institutions);
  if (!institutions.length) {
    return res
      .status(404)
      .json(new ApiResponse(404, [], 'No institutions found'));
  }

  // console.log('Fetched institutions:', institutions);

  return res
    .status(200)
    .json(
      new ApiResponse(200, institutions, 'Institutions fetched successfully')
    );
});

export {
  registerInstitution,
  verifyInstitutionRegistration,
  getAllInstitutions,
};
