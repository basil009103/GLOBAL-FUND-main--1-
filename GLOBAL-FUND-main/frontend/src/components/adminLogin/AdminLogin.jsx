import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MessageModal from '../messagemodal/MessageModal.jsx'; // Import the MessageModal component

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState(''); // 'success' or 'error'
  const navigate = useNavigate();

  // Function to handle the form submission for admin login
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true); // Set loading state to true
    setModalMessage(''); // Clear any previous modal messages

    try {
      // Make a POST request to your backend's admin login endpoint
      const res = await axios.post('http://localhost:8000/api/admin/login', { email, password });
      
  // Store the user information (including isAdmin and the token) in localStorage
  localStorage.setItem('userInfo', JSON.stringify(res.data));
  // Dispatch a custom event so App updates userInfo immediately without a full reload
  window.dispatchEvent(new Event('user-info-changed'));

  // Immediately navigate to admin campaigns (no success modal)
  navigate('/admin-campaigns');

    } catch (error) {
      // Handle login errors
      const message = error.response && error.response.data.message
        ? error.response.data.message // Get specific message from backend error response
        : error.message; // Fallback to general error message
      setModalMessage(`Login failed: ${message}`); // Set error message for modal
      setModalType('error'); // Set modal type to error
      console.error('Admin Login Error:', error); // Log the full error for debugging
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Function to close the message modal
  const closeModal = () => {
    setModalMessage('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-inter pt-16">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Logging In...' : 'Login as Admin'}
          </button>
        </form>
      </div>

      {/* Render the MessageModal component, passing state and close handler */}
      <MessageModal message={modalMessage} type={modalType} onClose={closeModal} />
    </div>
  );
};

export default AdminLogin;