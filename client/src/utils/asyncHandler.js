// utils/asyncHandler.js

export const asyncHandler = (fn) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      // You can centralize logging here
      console.error('API Error:', error?.response?.data || error.message);
      throw error; // still throw if caller needs it
    }
  };
};
