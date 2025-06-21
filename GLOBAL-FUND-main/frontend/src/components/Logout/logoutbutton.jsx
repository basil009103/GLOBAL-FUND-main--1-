// frontend/src/components/Logout/logoutbutton.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  // Function to handle the logout process
  const handleLogout = () => {
    // Clear all user-related information from local storage
    localStorage.removeItem('userInfo');
    
    // After logging out, navigate the user back to the main login page
    navigate('/'); 
  };

  // Conditionally render the button based on the presence of user info in local storage.
  // This ensures the button only appears when a user is considered logged in.
  const userInfo = localStorage.getItem('userInfo');

  // If there's no 'userInfo' in localStorage, the user is not logged in, so don't render the button.
  if (!userInfo) {
    return null; 
  }

  // If 'userInfo' exists, render the logout button.
  return (
    <button
      onClick={handleLogout}
      className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm"
    >
      Logout
    </button>
  );
};

export default LogoutButton;