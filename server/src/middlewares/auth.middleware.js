import asyncHandler from '../utils/AsyncHandler.js';
import User from '../models/User.models.js'
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header('Authorization')?.replace('Bearer ', '');
  // console.log(token);
  if (!token) throw new ApiError(401, 'Access token missing');

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired token');
  }

  const user = await User.findById(decodedToken?._id).select(
    '-password -refreshToken'
  );

  if (!user) throw new ApiError(401, 'User doest not exist');

  req.user = Object.freeze(user);

  next();
});
