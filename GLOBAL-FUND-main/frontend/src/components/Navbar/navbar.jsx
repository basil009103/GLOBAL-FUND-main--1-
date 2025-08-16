import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = (location.pathname || "").toLowerCase();

  // hide logout on admin-login specifically
  const isAdminLogin = path === "/admin-login" || path.includes("/admin-login");

  // simple route classifiers
  const isAdmin = path.includes("/admin");
  const isDonation = path.includes("donationcampaign") || path.includes("/donate") || path.includes("/donation");
  const isRecent = path.includes("recent") || path.includes("transaction");

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  // Hooks and handlers must be declared at top-level (not inside conditionals)
  const [showCampaigns, setShowCampaigns] = useState(false);
  const [campaignsList, setCampaignsList] = useState([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [campaignSearch, setCampaignSearch] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!isAdmin) return; // only attach listeners for admin view
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowCampaigns(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAdmin]);

  const loadCampaigns = async () => {
    setLoadingCampaigns(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
      const token = userInfo.token;
      const res = await axios.get('http://localhost:8000/api/campaigns', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setCampaignsList(res.data || []);
    } catch (err) {
      console.error('Failed to load campaigns for dropdown:', err);
      setCampaignsList([]);
    } finally {
      setLoadingCampaigns(false);
    }
  };

  const handleToggleCampaigns = () => {
    const next = !showCampaigns;
    setShowCampaigns(next);
    if (next) loadCampaigns();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this campaign? This action cannot be undone.')) return;
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
      const token = userInfo.token;
      await axios.delete(`http://localhost:8000/api/campaigns/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      // remove from local list
      setCampaignsList((s) => s.filter((c) => c._id !== id));
      alert('Campaign deleted');
    } catch (err) {
      console.error('Failed to delete campaign:', err);
      alert('Failed to delete campaign');
    }
  };

  // Hide entire navbar on the admin-login page
  if (isAdminLogin) {
    return null;
  }

  // Compact admin navbar
  if (isAdmin) {
    return (
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[1100px] flex items-center justify-between px-6 py-3 bg-black text-white rounded-full z-50 shadow-md">
        <div className="flex items-center space-x-3">
          <img src="/logo1.jpg" alt="Logo" className="h-8 w-8 object-contain" />
          <span className="text-lg font-semibold">Admin Panel</span>
        </div>

        <div className="flex items-center space-x-4 text-sm">
          {/* Campaign list button (opens modal) */}
          <div className="relative">
            <button onClick={handleToggleCampaigns} className="px-3 py-1 bg-white/10 rounded-md text-sm">Campaign List</button>

            {showCampaigns && (
              // full panel centered
              <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
                <div className="bg-white text-black w-full max-w-3xl rounded-lg shadow-lg overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="text-sm font-semibold">Campaigns</div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setShowCampaigns(false); }} className="text-sm px-3 py-1 rounded bg-gray-100">Close</button>
                    </div>
                  </div>

                  <div className="p-4 border-b">
                    <input
                      type="text"
                      value={campaignSearch}
                      onChange={(e) => setCampaignSearch(e.target.value)}
                      placeholder="Search campaigns..."
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>

                  <div className="max-h-80 overflow-auto">
                    {loadingCampaigns ? (
                      <div className="p-4">Loading...</div>
                    ) : campaignsList.length === 0 ? (
                      <div className="p-4 text-sm text-gray-600">No campaigns found.</div>
                    ) : (
                      campaignsList
                        .filter((c) => {
                          const q = (campaignSearch || '').toLowerCase();
                          if (!q) return true;
                          return (
                            (c.title || '').toLowerCase().includes(q) ||
                            (c.createdByEmail || '').toLowerCase().includes(q) ||
                            (c.beneficiaryInfo || '').toLowerCase().includes(q)
                          );
                        })
                        .map((c) => (
                        <div key={c._id} className="flex items-start justify-between gap-2 p-4 border-b">
                          <div className="flex-1">
                            <div className="text-sm font-medium">{c.title}</div>
                            <div className="text-xs text-gray-500">{c.currency} • {new Date(c.deadline).toLocaleDateString()}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => navigate(`/donate/${c._id}`, { state: c })} className="text-xs px-2 py-1 bg-green-600 text-white rounded">Open</button>
                            <button onClick={() => handleDelete(c._id)} className="text-xs px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <li>
            <button onClick={handleLogout} className="bg-white text-black px-3 py-1 rounded-full">Logout</button>
          </li>
        </div>
      </nav>
    );
  }

  // Compact donation campaign navbar (shows back button and optional title)
  if (isDonation) {
    const title = location.state?.title || 'Donation Campaign';
    return (
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[1100px] flex items-center justify-between px-6 py-3 bg-white shadow-md rounded-full z-50">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate(-1)} className="mr-2 text-gray-700">← Back</button>
          <img src="/logo1.jpg" alt="Logo" className="h-8 w-8 object-contain" />
          <span className="text-lg font-semibold text-black">{title}</span>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/home" className="text-sm text-gray-600 hover:text-gray-800">Home</Link>
        </div>
      </nav>
    );
  }

  // Recent donations navbar
  if (isRecent) {
    return (
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[1100px] flex items-center justify-between px-8 py-3 bg-white shadow-md rounded-full z-50">
        <div className="flex items-center space-x-3">
          <img src="/logo1.jpg" alt="Logo" className="h-10 w-10 object-contain" />
          <span className="text-xl font-bold text-black">Global Fund Raising</span>
          <span className="ml-4 text-sm text-gray-500">Recent Donations</span>
        </div>

        <div className="flex items-center space-x-6 text-base font-medium text-black">
          <Link to="/home" className="hover:text-gray-500 transition">Home</Link>
          <Link to="/donationcampaign" className="hover:text-gray-500 transition">Donation Campaign</Link>
          <button onClick={handleLogout} className="px-4 py-2 bg-black text-white rounded-full">Logout</button>
        </div>
      </nav>
    );
  }

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
        <li>
          <Link to="/home" className="hover:text-gray-500 transition">
            Home
          </Link>
        </li>
        <li>
          <Link to="/about" className="hover:text-gray-500 transition">
            About
          </Link>
        </li>
        <li>
          <Link to="/contact" className="hover:text-gray-500 transition">
            Contact
          </Link>
        </li>
        <li>
          <Link to="/blog" className="hover:text-gray-500 transition">
            Blog
          </Link>
        </li>
        <li>
          <Link to="/security" className="hover:text-gray-500 transition">
            Security
          </Link>
        </li>
        <li>
          <Link to="/DonationCampaign" className="hover:text-gray-500 transition">
            Donation Campaign
          </Link>
        </li>
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
