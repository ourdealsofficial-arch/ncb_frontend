import api from '../config/api';

export const foodService = {
  getAllFoods: (params = {}) => {
    return api.get('/food/all-foods', { params });
  },

  createFood: (data) => {
    const isFormData = data instanceof FormData;
    return api.post('/food/create-food', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
  },

  updateFood: (id, data) => {
    const isFormData = data instanceof FormData;
    return api.put(`/food/update-food/${id}`, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
  },

  deleteFood: (id) => {
    return api.delete(`/food/delete-food/${id}`);
  },

  toggleAvailability: (id) => {
    return api.put(`/food/toggle-food-availability/${id}`);
  },
};

