import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MessageModal from "../messagemodal/MessageModal.jsx";

const AdminCreateCampaign = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [currency, setCurrency] = useState("PKR");
  const [deadline, setDeadline] = useState("");
  const [urgency, setUrgency] = useState("medium");
  const [beneficiary, setBeneficiary] = useState("");
  const [wallets, setWallets] = useState("");
  const [walletOptions, setWalletOptions] = useState([]);
  const [phone, setPhone] = useState("");

  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalMessage("");

    if (!title.trim() || !goal) {
      setModalMessage("Title and goal are required");
      setModalType("error");
      return;
    }

    try {
      setSubmitting(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo?.token;
      if (!token) {
        navigate("/");
        return;
      }

      // Client-side validation for phone
      if (!phone || !/^\d{11}$/.test(String(phone))) {
        setModalMessage("Please enter a valid 11-digit phone number (e.g. 03001234567).");
        setModalType("error");
        setSubmitting(false);
        return;
      }

    const payload = {
        title: title.trim(),
        description: description.trim(),
        goal: Number(goal) || 0,
        currency: currency || "PKR",
        deadline: deadline || null,
        urgency: (urgency || "medium").toLowerCase(),
        beneficiaryInfo: beneficiary.trim(),
  walletOptions: walletOptions,
  phoneNumber: String(phone),
      };

      const res = await axios.post("http://localhost:8000/api/campaigns", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setModalMessage("Campaign created successfully.");
      setModalType("success");
      // navigate back to admin list so admin can see pending items
      setTimeout(() => navigate("/admin-campaigns"), 800);
    } catch (err) {
      console.error("Create campaign failed:", err);
      const message = err.response?.data?.message || err.message;
      setModalMessage(`Failed to create campaign: ${message}`);
      setModalType("error");
    } finally {
      setSubmitting(false);
    }
  };

return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-6 font-inter relative">
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-md shadow">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/admin-campaigns')}
          className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-md hover:bg-gray-200"
        >
          ← Back
        </button>
        <h1
          onClick={() => navigate('/admin-campaigns')}
          className="text-2xl font-bold text-black cursor-pointer"
          title="Go to Admin Panel"
        >
          Create Campaign (Admin)
        </h1>
        <div style={{ width: 48 }} />
      </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    className="w-full px-3 py-2 border rounded-md bg-white text-black placeholder-gray-500"
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    className="w-full px-3 py-2 border rounded-md bg-white text-black placeholder-gray-500"
                    rows={5}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                        type="number"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="Goal"
                        className="w-full px-3 py-2 border rounded-md bg-white text-black placeholder-gray-500"
                    />
          <select value={currency} onChange={(e) => {
            const v = e.target.value;
            setCurrency(v);
            const allowed = v === 'USD' ? ['Wise','Stripe','Card'] : ['JazzCash','EasyPaisa','Card'];
            setWalletOptions((prev) => prev.filter((opt) => allowed.includes(opt)));
          }} className="w-full px-3 py-2 border rounded-md bg-white text-black">
            <option>PKR</option>
            <option>USD</option>
          </select>
                    <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full px-3 py-2 border rounded-md bg-white text-black" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <select value={urgency} onChange={(e) => setUrgency(e.target.value)} className="w-full px-3 py-2 border rounded-md bg-white text-black">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>
                    <input type="text" value={beneficiary} onChange={(e) => setBeneficiary(e.target.value)} placeholder="Beneficiary info" className="w-full px-3 py-2 border rounded-md bg-white text-black placeholder-gray-500" />
                </div>

        {/* Wallet options depend on selected currency */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">Wallet Options</label>
          <div className="flex flex-wrap gap-3">
            {(currency === 'USD' ? ['Wise','Stripe','Card'] : ['JazzCash','EasyPaisa','Card']).map((w) => (
              <label key={w} className="flex items-center gap-2 text-gray-700">
                <input
                  type="checkbox"
                  value={w}
                  checked={walletOptions.includes(w)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setWalletOptions((prev) => checked ? [...prev, w] : prev.filter((x) => x !== w));
                  }}
                  className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                {w}
              </label>
            ))}
          </div>
        </div>

                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (11 digits)" className="w-full px-3 py-2 border rounded-md bg-white text-black placeholder-gray-500 mt-2" />
                <p className="text-xs text-gray-500">Enter 11 digits, e.g., 03001234567</p>

                <div className="flex items-center space-x-3">
                    <button type="submit" disabled={submitting} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                        {submitting ? "Creating..." : "Create"}
                    </button>
                    <button type="button" onClick={() => navigate('/admin-campaigns')} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                </div>
            </form>
        </div>

        <MessageModal message={modalMessage} type={modalType} onClose={() => { setModalMessage(''); setModalType(''); }} />
    </div>
);
};

export default AdminCreateCampaign;
