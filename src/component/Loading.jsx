import React from "react";

const Loading = ({ size = "md", fullScreen = false, text = "Loading..." }) => {
  const sizes = {
    sm: "h-6 w-6 border-2",
    md: "h-12 w-12 border-3",
    lg: "h-16 w-16 border-4",
  };

  const spinner = (
    <div
      className={`animate-spin rounded-full border-t-[#FF6B35] border-r-[#FF6B35] border-b-transparent border-l-transparent ${sizes[size]}`}
    ></div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <div className="text-center">
          {spinner}
          {text && <p className="mt-4 text-gray-600 font-medium">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      {spinner}
    </div>
  );
};

export default Loading;
