import API, { PublicAPI } from './api.js';

// User Authentication Service
export const userAuthService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await PublicAPI.post('/auth/user/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await PublicAPI.post('/auth/user/login', credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await API.get('/auth/user/me');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get profile');
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await API.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await API.put('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password change failed');
    }
  }
};

// Recruiter Authentication Service
export const recruiterAuthService = {
  // Register a new recruiter
  register: async (recruiterData) => {
    try {
      const response = await PublicAPI.post('/auth/recruiter/register', recruiterData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  // Login recruiter
  login: async (credentials) => {
    try {
      const response = await PublicAPI.post('/auth/recruiter/login', credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Get recruiter profile
  getProfile: async () => {
    try {
      const response = await API.get('/auth/recruiter/me');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get profile');
    }
  },

  // Update recruiter profile
  updateProfile: async (profileData) => {
    try {
      const response = await API.put('/recruiters/profile', profileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await API.put('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password change failed');
    }
  }
};

// General Auth Service (for logout, etc.)
export const authService = {
  // Logout
  logout: async () => {
    try {
      await API.post('/auth/logout');
    } catch (error) {
      // Even if logout fails on server, we'll clear local storage
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
};