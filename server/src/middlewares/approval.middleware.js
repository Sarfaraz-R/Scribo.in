import { ApiError } from '../utils/ApiError.js';

const normalizeStatus = (status) => String(status || '').toLowerCase();

export const isApprovedStatus = (status) => {
  const normalized = normalizeStatus(status);
  return normalized === 'approved' || normalized === 'active';
};

export const ensureApproved = (req, _res, next) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  if (!isApprovedStatus(req.user.status)) {
    throw new ApiError(
      403,
      'Your account is not approved yet. Please wait for admin approval.'
    );
  }

  next();
};
