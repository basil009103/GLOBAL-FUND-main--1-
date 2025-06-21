// frontend/src/components/AdminCampaigns/AdminCampaigns.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import MessageModal from '../messagemodal/MessageModal.jsx'; // Import the new custom message modal

const AdminCampaigns = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  // State to hold pending campaigns fetched from the backend
  const [pendingCampaigns, setPendingCampaigns] = useState([]);
  // State to manage loading indicator
  const [loading, setLoading] = useState(true);
  // State for displaying messages in the modal (success/error)
  const [modalMessage, setModalMessage] = useState('');
  // State for determining the type of message (e.g., 'success', 'error')
  const [modalType, setModalType] = useState('');

  // Function to close the message modal by clearing the message
  const closeModal = () => {
    setModalMessage('');
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('userInfo'); // Clear user info from local storage
    navigate('/'); // Redirect to the main login page
  };

  // Fetch all pending campaigns from the backend
  const fetchPending = async () => {
    setLoading(true); // Set loading to true while fetching data
    setModalMessage(''); // Clear any previous modal messages

    try {
      // Retrieve user information (which includes the token) from local storage
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo ? userInfo.token : null; // Extract the token

      // If no token, redirect to login (should be handled by ProtectedRoute, but good fallback)
      if (!token) {
        navigate('/'); // Redirect to login if token is unexpectedly missing
        return;
      }

      // Make GET request to fetch campaigns
      const res = await axios.get("http://localhost:8000/api/campaigns", {
        headers: {
          // Include Authorization header with Bearer token for authentication
          Authorization: `Bearer ${token}` 
        }
      });
      // Filter the campaigns to only show those with 'pending' status
      const filtered = res.data.filter((c) => c.status === "pending");
      setPendingCampaigns(filtered); // Update state with filtered campaigns
    } catch (err) {
      console.error("Failed to fetch campaigns:", err);
      // Determine a user-friendly error message from the response
      const message = err.response && err.response.data.message
        ? err.response.data.message
        : err.message;
      setModalMessage(`Failed to load campaigns: ${message}`); // Set error message for modal
      setModalType('error'); // Set modal type to error
      // If 401/403, might need to redirect to login
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        handleLogout(); // Log out if unauthorized
      }
    } finally {
      setLoading(false); // Set loading to false once fetching is complete
    }
  };

  // useEffect hook to call fetchPending when the component mounts
  useEffect(() => {
    fetchPending();
  }, []); // Empty dependency array means this runs once on mount

  // Approve campaign by ID
  const approveCampaign = async (id) => {
    setModalMessage(''); // Clear any previous modal messages
    try {
      // Retrieve user information (which includes the token) from local storage
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo ? userInfo.token : null; // Extract the token

      // Make PATCH request to approve a specific campaign
      // Sending an empty object as data, as the patch endpoint might only need the ID in the URL
      await axios.patch(`http://localhost:8000/api/campaigns/${id}/approve`, {}, {
        headers: {
          // Include Authorization header with Bearer token for authentication
          Authorization: `Bearer ${token}` 
        }
      });
      // Update the state to remove the approved campaign from the pending list
      setPendingCampaigns((prev) => prev.filter((c) => c._id !== id));
      setModalMessage("Campaign approved successfully!"); // Set success message for modal
      setModalType('success'); // Set modal type to success
      // Optionally, you could re-fetch campaigns here: fetchPending();
    } catch (err) {
      console.error("Approval failed:", err);
      // Determine a user-friendly error message from the response
      const message = err.response && err.response.data.message
        ? err.response.data.message
        : err.message;
      setModalMessage(`Failed to approve campaign: ${message}`); // Set error message for modal
      setModalType('error'); // Set modal type to error
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        handleLogout(); // Log out if unauthorized
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 font-inter">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Admin Panel – Approve Campaigns
        </h1>
        {/* NEW: Logout Button specifically for AdminCampaigns */}
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-5 py-2.5 rounded-md hover:bg-red-700 transition-colors duration-200 shadow-sm"
        >
          Logout
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-700">Loading campaigns...</p>
      ) : pendingCampaigns.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">🎉 No pending campaigns to approve.</p>
      ) : (
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingCampaigns.map((c) => (
            <div key={c._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{c.title}</h2>
              <p className="mt-2 text-gray-700 text-sm mb-3">{c.description}</p>
              <div className="text-sm text-gray-500 space-y-1">
                <p><strong>Deadline:</strong> {new Date(c.deadline).toDateString()}</p>
                <p><strong>Goal:</strong> {c.goal} {c.currency}</p>
                <p><strong>Urgency:</strong> {c.urgency}</p>
                <p><strong>Beneficiary:</strong> {c.beneficiaryInfo}</p>
                <p><strong>Wallets:</strong> {c.walletOptions && c.walletOptions.length > 0 ? c.walletOptions.join(", ") : 'N/A'}</p>
                <p><strong>Created by:</strong> {c.createdByEmail || 'Unknown User'}</p>
              </div>

              <button
                onClick={() => approveCampaign(c._id)}
                className="mt-5 w-full bg-green-600 text-white px-5 py-2.5 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm"
              >
                Approve Campaign
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Render the MessageModal component, passing state and close handler */}
      <MessageModal message={modalMessage} type={modalType} onClose={closeModal} />
    </div>
  );
};

export default AdminCampaigns;