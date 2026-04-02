import api from '../config/api';

export const billService = {

  getAllBills: (params = {}) => {
    return api.get('/bill/all-bills', { params });
  },

  getBillById: (id) => {
    return api.get(`/bill/bill/${id}`);
  },


  createBill: (data) => {
    return api.post('/bill/create-bill', data);
  },

  updateBill: (id, data) => {
    return api.put(`/bill/update-bill/${id}`, data);
  },


  deleteBill: (id) => {
    return api.delete(`/bill/delete-bill/${id}`);
  },

  getFranchiseBills: (franchiseId, params = {}) => {
    return api.get(`/bill/franchise/${franchiseId}/bills`, { params });
  },
};
