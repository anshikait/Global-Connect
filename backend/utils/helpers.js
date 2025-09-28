// Response helper functions
export const sendSuccessResponse = (res, statusCode = 200, message, data = null) => {
  const response = {
    success: true,
    message
  };

  if (data) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

export const sendErrorResponse = (res, statusCode = 500, message, error = null) => {
  const response = {
    success: false,
    message
  };

  // Only include error details in development
  if (process.env.NODE_ENV === 'development' && error) {
    response.error = error.message || error;
  }

  return res.status(statusCode).json(response);
};

// Validation helpers
export const validateEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Date helpers
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

// String helpers
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const sanitizeString = (str) => {
  return str.trim().replace(/\s+/g, ' ');
};

// Array helpers
export const removeDuplicates = (array) => {
  return [...new Set(array)];
};

export const filterEmptyStrings = (array) => {
  return array.filter(item => item && item.trim());
};