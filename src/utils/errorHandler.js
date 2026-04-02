/**
 * Utility function to extract user-friendly error messages from API errors
 * @param {Error} error - The error object from API call
 * @param {string} defaultMessage - Default message if no specific error is found
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error, defaultMessage = "An unexpected error occurred") => {
  // Handle 403 Forbidden errors
  if (error.isForbidden) {
    return error.forbiddenMessage;
  }

  // Handle network errors
  if (error.isNetworkError) {
    return error.networkMessage;
  }

  // Handle API response errors
  if (error.response) {
    const { status, data } = error.response;

    // Handle specific status codes
    switch (status) {
      case 400:
        return data?.message || "Invalid request. Please check your input and try again";
      case 404:
        return data?.message || "The requested resource was not found";
      case 409:
        return data?.message || "A conflict occurred. The resource may already exist";
      case 422:
        return data?.message || "Validation failed. Please check your input";
      case 500:
        return "Server error. Please try again later";
      case 503:
        return "Service temporarily unavailable. Please try again later";
      default:
        return data?.message || defaultMessage;
    }
  }

  // Handle request errors (no response received)
  if (error.request) {
    return "No response from server. Please check your connection";
  }

  // Handle other errors
  return error.message || defaultMessage;
};

/**
 * Utility function to handle API errors with retry functionality
 * @param {Function} apiCall - The API call function to execute
 * @param {Object} options - Options for error handling
 * @returns {Promise} Result of the API call
 */
export const handleApiCall = async (apiCall, options = {}) => {
  const {
    onSuccess,
    onError,
    showToast,
    successMessage,
    errorMessage,
    retryCount = 0,
    maxRetries = 0,
  } = options;

  try {
    const result = await apiCall();
    
    if (onSuccess) {
      onSuccess(result);
    }
    
    if (showToast && successMessage) {
      showToast(successMessage, "success");
    }
    
    return result;
  } catch (error) {
    console.error("API call error:", error);
    
    // Retry logic for network errors
    if (error.isNetworkError && retryCount < maxRetries) {
      console.log(`Retrying... Attempt ${retryCount + 1} of ${maxRetries}`);
      return handleApiCall(apiCall, {
        ...options,
        retryCount: retryCount + 1,
      });
    }
    
    const message = getErrorMessage(error, errorMessage);
    
    if (onError) {
      onError(error, message);
    }
    
    if (showToast) {
      showToast(message, "error");
    }
    
    throw error;
  }
};

/**
 * Utility function to validate form data
 * @param {Object} data - Form data to validate
 * @param {Object} rules - Validation rules
 * @returns {Object} Validation errors object
 */
export const validateForm = (data, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const rule = rules[field];
    const value = data[field];

    // Required validation
    if (rule.required && (!value || value.toString().trim() === "")) {
      errors[field] = rule.message || `${field} is required`;
      return;
    }

    // Skip other validations if field is empty and not required
    if (!value) return;

    // Min length validation
    if (rule.minLength && value.length < rule.minLength) {
      errors[field] = rule.message || `${field} must be at least ${rule.minLength} characters`;
      return;
    }

    // Max length validation
    if (rule.maxLength && value.length > rule.maxLength) {
      errors[field] = rule.message || `${field} must not exceed ${rule.maxLength} characters`;
      return;
    }

    // Email validation
    if (rule.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors[field] = rule.message || "Invalid email address";
      return;
    }

    // Phone validation
    if (rule.phone && !/^\d{10}$/.test(value.replace(/\D/g, ""))) {
      errors[field] = rule.message || "Invalid phone number";
      return;
    }

    // Custom validation
    if (rule.custom && !rule.custom(value)) {
      errors[field] = rule.message || `${field} is invalid`;
    }
  });

  return errors;
};
