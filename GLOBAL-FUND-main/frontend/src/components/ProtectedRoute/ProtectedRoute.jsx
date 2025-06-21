import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * ProtectedRoute component for route guarding.
 * It checks user authentication status and optionally admin status.
 *
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to render if authorized.
 * @param {boolean} [props.adminOnly=false] - If true, only allows access if the user is an admin.
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  // Retrieve user information from local storage.
  // This object is expected to contain properties like _id, name, email, isAdmin, and the authentication token.
  const userInfo = JSON.parse(localStorage.getItem('userInfo')); 

  // Determine if the user is authenticated.
  // A user is considered authenticated if 'userInfo' exists in localStorage and it contains a 'token'.
  const isAuthenticated = userInfo && userInfo.token;

  // Determine if the authenticated user has administrative privileges.
  // This checks the 'isAdmin' flag within the stored 'userInfo'.
  const isAdmin = userInfo && userInfo.isAdmin;

  // Case 1: User is not authenticated.
  // If 'isAuthenticated' is false, redirect the user to the main login page.
  // The 'replace' prop ensures that the current history entry is replaced, preventing going back to the protected page via the browser's back button.
  if (!isAuthenticated) {
    return <Navigate to="/" replace />; // Assuming your main user login route is "/"
  }

  // Case 2: Route requires admin privileges, but the user is not an admin.
  // If 'adminOnly' prop is true (meaning this route specifically needs an admin)
  // AND the 'isAdmin' flag for the current user is false, redirect them.
  // This prevents regular users (even if authenticated) from accessing admin-specific content.
  if (adminOnly && !isAdmin) {
    return <Navigate to="/home" replace />; // Redirect to a general home page or an "Access Denied" page
  }

  // Case 3: User is authenticated (and is an admin if 'adminOnly' was true).
  // In this scenario, the user is authorized to view the content.
  // If 'children' props are provided, render them directly.
  // Otherwise, render 'Outlet', which is used when ProtectedRoute acts as a parent route
  // for nested routes defined within its parent <Route> in App.jsx.
  return children ? children : <Outlet />;
};

export default ProtectedRoute;