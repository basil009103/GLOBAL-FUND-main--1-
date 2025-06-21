import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DonatePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const campaignCurrency = location.state?.currency || "PKR";
  const campaignId = location.state?._id || id;
  const isUSD = campaignCurrency === "USD";

  const presetValues = isUSD ? [50, 100, 200] : [15000, 30000, 50000];
  const currencySymbol = isUSD ? "$" : "Rs.";
  const walletOptions = isUSD
    ? ["Wise", "Stripe", "Western Union"]
    : ["JazzCash", "EasyPaisa"];

  const [amount, setAmount] = useState();
  const [custom, setCustom] = useState("");
  const [showCardForm, setShowCardForm] = useState(false);
  const [showWalletForm, setShowWalletForm] = useState(false);
  const [walletMethod, setWalletMethod] = useState(walletOptions[0]);
  const [walletDetails, setWalletDetails] = useState({ phone: "", amount: "" });
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", Nameonthecard: "" });
  const [showReceipt, setShowReceipt] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [deductedAmount, setDeductedAmount] = useState(0);

  const handleAmountClick = (val) => {
    setAmount(val);
    setCustom("");
  };

  const generateTransactionId = () => Math.random().toString(36).substring(2, 10).toUpperCase();

  const updateStaticCampaign = (donationAmount) => {
    const key = isUSD ? "internationalCampaigns" : "domesticCampaigns";
    const campaigns = JSON.parse(localStorage.getItem(key)) || [];
    const updated = campaigns.map((c) =>
      c._id === campaignId ? { ...c, goal: c.goal - donationAmount } : c
    );
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const donationAmount = Number(custom || amount || walletDetails.amount);

    const cardNumberRegex = /^\d{16}$/;
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const cvcRegex = /^\d{3}$/;
    const nameRegex = /^[A-Za-z ]+$/;
    const phoneRegex = /^\d{11}$/;

    if (showCardForm) {
      if (!cardNumberRegex.test(card.number)) return toast.error("Card must be 16 digits");
      if (!expiryRegex.test(card.expiry)) return toast.error("Use MM/YY format");
      if (!cvcRegex.test(card.cvc)) return toast.error("CVC must be 3 digits");
      if (!nameRegex.test(card.Nameonthecard)) return toast.error("Only alphabets allowed");
    }

    if (showWalletForm && !phoneRegex.test(walletDetails.phone)) {
      return toast.error("Phone must be 11 digits");
    }

    const txId = generateTransactionId();
    setTransactionId(txId);
    setShowReceipt(true);
    setDeductedAmount(donationAmount);
    updateStaticCampaign(donationAmount);

    const receipt = {
      transactionId: txId,
      campaignId,
      amount: donationAmount,
      date: new Date().toLocaleString(),
    };

    const existing = JSON.parse(localStorage.getItem("donationReceipts")) || [];
    localStorage.setItem("donationReceipts", JSON.stringify([receipt, ...existing]));

    toast.success("Donation successful!");
  };

  const handleDownloadReceipt = () => {
    const receiptText = `
Donation Receipt
-------------------------
Campaign ID: ${campaignId}
Transaction ID: ${transactionId}
Amount: ${currencySymbol}${deductedAmount}
Date: ${new Date().toLocaleString()}
    `.trim();

    const blob = new Blob([receiptText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `DonationReceipt_${transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="min-h-screen py-12 px-6 flex flex-col items-center bg-cover bg-no-repeat"
      style={{ backgroundImage: `url("/donationPage.jpg")` }}
    >
      <ToastContainer />
      <h1 className="text-4xl font-semibold text-center text-white mb-6">Donate Now</h1>

      <div className="max-w-xl w-full bg-white p-6 rounded-lg shadow-md">
        <div className="text-center mb-4">
          <input
            type="text"
            className="text-3xl font-semibold text-center bg-gray-800 text-white py-2 w-full rounded-md" /* Changed text-black to text-white and added rounded-md */
            value={custom || amount}
            onChange={(e) => setCustom(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {presetValues.map((val) => (
            <button
              key={val}
              onClick={() => handleAmountClick(val)}
              className={`py-2 border rounded-md font-semibold text-sm ${
                amount === val && !custom
                  ? "bg-black border-black text-white" // Ensure text is white when selected
                  : "border-gray-300 text-gray-800 bg-white hover:bg-gray-100" // Ensure text is dark when not selected
              }`}
            >
              {currencySymbol}{val}
            </button>
          ))}
          <button
            onClick={() => {
              setAmount(0);
              setCustom("");
            }}
            className="py-2 border border-gray-600 bg-gray-800 text-white rounded-md font-semibold text-sm hover:bg-gray-700" /* Added hover effect */
          >
            OTHER
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <button
            type="button"
            onClick={() => {
              setShowCardForm(!showCardForm);
              setShowWalletForm(false);
            }}
            className="bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition"
          >
            GIVE BY CARD
          </button>
          <button
            type="button"
            onClick={() => {
              setShowWalletForm(!showWalletForm);
              setShowCardForm(false);
            }}
            className="bg-green-500 text-white py-2 rounded-md font-semibold hover:bg-green-600"
          >
            Wallet
          </button>
        </div>

        {showCardForm && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              required
              placeholder="Card Number"
              maxLength="16"
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" /* Added focus styles */
              value={card.number}
              onChange={(e) => setCard({ ...card, number: e.target.value.replace(/\D/g, "") })}
            />
            <div className="flex space-x-4">
              <input
                type="text"
                required
                placeholder="MM/YY"
                maxLength="5"
                className="w-1/2 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" /* Added focus styles */
                value={card.expiry}
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, "");
                  if (val.length >= 3) val = val.slice(0, 2) + "/" + val.slice(2, 4);
                  setCard({ ...card, expiry: val });
                }}
              />
              <input
                type="text"
                required
                placeholder="CVC"
                maxLength="3"
                className="w-1/2 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" /* Added focus styles */
                value={card.cvc}
                onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "") })}
              />
            </div>
            <input
              type="text"
              required
              placeholder="Name on Card"
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" /* Added focus styles */
              value={card.Nameonthecard}
              onChange={(e) => setCard({ ...card, Nameonthecard: e.target.value })}
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition"
            >
              Confirm Donation
            </button>
          </form>
        )}

        {showWalletForm && (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <select
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" /* Added focus styles */
              value={walletMethod}
              onChange={(e) => setWalletMethod(e.target.value)}
            >
              {walletOptions.map((method) => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
            <input
              type="tel"
              required
              placeholder="03XXXXXXXXX"
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" /* Added focus styles */
              value={walletDetails.phone}
              onChange={(e) => setWalletDetails({ ...walletDetails, phone: e.target.value })}
            />
            <input
              type="number"
              required
              placeholder="Amount"
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" /* Added focus styles */
              value={walletDetails.amount}
              onChange={(e) => setWalletDetails({ ...walletDetails, amount: e.target.value })}
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-md font-semibold hover:bg-green-600"
            >
              Confirm Wallet Donation
            </button>
          </form>
        )}
      </div>

      {showReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-green-700 mb-4">🎉 Donation Confirmed!</h2>
            <p className="mb-2">Thank you for your support.</p>
            <p className="text-sm text-gray-700">
              <strong>Transaction Amount:</strong> {currencySymbol}{deductedAmount}
            </p>
            <p className="text-sm text-gray-700"><strong>Campaign ID:</strong> {campaignId}</p>
            <p className="text-sm text-gray-700"><strong>Transaction ID:</strong> {transactionId}</p>
            <button
              onClick={handleDownloadReceipt}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Download Receipt
            </button>
            <button
              onClick={() =>
                navigate("/donationcampaign", {
                  state: { campaignId, currency: campaignCurrency },
                })
              }
              className="mt-4 w-full bg-gray-800 text-white py-2 rounded-md hover:bg-black transition"
            >
              Back to Campaign
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonatePage;