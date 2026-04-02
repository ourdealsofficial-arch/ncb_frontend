import api from '../config/api';

export const analyticsService = {

  getAnalytics: (period = 'today') => {
    return api.get(`/analytics?period=${period}`);
  },

  getDashboard: (period = 'today') => {
    return api.get(`/analytics/dashboard?period=${period}`);
  },
};
