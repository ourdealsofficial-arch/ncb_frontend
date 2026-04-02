import { useState, useCallback } from "react";

export const useToast = () => {
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "info",
  });

  const showToast = useCallback((message, type = "info") => {
    setToast({
      isVisible: true,
      message,
      type,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({
      ...prev,
      isVisible: false,
    }));
  }, []);

  const showSuccess = useCallback((message) => showToast(message, "success"), [showToast]);
  const showError = useCallback((message) => showToast(message, "error"), [showToast]);
  const showWarning = useCallback((message) => showToast(message, "warning"), [showToast]);
  const showInfo = useCallback((message) => showToast(message, "info"), [showToast]);

  return {
    toast,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
