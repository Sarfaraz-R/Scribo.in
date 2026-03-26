import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import asyncHandler from '../utils/AsyncHandler.js';
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(404, 'Unauthorized');

  res
    .status(200)
    .json(
      new ApiResponse(200, { user: user }, 'User data fetched successfully')
    );
});

export { getCurrentUser };
