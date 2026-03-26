export const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // If protect middleware didn't attach user
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Normalize role (in case of lowercase in DB)
    const userRole = req.user.role?.toUpperCase();

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message:
          'Forbidden: You do not have permission to access this resource',
      });
    }

    next();
  };
};
