import api from '../config/api';

export const authService = {

  login: (email, password) => {
    return api.post('/auth/login', { email, password });
  },

  logout: () => {
    return api.post('/auth/logout');
  },


  generateOTP: (mobileNo) => {
    return api.post('/auth/generate-otp', { mobileNo });
  },


  verifyOTP: (mobileNo, otp) => {
    return api.post('/auth/verify-otp', { mobileNo, otp });
  },


  getProfile: () => {
    return api.get('/auth/profile');
  },

  createFranchise: (data) => {
    return api.post('/auth/create-franchise-user', data);
  },


  getAllFranchises: () => {
    return api.get('/auth/franchises');
  },


  toggleFranchiseStatus: (franchiseId) => {
    return api.put(`/auth/franchise/${franchiseId}/toggle-status`);
  },


  getFranchiseDetails: (franchiseId) => {
    return api.get(`/auth/franchise/${franchiseId}/details`);
  },
};
