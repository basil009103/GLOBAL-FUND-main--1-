import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/navbar";

const GoForFund = () => {
  const navigate = useNavigate();

  const handleDonateClick = () => {
    navigate("/donationcampaign");
  };

  const handleTrackPaymentClick = () => {
    navigate("/track-payment");
  };

  const handleRecentTransactionClick = () => {
    navigate("/recent-transaction");
  };

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center text-white flex flex-col"
      style={{
        backgroundImage: "url('/goforfund.jpg')",
      }}
    >
      <Navbar />

      <div className="w-full flex-grow flex flex-col items-center justify-center backdrop-brightness-75">
        <h1 className="text-4xl font-bold mb-2">Go For Fund</h1>
        <p className="text-lg mb-4">Choose your option:</p>

        <div className="mt-4 flex items-center justify-center gap-x-10 flex-wrap">
          <button
            onClick={handleDonateClick}
            className="w-48 h-14 bg-black bg-opacity-80 text-white text-lg font-semibold rounded-lg hover:bg-opacity-100 transition"
          >
            Donate Now
          </button>

          <button
            onClick={handleTrackPaymentClick}
            className="w-48 h-14 bg-black bg-opacity-80 text-white text-lg font-semibold rounded-lg hover:bg-opacity-100 transition"
          >
            Track Payment
          </button>

          <button
            onClick={handleRecentTransactionClick}
            className="w-48 h-14 bg-black bg-opacity-80 text-white text-lg font-semibold rounded-lg hover:bg-opacity-100 transition"
          >
            Recent Transaction
          </button>
        </div>
      </div>

      <footer className="bg-black bg-opacity-70 text-center py-2 text-gray-300 text-sm">
        © 2025 Global Fund Raising | Empowering Communities Together
      </footer>
    </div>
  );
};

export default GoForFund;
