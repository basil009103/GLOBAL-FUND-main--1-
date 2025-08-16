import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/navbar";
import Footer from "../Footer/footer.jsx"; // ✅ Import footer

const SecurityPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar />

      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8 pt-28">
        <h1 className="text-4xl font-bold text-green-700 mb-6">Payment Security</h1>

        <p className="mb-4 text-gray-700">
          At <strong>Global Fund</strong>, your trust is our top priority. We are committed to keeping your payment
          information safe through robust security measures and industry best practices.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-2">🔐 End-to-End Encryption</h2>
        <p className="mb-4 text-gray-700">
          All payment data is encrypted using TLS (Transport Layer Security), ensuring your sensitive information
          travels securely between your browser and our servers.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-2">💳 PCI-DSS Compliance</h2>
        <p className="mb-4 text-gray-700">
          Our payment processing partners are fully PCI-DSS compliant. That means your card data is never stored on our
          servers and is handled by certified providers like Stripe or PayPal.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-2">🛡️ Fraud Detection</h2>
        <p className="mb-4 text-gray-700">
          Our systems are protected with real-time fraud monitoring and automatic alerts for suspicious activity. Every
          transaction is verified and logged.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-2">🔒 Data Privacy</h2>
        <p className="mb-4 text-gray-700">
          We follow strict data privacy protocols. Your personal data is never shared or sold. You can read more in our{" "}
          <Link to="/privacy-policy" className="text-green-600 underline">
            Privacy Policy
          </Link>
          .
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-2">🧾 Secure Donation Records</h2>
        <p className="mb-4 text-gray-700">
          All donations and transactions are logged securely and accessible only to you via your authenticated account.
        </p>

        <div className="mt-8">
          <Link
            to="/home"
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>

      <Footer /> {/* ✅ Footer added */}
    </div>
  );
};

export default SecurityPage;
