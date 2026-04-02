import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useAuth } from "../context/AuthContext";
import api from "../config/api";
import Button from "../component/Button";
import Input from "../component/Input";

const VerificationPage = () => {
  const navigate = useNavigate();
  const { updateUser, user } = useAuth();

  const [step, setStep] = useState(1); // 1: Enter Mobile, 2: Enter OTP
  const [mobileNo, setMobileNo] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [successModal, setSuccessModal] = useState(false);

  // Step 1: Generate OTP
  const handleGenerateOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await api.post("/auth/generate-otp", { mobileNo });
      console.log("OTP Response:", res.data);
      setMessage("✅ OTP sent successfully to your mobile!");
      setStep(2);
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await api.post("/auth/verify-otp", { mobileNo, otp });
      console.log("Verify Response:", res.data);
      
      // Update user data in context
      if (user) {
        const updatedUser = {
          ...user,
          isVerified: true,
          isActive: true,
        };
        updateUser(updatedUser);
      }

      setSuccessModal(true);
      setMessage("✅ Account verified successfully!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message || "Invalid OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6">
      {/* Confetti Animation */}
      <AnimatePresence>
        {successModal && <Confetti numberOfPieces={400} recycle={false} />}
      </AnimatePresence>

      {/* Verification Container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md border border-gray-100"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✅</span>
          </div>
          <h1 className="text-3xl font-extrabold text-orange-600">
            Verify Your Account
          </h1>
          <p className="text-gray-500 mt-2">
            {step === 1
              ? "Enter your mobile number to receive OTP"
              : "Enter the OTP sent to your mobile"}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all ${
                step >= 1
                  ? "bg-orange-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              1
            </div>
            <div className={`w-12 h-1 transition-all ${step >= 2 ? "bg-orange-600" : "bg-gray-300"}`}></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all ${
                step >= 2
                  ? "bg-orange-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              2
            </div>
          </div>
        </div>

        {/* Step 1: Mobile Number */}
        {step === 1 && (
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleGenerateOTP}
            className="space-y-5"
          >
            <Input
              type="tel"
              label="Mobile Number"
              placeholder="9876543210"
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
              required
              maxLength={10}
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {message}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </motion.form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleVerifyOTP}
            className="space-y-5"
          >
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Enter OTP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:outline-none text-lg text-center tracking-widest"
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                OTP sent to {mobileNo}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {message}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp("");
                setError("");
                setMessage("");
              }}
              className="w-full text-gray-600 font-medium py-2 hover:text-orange-600 transition"
            >
              ← Change Mobile Number
            </button>
          </motion.form>
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
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🎉</span>
              </div>
              <h2 className="text-2xl font-bold text-orange-600 mb-3">
                Verification Successful!
              </h2>
              <p className="text-gray-600 mb-5">
                Your account has been verified. Redirecting to dashboard...
              </p>
              <div className="loader border-4 border-orange-200 border-t-orange-600 rounded-full w-10 h-10 mx-auto animate-spin"></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VerificationPage;
