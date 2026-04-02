import React from "react";

const Badge = ({ children, variant = "default", size = "md", className = "" }) => {
  const variants = {
    success: "bg-green-100 text-green-700 border border-green-200",
    warning: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    danger: "bg-red-100 text-red-700 border border-red-200",
    info: "bg-blue-100 text-blue-700 border border-blue-200",
    default: "bg-gray-100 text-gray-700 border border-gray-200",
    orange: "bg-orange-100 text-orange-700 border border-orange-200",
    active: "bg-green-100 text-green-700 border border-green-200",
    inactive: "bg-gray-100 text-gray-600 border border-gray-200",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
