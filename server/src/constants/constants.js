export const userRoles = {
  admin: 'ADMIN',
  student: 'STUDENT',
  faculty: 'FACULTY',
};

export const userRolesEnum = Object.values(userRoles);

export const status = {
  pending: 'PENDING',
  active: 'ACTIVE',
  suspended: 'SUSPENDED',
  deleted: 'DELETED',
};

export const statusEnum = Object.values(status);

export const approvalStatus = {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
};

export const approvalStatusEnum = Object.values(approvalStatus);
