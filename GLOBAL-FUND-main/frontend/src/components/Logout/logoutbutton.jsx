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

  // If 'userInfo' exists, render the logout icon button.
  // Parent components control absolute/fixed positioning so the icon aligns with the navbar.
  return (
    <button
      onClick={handleLogout}
      aria-label="Logout"
      title="Logout"
      className="bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-black" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 4.5A1.5 1.5 0 014.5 3h6A1.5 1.5 0 0112 4.5V7a.5.5 0 01-1 0V4.5c0-.275-.225-.5-.5-.5h-6a.5.5 0 00-.5.5v11c0 .275.225.5.5.5h6c.275 0 .5-.225.5-.5V13a.5.5 0 011 0v2.5A1.5 1.5 0 0110.5 17h-6A1.5 1.5 0 013 15.5v-11z" clipRule="evenodd" />
        <path d="M15.146 8.354a.5.5 0 00-.708-.708L12.5 9.585V6.5a.5.5 0 00-1 0v5a.5.5 0 001 0V10.415l1.938 1.939a.5.5 0 00.708-.708L14.207 10l.939-.939z" />
      </svg>
    </button>
  );
};

export default LogoutButton;