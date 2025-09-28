// Role-based access control utilities

export const ROLES = {
  USER: 'user',
  RECRUITER: 'recruiter'
};

export const hasAccess = (userRole, requiredRole) => {
  if (!userRole || !requiredRole) return false;
  return userRole === requiredRole;
};

export const canAccessUserFeatures = (userRole) => {
  return userRole === ROLES.USER;
};

export const canAccessRecruiterFeatures = (userRole) => {
  return userRole === ROLES.RECRUITER;
};

export const getDefaultDashboard = (userRole) => {
  switch (userRole) {
    case ROLES.USER:
      return '/user-dashboard';
    case ROLES.RECRUITER:
      return '/recruiter-dashboard';
    default:
      return '/auth';
  }
};

export const validateUserSession = (user) => {
  if (!user) return false;
  if (!user.role || !Object.values(ROLES).includes(user.role)) return false;
  if (!user.id || !user.email) return false;
  return true;
};