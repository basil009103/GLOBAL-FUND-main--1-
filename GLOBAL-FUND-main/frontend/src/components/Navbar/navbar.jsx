import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[1100px] flex items-center justify-between px-8 py-3 bg-white shadow-md rounded-full z-50">
      {/* Logo & Brand */}
      <div className="flex items-center space-x-3">
        <img src="/logo1.jpg" alt="Logo" className="h-10 w-10 object-contain" />
        <Link to="/home" className="text-xl font-bold text-black cursor-pointer">
          Global Fund Raising
        </Link>
      </div>

      {/* Navigation Links */}
      <ul className="flex space-x-6 text-base font-medium text-black">
        <li><Link to="/home" className="hover:text-gray-500 transition">Home</Link></li>
        <li><Link to="/about" className="hover:text-gray-500 transition">About</Link></li>
        <li><Link to="/contact" className="hover:text-gray-500 transition">Contact</Link></li>
        <li><Link to="/blog" className="hover:text-gray-500 transition">Blog</Link></li>
        <li><Link to="/security" className="hover:text-gray-500 transition">Security</Link></li> {/* ✅ New Security Link */}
        <li><Link to="/DonationCampaign" className="hover:text-gray-500 transition">Donation Campaign</Link></li>
        <Link to="/create-campaign" className="hover:text-green-600">Create Campaign</Link>

      </ul>

      {/* Go for Fund Button */}
      <button
        onClick={() => navigate("/goforfund")}
        className="px-6 py-2 bg-black text-white rounded-full text-base font-semibold hover:bg-gray-800 transition"
      >
        Go for Fund
      </button>
    </nav>
  );
};

export default Navbar;
