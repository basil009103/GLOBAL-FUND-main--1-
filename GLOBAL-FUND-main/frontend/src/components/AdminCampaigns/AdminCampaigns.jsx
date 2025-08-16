// frontend/src/components/AdminCampaigns/AdminCampaigns.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MessageModal from "../messagemodal/MessageModal.jsx";

const AdminCampaigns = () => {
  const navigate = useNavigate();

  const [pendingCampaigns, setPendingCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");

  const [activeTab, setActiveTab] = useState("pending"); // 'pending' | 'transactions'
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [txSearchQuery, setTxSearchQuery] = useState("");

  // Close modal
  const closeModal = () => {
    setModalMessage("");
    setModalType("");
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  // Fetch campaigns
  const fetchPending = async () => {
    setLoading(true);
    setModalMessage("");
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo?.token;
      if (!token) {
        navigate("/");
        return;
      }

      const res = await axios.get("http://localhost:8000/api/campaigns", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filtered = res.data.filter((c) => c.status === "pending");
      setPendingCampaigns(filtered);
    } catch (err) {
      console.error("Failed to fetch campaigns:", err);
      const message = err.response?.data?.message || err.message;
      setModalMessage(`Failed to load campaigns: ${message}`);
      setModalType("error");
      if ([401, 403].includes(err.response?.status)) handleLogout();
    } finally {
      setLoading(false);
    }
  };

  // Fetch transactions
  const fetchTransactions = async () => {
    setTransactionsLoading(true);
    setModalMessage("");
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo?.token;
      if (!token) {
        navigate("/");
        return;
      }

      const res = await axios.get("http://localhost:8000/api/donations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTransactions(res.data || []);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      const message = err.response?.data?.message || err.message;
      setModalMessage(`Failed to load transactions: ${message}`);
      setModalType("error");
      if ([401, 403].includes(err.response?.status)) handleLogout();
    } finally {
      setTransactionsLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  // Approve
  const approveCampaign = async (id) => {
    setModalMessage("");
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo?.token;
      await axios.patch(
        `http://localhost:8000/api/campaigns/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPendingCampaigns((prev) => prev.filter((c) => c._id !== id));
      setModalMessage("Campaign approved successfully!");
      setModalType("success");
    } catch (err) {
      console.error("Approval failed:", err);
      const message = err.response?.data?.message || err.message;
      setModalMessage(`Failed to approve campaign: ${message}`);
      setModalType("error");
      if ([401, 403].includes(err.response?.status)) handleLogout();
    }
  };

  // Reject
  const rejectCampaign = async (id) => {
    setModalMessage("");
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo?.token;
      await axios.patch(
        `http://localhost:8000/api/campaigns/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPendingCampaigns((prev) => prev.filter((c) => c._id !== id));
      setModalMessage("Campaign rejected successfully.");
      setModalType("success");
    } catch (err) {
      console.error("Reject failed:", err);
      const message = err.response?.data?.message || err.message;
      setModalMessage(`Failed to reject campaign: ${message}`);
      setModalType("error");
      if ([401, 403].includes(err.response?.status)) handleLogout();
    }
  };

  // Fetch transactions when tab is opened
  useEffect(() => {
    if (activeTab === "transactions") fetchTransactions();
  }, [activeTab]);

  // Filters
  const filteredPendingCampaigns = searchQuery.trim()
    ? pendingCampaigns.filter((c) => {
        const q = searchQuery.toLowerCase();
        return (
          (c.title || "").toLowerCase().includes(q) ||
          (c.beneficiaryInfo || "").toString().toLowerCase().includes(q) ||
          (c.createdByEmail || "").toLowerCase().includes(q)
        );
      })
    : pendingCampaigns;

  const filteredTransactions = txSearchQuery.trim()
    ? transactions.filter((t) => {
        const q = txSearchQuery.toLowerCase();
        return (
          (t.transactionId || "").toLowerCase().includes(q) ||
          (t.donorName || "").toLowerCase().includes(q) ||
          (t.campaignTitle || t.campaignId || "")
            .toString()
            .toLowerCase()
            .includes(q)
        );
      })
    : transactions;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-6 font-inter relative">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Admin Panel
        </h1>

        <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/admin/create-campaign')}
              className="px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700"
            >
              Create Campaign
            </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 rounded-md font-medium ${
              activeTab === "pending"
                ? "bg-black text-white"
                : "bg-white text-gray-800 border"
            }`}
          >
            Pending Campaigns
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`px-4 py-2 rounded-md font-medium ${
              activeTab === "transactions"
                ? "bg-black text-white"
                : "bg-white text-gray-800 border"
            }`}
          >
            Recent Transactions
          </button>
        </div>
      </div>

      {activeTab === "pending" ? (
        loading ? (
          <p className="text-center text-gray-700">Loading campaigns...</p>
        ) : (
          <div className="max-w-5xl mx-auto mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pending campaigns..."
              className="w-full max-w-md px-4 py-2 border rounded-md bg-white mb-4 text-gray-900 placeholder-gray-500"
            />

              

            {filteredPendingCampaigns.length === 0 ? (
              <p className="text-center text-gray-600 text-lg">
                🎉 No pending campaigns to approve.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPendingCampaigns.map((c) => (
                  <div
                    key={c._id}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {c.title}
                    </h2>
                    <p className="mt-2 text-gray-700 text-sm mb-3">
                      {c.description}
                    </p>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>
                        <strong>Deadline:</strong>{" "}
                        {c.deadline
                          ? new Date(c.deadline).toDateString()
                          : "—"}
                      </p>
                      <p>
                        <strong>Goal:</strong> {c.goal} {c.currency}
                      </p>
                      <p>
                        <strong>Urgency:</strong> {c.urgency}
                      </p>
                      <p>
                        <strong>Beneficiary:</strong>{" "}
                        {c.beneficiaryInfo || "N/A"}
                      </p>
                      <p>
                        <strong>Wallets:</strong>{" "}
                        {c.walletOptions?.length > 0
                          ? c.walletOptions.join(", ")
                          : "N/A"}
                      </p>
                      <p>
                        <strong>Phone:</strong>{" "}
                        {c.phoneNumber || "N/A"}
                      </p>
                      <p>
                        <strong>Created by:</strong>{" "}
                        {c.createdByEmail || "Unknown User"}
                      </p>
                    </div>

                    <button
                      onClick={() => approveCampaign(c._id)}
                      className="mt-5 w-full bg-green-600 text-white px-5 py-2.5 rounded-md hover:bg-green-700 transition-colors shadow-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => rejectCampaign(c._id)}
                      className="mt-3 w-full bg-red-600 text-white px-5 py-2.5 rounded-md hover:bg-red-700 transition-colors shadow-sm"
                    >
                      Reject
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      ) : (
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
          {transactionsLoading ? (
            <p className="text-center text-gray-700">Loading transactions...</p>
          ) : (
            <div>
              <div className="mb-4">
                <input
                  type="text"
                  value={txSearchQuery}
                  onChange={(e) => setTxSearchQuery(e.target.value)}
                  placeholder="Search transactions..."
                  className="w-full max-w-md px-4 py-2 border rounded-md bg-white text-gray-900 placeholder-gray-500"
                />
              </div>

              {filteredTransactions.length === 0 ? (
                <p className="text-center text-gray-600">No recent transactions found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Date
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Transaction ID
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Campaign
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Donor
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                          Amount
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Method
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTransactions.map((t) => (
                        <tr key={t._id || t.transactionId}>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {new Date(t.date || t.createdAt || Date.now()).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {t.transactionId || "—"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {t.campaignTitle || t.campaignId || "—"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {t.donorName || "Anonymous"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right font-semibold">
                            {t.currency || ""} {t.amount}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {t.method || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <MessageModal message={modalMessage} type={modalType} onClose={closeModal} />
    </div>
  );
};

export default AdminCampaigns;
