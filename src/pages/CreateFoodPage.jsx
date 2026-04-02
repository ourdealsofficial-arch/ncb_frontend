import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { foodService } from "../services/foodService";

const CreateFoodPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "STARTERS",
    price: "",
    isAvailable: true,
  });

  // S3 file upload state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [message, setMessage] = useState("");

  const categories = [
    "STARTERS",
    "MAIN_COURSE",
    "BEVERAGES",
    "DESSERTS",
    "SNACKS",
    "CHAAT",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Client-side validation: 5 MB, image types only
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setMessage("❌ Only JPEG, PNG, or WebP images are allowed.");
      e.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage("❌ Image size must be under 5 MB.");
      e.target.value = "";
      return;
    }

    setMessage("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Build multipart FormData for S3 upload
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("description", formData.description);
      fd.append("category", formData.category);
      fd.append("price", Number(formData.price));
      fd.append("isAvailable", formData.isAvailable);
      if (imageFile) {
        fd.append("image", imageFile);
      }

      const res = await foodService.createFood(fd);
      console.log("Response:", res.data);
      setSuccessModal(true);
      setMessage("✅ Food item created successfully!");

      // Reset form
      setFormData({
        name: "",
        description: "",
        category: "STARTERS",
        price: "",
        isAvailable: true,
      });
      setImageFile(null);
      setImagePreview(null);

      setTimeout(() => {
        setSuccessModal(false);
        navigate("/food");
      }, 2000);
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "❌ Failed to create food item. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-100 via-white to-yellow-100 p-6">
      {/* Confetti Animation */}
      <AnimatePresence>
        {successModal && <Confetti numberOfPieces={400} recycle={false} />}
      </AnimatePresence>

      {/* Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl"
      >
        <h1 className="text-3xl font-extrabold text-center text-orange-600 mb-2">
          🍕 Create New Food Item
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Add a new delicious item to your menu
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Food Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Food Name *
            </label>
            <input
              type="text"
              name="name"
              placeholder="Paneer Tikka"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Description *
            </label>
            <textarea
              name="description"
              placeholder="Delicious grilled paneer with spices..."
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Category and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                placeholder="250"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Image Upload — S3 */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Food Image (Optional)
            </label>
            <input
              type="file"
              name="image"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-orange-50 file:text-orange-700 file:font-medium hover:file:bg-orange-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              JPEG, PNG, or WebP · Max 5 MB · Uploaded directly to AWS S3
            </p>
            {/* Preview */}
            {imagePreview && (
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-20 w-20 object-cover rounded-lg border border-gray-200 shadow"
                />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="text-sm text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
              className="w-5 h-5 text-orange-600 focus:ring-orange-500 rounded"
            />
            <label className="text-gray-700 font-medium">
              Available for orders
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-1/2 bg-orange-600 text-white font-semibold py-3 rounded-lg hover:bg-orange-700 transition duration-300 flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                "Create Food Item"
              )}
            </button>
          </div>
        </form>

        {/* Message */}
        {message && (
          <p
            className={`mt-6 text-center font-medium ${
              message.startsWith("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </motion.div>

      {/* Success Modal */}
      <AnimatePresence>
        {successModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-sm"
            >
              <h2 className="text-2xl font-bold text-green-600 mb-3">
                🎉 Success!
              </h2>
              <p className="text-gray-600 mb-5">
                Food item created and image uploaded to S3! Redirecting...
              </p>
              <div className="loader border-4 border-orange-200 border-t-orange-600 rounded-full w-10 h-10 mx-auto animate-spin"></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateFoodPage;