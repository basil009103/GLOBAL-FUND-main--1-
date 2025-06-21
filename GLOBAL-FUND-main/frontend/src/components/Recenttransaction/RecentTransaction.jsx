import React from "react";

const recentTransactions = [
  {
    id: "TXN1001",
    campaign: "Flood Relief Sindh",
    amount: "PKR 2,500",
    method: "JazzCash",
    date: "2025-06-20",
    status: "Confirmed",
  },
  {
    id: "TXN1002",
    campaign: "School Supplies Drive",
    amount: "PKR 1,000",
    method: "Stripe",
    date: "2025-06-18",
    status: "Confirmed",
  },
  {
    id: "TXN1003",
    campaign: "Clean Water Access",
    amount: "PKR 5,000",
    method: "EasyPaisa",
    date: "2025-06-16",
    status: "Pending",
  },
];

const RecentTransaction = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center py-10 px-6"
      style={{
        backgroundImage: "url('/recenttransaction.png')",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="bg-black bg-opacity-40 p-8 rounded-xl max-w-6xl mx-auto shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8">
          Recent Transactions
        </h1>

        <div className="overflow-x-auto rounded-lg">
          <table className="w-full table-auto text-left bg-white rounded-lg">
            <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
              <tr>
                <th className="p-4">Transaction ID</th>
                <th>Campaign</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {recentTransactions.map((tx, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-4 font-mono">{tx.id}</td>
                  <td>{tx.campaign}</td>
                  <td>{tx.amount}</td>
                  <td>{tx.method}</td>
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
                  <td>{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecentTransaction;
