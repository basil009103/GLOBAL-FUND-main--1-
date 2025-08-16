import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"; 

// Import all your components
import Login from "./components/Login/login"; 
import HomePage from "./components/Home/home";
import About from "./components/About/about";
import Contact from "./components/contact/contact";
import GoForFund from "./components/GoForFund/goforfund";
import Blog from "./components/blog/blog.jsx";
import DonationCampaign from "./components/DonationCampaign/DonationCampaign.jsx";
import DonatePage from "./components/DonatePage/DonatePage.jsx";
import SecurityPage from "./components/SecurityPage/securitypage.jsx";

import TrackPayment from "./components/Trackpayment/trackpayment.jsx";
import RecentTransaction from "./components/Recenttransaction/RecentTransaction.jsx";
import CreateCampaign from "./components/CreateCampaign/CreateCampaign.jsx";

// IMPORTS FOR ADMIN & PROTECTION
import AdminCampaigns from "./components/AdminCampaigns/AdminCampaigns.jsx";
import AdminCreateCampaign from "./components/AdminCreateCampaign/AdminCreateCampaign.jsx";
import AdminLogin from "./components/adminLogin/AdminLogin.jsx"; 
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx"; 

// NEW: Import your Navbar component
import Navbar from "./components/Navbar/navbar"; 

function App() {
  // userInfo state (managed here as parent of Navbar and other components)
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    } else {
      setUserInfo(null); // Explicitly set to null if nothing in localStorage
    }

    const handleStorageChange = (e) => {
      if (e.key === 'userInfo') { // Only react to changes in 'userInfo'
        const updatedUserInfo = localStorage.getItem('userInfo');
        setUserInfo(updatedUserInfo ? JSON.parse(updatedUserInfo) : null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Listen for storage changes and a custom 'user-info-changed' event so the app updates immediately after login/logout
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'userInfo') { // Only react to changes in 'userInfo'
        const updatedUserInfo = localStorage.getItem('userInfo');
        setUserInfo(updatedUserInfo ? JSON.parse(updatedUserInfo) : null);
      }
    };

    const handleUserInfoChanged = () => {
      const updatedUserInfo = localStorage.getItem('userInfo');
      setUserInfo(updatedUserInfo ? JSON.parse(updatedUserInfo) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('user-info-changed', handleUserInfoChanged);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('user-info-changed', handleUserInfoChanged);
    };
  }, []);

  // Derive isAuthenticated and isAdmin based on the current userInfo state
  const isAuthenticated = userInfo && userInfo.token; // True if any user is logged in (has a token)
  const isAdmin = userInfo && userInfo.isAdmin;       // True if logged-in user is an admin (has token AND isAdmin: true)

  return (
    <Router>
      {/* Render Navbar via a small inner component that uses useLocation.
          This ensures App will re-render the Navbar when the route changes
          (useLocation updates on navigation). We still hide the Navbar on
          the explicit /admin-login path. */}
      {
        (() => {
          const NavbarRenderer = () => {
            const location = useLocation();
            return location.pathname !== '/admin-login' ? <Navbar /> : null;
          };
          return <NavbarRenderer />;
        })()
      }

      <div>
        <Routes>
          {/* Public Login Routes (Navbar should NOT appear on these pages) */}
          <Route path="/" element={<Login />} /> 
          <Route path="/login" element={<Login />} /> 
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Public Content Routes (Accessible to all, but Navbar appears only if logged in) */}
          {/* These pages should NOT render Navbar or Footer internally, as App.jsx handles it */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/goforfund" element={<GoForFund />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/security" element={<SecurityPage />} />

          {/* Protected Routes - These pages require ANY user to be authenticated (logged in) */}
          {/* If not authenticated, ProtectedRoute will redirect to /login */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/DonationCampaign" 
            element={
              <ProtectedRoute>
                <DonationCampaign />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/donate/:id" 
            element={
              <ProtectedRoute>
                <DonatePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/track-payment" 
            element={
              <ProtectedRoute>
                <TrackPayment />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/recent-transaction" 
            element={
              <ProtectedRoute>
                <RecentTransaction />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-campaign" 
            element={
              <ProtectedRoute>
                <CreateCampaign />
              </ProtectedRoute>
            } 
          />

          {/* Protected Admin Route - This page requires an authenticated user AND that user must have isAdmin: true.
              If not an admin, ProtectedRoute will redirect to /home (or another appropriate page). */}
          <Route
            path="/admin-campaigns" // This is the route for the admin panel with the list
            element={
              <ProtectedRoute adminOnly={true}> 
                <AdminCampaigns />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/create-campaign"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminCreateCampaign />
              </ProtectedRoute>
            }
          />

          {/* Fallback route - If no other route matches the URL, redirect to the main user login page. */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
