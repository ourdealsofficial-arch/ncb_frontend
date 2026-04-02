import React from "react";
import { motion } from "framer-motion";

const Card = ({
  children,
  title,
  className = "",
  hover = true,
  padding = "md",
  ...props
}) => {
  const paddingClasses = {
    none: "",
    sm: "p-3 sm:p-4",
    md: "p-4 sm:p-6",
    lg: "p-6 sm:p-8",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg sm:rounded-xl shadow-md ${
        hover ? "hover:shadow-lg transition-shadow duration-300" : ""
      } ${!title ? paddingClasses[padding] : ""} ${className}`}
      {...props}
    >
      {title && (
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      <div className={title ? paddingClasses[padding] : ""}>
        {children}
      </div>
    </motion.div>
  );
};

export default Card;
