import React, { useState, useEffect } from "react";
import axios from 'axios';

const dummyTransactions = [
  {
    id: "TXN0123",
    donor: "Fatima Ali",
    amount: "PKR 5000",
    campaign: "Flood Relief Sindh",
    date: "2025-06-21",
    status: "Confirmed",
    method: "JazzCash",
  },
  {
    id: "TXN0124",
    donor: "Ahmed Raza",
    amount: "PKR 1500",
    campaign: "School Supplies Drive",
    date: "2025-06-20",
    status: "Pending",
    method: "Stripe",
  },
];

const TrackPayment = () => {
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState(dummyTransactions);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
        const res = await axios.get('http://localhost:8000/api/donations', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        // Map backend donations to table-friendly format
        const mapped = res.data.map(d => ({
          id: d.transactionId,
          donor: d.donorName || 'Anonymous',
          amount: `${d.currency} ${d.amount}`,
          campaign: d.campaignId, // you may fetch campaign title separately if needed
          date: new Date(d.date).toISOString().split('T')[0],
          status: 'Confirmed',
          method: d.method,
        }));
        setTransactions(mapped);
      } catch (err) {
        console.error('Failed to fetch donations, using fallback:', err);
        setTransactions(dummyTransactions);
      }
    };
    fetchDonations();
  }, []);

  const filtered = dummyTransactions.filter(
    (t) =>
      t.id.includes(search) ||
      t.donor.toLowerCase().includes(search.toLowerCase())
  );
  const results = transactions.filter(
    (t) => t.id.includes(search) || t.donor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white py-10 px-6"
      style={{ backgroundImage: "url('/tracking.avif')" }} // ✅ Background from public
    >
      <div className="backdrop-brightness-75 py-10 px-4 rounded-xl">
        <h1 className="text-4xl font-bold text-center mb-6">Track Your Donation</h1>

        <div className="max-w-4xl mx-auto">
          <input
            type="text"
            placeholder="Enter Transaction ID or Donor Name"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring focus:ring-green-500 mb-6"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="overflow-x-auto bg-white rounded-xl shadow text-black">
            <table className="w-full table-auto text-left">
              <thead className="bg-gray-100 text-sm text-gray-600 uppercase">
                <tr>
                  <th className="p-4">Transaction ID</th>
                  <th>Donor</th>
                  <th>Amount</th>
                  <th>Campaign</th>
                  <th>Status</th>
                  <th>Method</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {results.length ? (
                  results.map((tx, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-4 font-mono">{tx.id}</td>
                      <td>{tx.donor}</td>
                      <td>{tx.amount}</td>
                      <td>{tx.campaign}</td>
                      <td>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            tx.status === "Confirmed"
                              ? "bg-green-100 text-green-700"
                              : tx.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td>{tx.method}</td>
                      <td>{tx.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackPayment;
