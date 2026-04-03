import axios from 'axios';

const api = axios.create({
  baseURL: 'https://2406:da1a:a66:db00:2983:d196:d8d2:a200:5000/api/v1', // change if using Railway/Vercel
  withCredentials: true, // sends cookies
});

// Request interceptor to add authentication token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to transform _id to id recursively
const transformIds = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(item => transformIds(item));
  } else if (obj !== null && typeof obj === 'object') {
    const transformed = {};
    for (const key in obj) {
      if (key === '_id') {
        transformed.id = obj[key];
        transformed._id = obj[key]; // Keep _id as well for compatibility
      } else {
        transformed[key] = transformIds(obj[key]);
      }
    }
    return transformed;
  }
  return obj;
};

// Response interceptor to handle errors globally and transform IDs
api.interceptors.response.use(
  (response) => {
    // Transform _id to id in response data
    if (response.data) {
      response.data = transformIds(response.data);
    }
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      console.log('401 Unauthorized - clearing auth data');
      
      // Clear authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('tokenExpiry');
      
      // Redirect to login page if not already there
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        console.log('Redirecting to login due to 401');
        window.location.href = '/login';
      }
    }
    
    // Handle 403 Forbidden errors (insufficient permissions)
    if (error.response && error.response.status === 403) {
      // Add a custom property to identify 403 errors
      error.isForbidden = true;
      error.forbiddenMessage = error.response?.data?.message || "Access Denied: You don't have permission to perform this action";
    }
    
    // Handle network errors
    if (!error.response) {
      error.isNetworkError = true;
      error.networkMessage = "Network Error: Please check your internet connection and try again";
    }
    
    return Promise.reject(error);
  }
);

export default api;
