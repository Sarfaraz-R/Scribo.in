import asyncHandler from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
const healthCheck = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, { message: 'Server is Running' }));
});

export default healthCheck;
