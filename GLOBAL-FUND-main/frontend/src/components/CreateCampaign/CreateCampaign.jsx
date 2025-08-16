// frontend/src/components/CreateCampaign/CreateCampaign.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import MessageModal from "../messagemodal/MessageModal.jsx"; // Import the MessageModal component

const CreateCampaign = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  // State for all campaign form fields using a single formData object
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "", // Keep as string for input, convert to Number on submit
    deadline: "",
    currency: "PKR", // Default currency, ensure it's one of the valid options
    urgency: "medium", // Default urgency, ensure it matches available options
    beneficiaryInfo: "",
  walletOptions: [], // Array for checkboxes (stores selected wallet names)
  phoneNumber: "",
  });

  // Wallet options vary by currency: PKR => local wallets, USD => international wallets
  const wallets = formData.currency === "USD"
    ? ["Wise", "Stripe", "Card"]
    : ["JazzCash", "EasyPaisa", "Card"];

  // State for loading indicator during form submission
  const [loading, setLoading] = useState(false);
  // State for displaying messages in the custom modal (e.g., success, error)
  const [modalMessage, setModalMessage] = useState("");
  // State for determining the type of message ('success' or 'error')
  const [modalType, setModalType] = useState("");

  // Function to close the message modal by clearing the modal message
  const closeModal = () => {
    setModalMessage("");
  };

  // Generic handleChange function to update formData state for all input types
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      // Handle checkbox inputs for walletOptions
      setFormData((prev) => ({
        ...prev,
        walletOptions: checked
          ? [...prev.walletOptions, value] // Add wallet to array if checked
          : prev.walletOptions.filter((opt) => opt !== value), // Remove wallet if unchecked
      }));
    } else {
      // Handle text, number, select, textarea inputs
      if (name === "currency") {
        // When currency changes, also sanitize walletOptions to only include allowed wallets
        const allowed = value === "USD" ? ["Wise", "Stripe", "Card"] : ["JazzCash", "EasyPaisa", "Card"];
        setFormData((prev) => ({
          ...prev,
          currency: value,
          walletOptions: prev.walletOptions.filter((opt) => allowed.includes(opt)),
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    }
  };

  // Handle form submission logic
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser form submission (page reload)
    setLoading(true); // Activate loading state
    setModalMessage(""); // Clear any previous modal messages before new submission

    // --- Authentication Check: Retrieve user token from localStorage ---
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token = userInfo ? userInfo.token : null;

    if (!token) {
      // If no token is found, display an error and redirect to login
      setModalMessage("You must be logged in to create a campaign.");
      setModalType("error");
      setLoading(false);
      navigate("/login"); // Redirect to the main user login page
      return; // Stop the submission process
    }
    // --- End Authentication Check ---

    try {
      // Client-side validation: ensure phoneNumber exists and is 11 digits
      if (!formData.phoneNumber || !/^\d{11}$/.test(String(formData.phoneNumber))) {
        setModalMessage("Please enter a valid 11-digit phone number (e.g. 03001234567).");
        setModalType("error");
        setLoading(false);
        return;
      }
      // Build JSON payload (backend expects JSON now)
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        goal: Number(formData.goal) || 0,
        currency: formData.currency || "PKR",
        deadline: formData.deadline || null,
        urgency: (formData.urgency || "medium").toLowerCase(),
        beneficiaryInfo: formData.beneficiaryInfo.trim(),
        walletOptions: Array.isArray(formData.walletOptions) ? formData.walletOptions : [],
        phoneNumber: String(formData.phoneNumber || ""),
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      // Send JSON payload
      const res = await axios.post("http://localhost:8000/api/campaigns", payload, config);

      // Set success message for the modal
      setModalMessage("Campaign submitted successfully! Awaiting admin approval.");
      setModalType("success");

      // Reset form fields to their initial empty state after successful submission
      setFormData({
        title: "",
        description: "",
        goal: "",
        deadline: "",
        currency: "PKR",
        urgency: "medium",
        beneficiaryInfo: "",
        walletOptions: [],
        phoneNumber: "",
      });

      // Optional: Navigate to a different page after a delay to show success message
      // setTimeout(() => {
      //   navigate('/DonationCampaign'); // Example: Navigate to the list of donation campaigns
      // }, 1500);
    } catch (err) {
      // Log the full error object for detailed debugging in the console
      console.error("Campaign creation failed:", err);

      // Extract a user-friendly error message from the Axios error response
      const message =
        err.response && err.response.data.message
          ? err.response.data.message // Message from backend validation/error
          : "Submission failed. Please check console for details."; // Generic fallback message
      setModalMessage(message); // Set error message for the modal
      setModalType("error"); // Set modal type to error
    } finally {
      setLoading(false); // Deactivate loading state regardless of success or failure
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-3xl w-full bg-white p-8 rounded-lg shadow-xl space-y-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center">
          Create a New Campaign
        </h2>
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
          encType="multipart/form-data" // Essential for forms that include file uploads
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Campaign Title</label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="goal" className="block text-sm font-medium text-gray-700">Goal Amount</label>
              <input
                type="number"
                name="goal"
                id="goal"
                value={formData.goal}
                onChange={handleChange}
                required
                min="0" // HTML5 validation for minimum value
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4} // Sets the visible height of the textarea
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Deadline</label>
              <input
                type="date"
                name="deadline"
                id="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency</label>
              <select
                name="currency"
                id="currency"
                value={formData.currency}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="PKR">PKR</option>
                <option value="USD">USD</option>
                
                {/* Add more currency options if needed, ensure they match backend schema */}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="urgency" className="block text-sm font-medium text-gray-700">Urgency</label>
              <select
                name="urgency"
                id="urgency"
                value={formData.urgency}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label htmlFor="beneficiaryInfo" className="block text-sm font-medium text-gray-700">Beneficiary Information</label>
              <input
                name="beneficiaryInfo"
                id="beneficiaryInfo"
                type="text"
                value={formData.beneficiaryInfo}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Who benefits from this campaign?"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Wallet Options</label>
            <div className="mt-2 flex flex-wrap gap-4">
              {wallets.map((wallet) => (
                <label key={wallet} className="flex items-center gap-2 text-gray-700">
                  <input
                    type="checkbox"
                    name="walletOptions"
                    value={wallet}
                    checked={formData.walletOptions.includes(wallet)} // Checks if wallet is in the formData array
                    onChange={handleChange}
                    className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  {wallet}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Contact Phone (11 digits)</label>
            <input
              type="tel"
              name="phoneNumber"
              id="phone"
              value={formData.phoneNumber || ""}
              onChange={handleChange}
              pattern="\d{11}"
              required
              placeholder="03XXXXXXXXX"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Enter 11 digits, e.g., 03001234567</p>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={loading} // Disable button while loading to prevent multiple submissions
          >
            {loading ? 'Creating Campaign...' : 'Create Campaign'}
          </button>
        </form>
      </div>

      {/* Message Modal for success/error feedback, always rendered but conditionally visible */}
      <MessageModal message={modalMessage} type={modalType} onClose={closeModal} />
    </div>
  );
};

export default CreateCampaign;