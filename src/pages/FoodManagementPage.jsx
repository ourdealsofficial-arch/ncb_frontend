import { useState, useEffect } from "react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars

import { foodService } from "../services/foodService";
import Button from "../component/Button";
import Card from "../component/Card";
import Input from "../component/Input";
import Loading from "../component/Loading";
import Badge from "../component/Badge";
import Modal from "../component/Modal";

const FoodManagementPage = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    isAvailable: "",
    search: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit'
  const [selectedFood, setSelectedFood] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [foodToDelete, setFoodToDelete] = useState(null);

  const categories = [
    "STARTERS",
    "MAIN_COURSE",
    "BEVERAGES",
    "DESSERTS",
    "SNACKS",
    "CHAAT",
  ];

  // Fetch foods with filters
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchFoods = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      const params = {};
      
      if (filters.category) params.category = filters.category;
      if (filters.isAvailable !== "") params.isAvailable = filters.isAvailable;
      if (filters.search.trim()) params.search = filters.search.trim();

      const response = await foodService.getAllFoods(params);
      setFoods(response.data.data.foods || []);
    } catch (error) {
      console.error("Error fetching foods:", error);
      setErrorMessage(error.response?.data?.message || "Failed to fetch food items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.category, filters.isAvailable]);

  const handleSearch = () => {
    fetchFoods();
  };

  const handleCreateClick = () => {
    setModalMode("create");
    setSelectedFood(null);
    setShowModal(true);
  };

  const handleEditClick = (food) => {
    setModalMode("edit");
    setSelectedFood(food);
    setShowModal(true);
  };

  const handleDeleteClick = (food) => {
    setFoodToDelete(food);
    setShowDeleteConfirm(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedFood(null);
  };

  const handleModalSuccess = () => {
    setShowModal(false);
    setSelectedFood(null);
    fetchFoods();
  };

  const confirmDelete = async () => {
    if (!foodToDelete) return;

    try {
      await foodService.deleteFood(foodToDelete._id);
      setShowDeleteConfirm(false);
      setFoodToDelete(null);
      setSuccessMessage("Food item deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchFoods();
    } catch (error) {
      console.error("Error deleting food:", error);
      setErrorMessage(error.response?.data?.message || "Failed to delete food item. Please try again.");
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2"
          >
            <span className="font-medium">✓ {successMessage}</span>
          </motion.div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2"
          >
            <span className="font-medium">✗ {errorMessage}</span>
          </motion.div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-orange-600">
              🍕 Food Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your restaurant menu items
            </p>
          </div>
          <Button variant="primary" onClick={handleCreateClick}>
            + Create Food
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search by name..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="flex-1"
                />
                <Button variant="primary" onClick={handleSearch}>
                  Search
                </Button>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <select
                value={filters.isAvailable}
                onChange={(e) =>
                  setFilters({ ...filters, isAvailable: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                <option value="">All Items</option>
                <option value="true">Available Only</option>
                <option value="false">Unavailable Only</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Food Items Grid */}
        {loading ? (
          <Loading size="lg" />
        ) : foods.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No food items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3">
            {foods.map((food, index) => (
              <motion.div
                key={food._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Food Image */}
                <div className="relative h-24 bg-gray-200">
                  <img
                    src={food.image || "https://cdn-icons-png.flaticon.com/512/1046/1046784.png"}
                    alt={food.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-1 right-1">
                    <Badge variant={food.isAvailable ? "success" : "danger"}>
                      {food.isAvailable ? "✓" : "✗"}
                    </Badge>
                  </div>
                </div>

                {/* Food Details */}
                <div className="p-2">
                  <h3 className="font-bold text-gray-800 text-xs mb-0.5 truncate" title={food.name}>
                    {food.name}
                  </h3>
                  <p className="text-[10px] text-gray-500 mb-1 truncate">
                    {food.category.replace("_", " ")}
                  </p>
                  <p className="text-[#FF6B35] font-bold text-sm mb-2">
                    ₹{food.price}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-1">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEditClick(food)}
                      className="flex-1 text-[10px] px-2 py-1"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(food)}
                      className="flex-1 text-[10px] px-2 py-1"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal - Will be implemented in next subtask */}
      {showModal && (
        <FoodFormModal
          isOpen={showModal}
          mode={modalMode}
          food={selectedFood}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <Modal
          isOpen={showDeleteConfirm}
          onClose={() => {
            setShowDeleteConfirm(false);
            setFoodToDelete(null);
          }}
          title="Confirm Delete"
        >
          <div className="p-4">
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete{" "}
              <strong>{foodToDelete?.name}</strong>? This action cannot be
              undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setFoodToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// Food Form Modal Component
const FoodFormModal = ({ isOpen, mode, food, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "STARTERS",
    price: "",
  });
  // S3 file upload state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // local object URL or existing S3 URL
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const categories = [
    "STARTERS",
    "MAIN_COURSE",
    "BEVERAGES",
    "DESSERTS",
    "SNACKS",
    "CHAAT",
  ];

  // Initialize form data when editing
  useEffect(() => {
    if (mode === "edit" && food) {
      setFormData({
        name: food.name || "",
        description: food.description || "",
        category: food.category || "STARTERS",
        price: food.price?.toString() || "",
      });
      setImagePreview(food.image || null); // show existing S3 image
    } else {
      setFormData({
        name: "",
        description: "",
        category: "STARTERS",
        price: "",
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setErrors({});
    setSuccessMessage("");
  }, [mode, food, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setErrors({ ...errors, image: "Only JPEG, PNG, or WebP images allowed" });
      e.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, image: "Image must be under 5 MB" });
      e.target.value = "";
      return;
    }
    setErrors({ ...errors, image: "" });
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      // Build multipart FormData for S3 upload
      const fd = new FormData();
      fd.append("name", formData.name.trim());
      fd.append("description", formData.description.trim());
      fd.append("category", formData.category);
      fd.append("price", Number(formData.price));
      if (imageFile) {
        fd.append("image", imageFile);
      }

      if (mode === "create") {
        await foodService.createFood(fd);
        setSuccessMessage("✓ Food item created successfully!");
      } else {
        await foodService.updateFood(food._id, fd);
        setSuccessMessage("✓ Food item updated successfully!");
      }

      setTimeout(() => { onSuccess(); }, 1500);
    } catch (error) {
      console.error("Error saving food:", error);
      setErrors({
        submit:
          error.response?.data?.message ||
          `Failed to ${mode === "create" ? "create" : "update"} food item`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Create Food Item" : "Edit Food Item"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-4">
          {/* Name */}
          <div>
            <Input
              type="text"
              label="Food Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
              placeholder="e.g., Paneer Tikka"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the food item..."
              rows={3}
              className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Category and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
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
              <Input
                type="number"
                label="Price (₹)"
                name="price"
                value={formData.price}
                onChange={handleChange}
                error={errors.price}
                required
                placeholder="e.g., 250"
                min="0"
                step="0.01"
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
              JPEG, PNG, or WebP · Max 5 MB · Uploaded to AWS S3
            </p>
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image}</p>
            )}
            {/* Preview: new selection or existing S3 URL */}
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

          {/* Error Message */}
          {errors.submit && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2"
            >
              <span className="text-lg">✗</span>
              <span className="flex-1">{errors.submit}</span>
            </motion.div>
          )}

          {/* Success Message */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2"
            >
              <span className="text-lg">✓</span>
              <span className="flex-1 font-medium">{successMessage}</span>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading}
            >
              {mode === "create" ? "Create Food" : "Update Food"}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default FoodManagementPage;
