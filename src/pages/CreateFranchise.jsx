import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars
import Confetti from "react-confetti";
import { Building2, MapPin, Lock, CheckCircle, AlertCircle } from "lucide-react";
import Button from "../component/Button";
import Input from "../component/Input";
import Card from "../component/Card";
import Modal from "../component/Modal";
import { authService } from "../services/authService";

const FranchiseRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    adminPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    }

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = "Owner name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    if (!formData.adminPassword.trim()) {
      newErrors.adminPassword = "Admin password is required";
    } else if (formData.adminPassword.length < 6) {
      newErrors.adminPassword = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await authService.createFranchise(formData);
      console.log("Response:", response.data);
      setSuccessModal(true);

      // Reset form
      setFormData({
        businessName: "",
        ownerName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        adminPassword: "",
      });
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToVerification = () => {
    setSuccessModal(false);
    navigate("/verify");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Confetti Animation */}
      <AnimatePresence>
        {successModal && <Confetti numberOfPieces={400} recycle={false} />}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-[#FF6B35] rounded-full">
              <Building2 className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Franchise
          </h1>
          <p className="text-gray-600">
            Register a new restaurant franchise and create admin account
          </p>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Franchise Details Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#FF6B35]" />
                  Franchise Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Business Name"
                    type="text"
                    name="businessName"
                    placeholder="e.g., Tasty Bites Restaurant"
                    value={formData.businessName}
                    onChange={handleChange}
                    error={errors.businessName}
                    required
                  />
                  <Input
                    label="Owner Name"
                    type="text"
                    name="ownerName"
                    placeholder="e.g., John Doe"
                    value={formData.ownerName}
                    onChange={handleChange}
                    error={errors.ownerName}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="franchise@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    name="phone"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    required
                    maxLength={10}
                  />
                </div>
              </div>

              {/* Address Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#FF6B35]" />
                  Address Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      label="Address"
                      type="text"
                      name="address"
                      placeholder="Street address"
                      value={formData.address}
                      onChange={handleChange}
                      error={errors.address}
                      required
                    />
                  </div>
                  <Input
                    label="City"
                    type="text"
                    name="city"
                    placeholder="e.g., Mumbai"
                    value={formData.city}
                    onChange={handleChange}
                    error={errors.city}
                    required
                  />
                  <Input
                    label="State"
                    type="text"
                    name="state"
                    placeholder="e.g., Maharashtra"
                    value={formData.state}
                    onChange={handleChange}
                    error={errors.state}
                    required
                  />
                  <Input
                    label="Pincode"
                    type="text"
                    name="pincode"
                    placeholder="400001"
                    value={formData.pincode}
                    onChange={handleChange}
                    error={errors.pincode}
                    required
                    maxLength={6}
                  />
                  <Input
                    label="Country"
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    disabled
                  />
                </div>
              </div>

              {/* Admin Credentials Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#FF6B35]" />
                  Admin Credentials
                </h2>
                <div className="max-w-md">
                  <Input
                    label="Admin Password"
                    type="password"
                    name="adminPassword"
                    placeholder="Enter secure password (min 6 characters)"
                    value={formData.adminPassword}
                    onChange={handleChange}
                    error={errors.adminPassword}
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    This password will be used by the franchise admin to log in
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-2"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-red-600 text-sm">{message}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  disabled={loading}
                >
                  Create Franchise
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={successModal}
        onClose={() => setSuccessModal(false)}
        size="md"
        closeOnBackdropClick={false}
      >
        <div className="text-center py-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Franchise Created Successfully!
          </h2>
          <p className="text-gray-600 mb-2">
            The franchise has been registered successfully.
          </p>
          <p className="text-gray-600 mb-6">
            An OTP has been sent to the franchise admin's mobile number for verification.
          </p>
          <div className="flex flex-col gap-3">
            <Button
              variant="primary"
              onClick={handleNavigateToVerification}
              className="w-full"
            >
              Go to Verification Page
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setSuccessModal(false);
                navigate("/dashboard");
              }}
              className="w-full"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FranchiseRegister;
