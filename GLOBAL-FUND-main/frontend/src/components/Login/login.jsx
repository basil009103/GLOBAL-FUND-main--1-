// frontend/src/components/Login/login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import MessageModal from "../messagemodal/MessageModal.jsx"; // Ensure correct path: '../MessageModal'

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false); // Controls main reset modal visibility
  const [resetEmail, setResetEmail] = useState(""); // Email for password reset flow

  // NEW STATES for Forgot Password Flow
  const [resetStep, setResetStep] = useState(1); // 1: Enter Email, 2: Enter OTP, 3: Set New Password
  const [otp, setOtp] = useState(""); // State for OTP input
  const [newPassword, setNewPassword] = useState(""); // State for new password input
  const [confirmNewPassword, setConfirmNewPassword] = useState(""); // State for confirm new password

  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phone: value }));
  };

  const closeModal = () => {
    setModalMessage("");
  };

  // Main Login/Signup submission handler (no change in core functionality)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setModalMessage("");

    if (isSignUp) {
      const { name, email, password, confirmpassword, phone } = formData;
      if (!name || !email || !password || !confirmpassword || !phone) {
        setModalMessage("Please fill all fields.");
        setModalType("error");
        setLoading(false);
        return;
      }
      if (password !== confirmpassword) {
        setModalMessage("Passwords do not match.");
        setModalType("error");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.post("http://localhost:8000/api/users", {
          name, email, password, phone,
        });
        localStorage.setItem("userInfo", JSON.stringify(res.data));
        setModalMessage("Sign Up successful! Redirecting to home.");
        setModalType("success");
        setTimeout(() => { navigate("/home"); }, 1500);
      } catch (error) {
        console.error("Signup error:", error);
        const message = error.response?.data?.message || "Something went wrong during signup.";
        setModalMessage(message);
        setModalType("error");
      } finally {
        setLoading(false);
      }
    } else {
      const { email, password } = formData;
      if (!email || !password) {
        setModalMessage("Please fill all fields.");
        setModalType("error");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.post("http://localhost:8000/api/users/login", {
          email, password,
        });
        localStorage.setItem("userInfo", JSON.stringify(res.data));
        setModalMessage("Login successful! Redirecting to home page.");
        setModalType("success");
        setTimeout(() => { navigate("/home"); }, 1500);
      } catch (error) {
        console.error("Login error:", error);
        const message = error.response?.data?.message || "Something went wrong during login.";
        setModalMessage(message);
        setModalType("error");
      } finally {
        setLoading(false);
      }
    }
  };

  // --- NEW: Forgot Password Flow Handlers ---

  // Step 1: Request OTP
  const handleSendOtp = async () => {
    setLoading(true);
    setModalMessage("");

    if (!resetEmail) {
      setModalMessage("Please enter your email.");
      setModalType("error");
      setLoading(false);
      return;
    }

    try {
      // Placeholder API call to backend to request OTP
      const res = await axios.post("http://localhost:8000/api/users/forgot-password", { email: resetEmail });
      setModalMessage(res.data.message || "OTP sent to your email.");
      setModalType("success");
      setResetStep(2); // Move to OTP verification step
    } catch (error) {
      console.error("Send OTP error:", error);
      const message = error.response?.data?.message || "Failed to send OTP. Please try again.";
      setModalMessage(message);
      setModalType("error");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Request New Password
  const handleVerifyOtp = async () => {
    setLoading(true);
    setModalMessage("");

    if (!otp) {
      setModalMessage("Please enter the 6-digit OTP.");
      setModalType("error");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setModalMessage("New passwords do not match.");
      setModalType("error");
      setLoading(false);
      return;
    }
    if (newPassword.length < 6) { // Basic password length check
      setModalMessage("New password must be at least 6 characters long.");
      setModalType("error");
      setLoading(false);
      return;
    }

    try {
      // Placeholder API call to backend to verify OTP and set new password
      const res = await axios.post("http://localhost:8000/api/users/reset-password", {
        email: resetEmail,
        otp: otp,
        newPassword: newPassword,
      });

      setModalMessage(res.data.message || "Password reset successful! You can now login with your new password.");
      setModalType("success");
      setResetStep(1); // Reset modal to initial state (email input) or close it
      setShowResetModal(false); // Close the reset modal completely after success
      setResetEmail(""); // Clear email
      setOtp(""); // Clear OTP
      setNewPassword(""); // Clear new password
      setConfirmNewPassword(""); // Clear confirm new password
      // Optionally: navigate to login page if already on it, or just allow the user to close modal
      // navigate('/login'); 
    } catch (error) {
      console.error("Verify OTP/Reset Password error:", error);
      const message = error.response?.data?.message || "Failed to reset password. Invalid or expired OTP.";
      setModalMessage(message);
      setModalType("error");
    } finally {
      setLoading(false);
    }
  };

  // Handler for navigating to the Admin Login page
  const handleGoToAdminLogin = () => {
    navigate('/admin-login');
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen font-inter"
      style={{
        backgroundColor: '#f0f4f8',
        backgroundImage: `url('/1LOGINbg.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center 0%",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
          {isSignUp ? "Sign Up" : "User Login"}
        </h2>
        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-1">Name</label>
              <input
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="abcd@example.com"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">Password</label>
            <input
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {isSignUp && (
            <>
              <div className="mb-4">
                <label htmlFor="confirmpassword" className="block text-gray-700 text-sm font-medium mb-1">Confirm Password</label>
                <input
                  name="confirmpassword"
                  id="confirmpassword"
                  value={formData.confirmpassword}
                  onChange={handleChange}
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm your password"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-1">Phone Number</label>
                <PhoneInput
                  country="pk"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  inputProps={{ name: "phone", id: "phone", required: true }}
                  containerClass="w-full"
                  inputClass="!bg-gray-50 !text-gray-900 w-full !border !border-gray-300 !rounded-lg focus:!ring-blue-500 focus:!border-blue-500"
                  buttonClass="!border-gray-300 !rounded-l-lg"
                  dropdownClass="!rounded-lg !shadow-md"
                  placeholder="Enter phone number"
                  enableSearch
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (isSignUp ? "Signing Up..." : "Logging In...") : (isSignUp ? "Sign Up" : "Login")}
          </button>

          {!isSignUp && (
            <p
              className="text-sm text-blue-600 mt-3 cursor-pointer text-center hover:underline transition duration-200"
              onClick={() => {
                setShowResetModal(true);
                setResetStep(1); // Start reset flow at step 1 (email input)
              }}
            >
              Forgot password?
            </p>
          )}
        </form>

        {!isSignUp && (
          <button
            type="button"
            onClick={handleGoToAdminLogin}
            className="w-full mt-4 bg-purple-600 text-white py-2.5 rounded-lg hover:bg-purple-700 transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Admin Login
          </button>
        )}

        <p className="text-center mt-4 text-gray-600">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            className="text-blue-600 hover:underline font-medium transition duration-200"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Login here" : "Sign up here"}
          </button>
        </p>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 font-inter">
          <div className="bg-white p-6 rounded-lg w-96 max-w-sm shadow-xl">
            {resetStep === 1 && (
              <>
                <h3 className="text-lg font-bold mb-4 text-gray-800">Reset Password: Enter Email</h3>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <div className="flex justify-end gap-3">
                  <button
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
                    onClick={() => {
                      setShowResetModal(false);
                      setResetEmail("");
                      setModalMessage(""); // Clear modal message when canceling
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                    onClick={handleSendOtp} // NEW: Call handleSendOtp
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
                </div>
              </>
            )}

            {resetStep === 2 && (
              <>
                <h3 className="text-lg font-bold mb-4 text-gray-800">Reset Password: Verify OTP</h3>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                 <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <div className="flex justify-end gap-3">
                  <button
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
                    onClick={() => {
                      setResetStep(1); // Go back to email step
                      setOtp("");
                      setNewPassword("");
                      setConfirmNewPassword("");
                      setModalMessage("");
                    }}
                  >
                    Back
                  </button>
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                    onClick={handleVerifyOtp} // NEW: Call handleVerifyOtp
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify OTP & Reset"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Global Message Modal */}
      <MessageModal message={modalMessage} type={modalType} onClose={closeModal} />
    </div>
  );
};

export default Login;