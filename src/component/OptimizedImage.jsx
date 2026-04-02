import { useState } from "react";
import { motion } from "framer-motion";

const OptimizedImage = ({
  src,
  alt,
  className = "",
  fallbackSrc = "/placeholder-food.png",
  aspectRatio = "square", // 'square', 'video', 'portrait', 'landscape'
  loading = "lazy",
  ...props
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const aspectRatios = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${aspectRatios[aspectRatio]} ${className}`}>
      {/* Loading Skeleton */}
      {!imageLoaded && (
        <div className="absolute inset-0 skeleton" />
      )}

      {/* Image */}
      <motion.img
        src={imageError ? fallbackSrc : src}
        alt={alt}
        loading={loading}
        onLoad={handleImageLoad}
        onError={handleImageError}
        initial={{ opacity: 0 }}
        animate={{ opacity: imageLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="w-full h-full object-cover"
        {...props}
      />

      {/* Error Overlay */}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="text-center text-gray-500">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-xs">Image not available</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
