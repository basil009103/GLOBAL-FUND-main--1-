import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
import Navbar from "../Navbar/navbar";
import LogoutButton from "../Logout/logoutbutton";
import "./HomePage.css";

const HomePage = () => {
  const [currentBg, setCurrentBg] = useState(0);
  const bgImages = ["/bg1.avif", "/bg2.jpg", "/bg3.avif"];
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % bgImages.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/api/test")
      .then((res) => res.json())
      .then((data) => console.log("Backend says:", data.message))
      .catch((err) => console.error("Connection error:", err));
  }, []);

  const handleDonateClick = () => {
    navigate("/donationcampaign");
  };

  return (
    <div className="relative w-full min-h-screen bg-white text-black">
      <Navbar />

      {/* Logout icon rendered outside navbar and fixed to page edge */}
      <div style={{ position: 'fixed', top: '12px', right: '12px', zIndex: 60 }}>
        <LogoutButton />
      </div>

      {/* Rotating Background Section */}
      <div className="relative overflow-hidden w-full h-[100vh]">
        {bgImages.map((image, index) => (
          <motion.div
            key={index}
            initial={{ x: "100%" }}
            animate={currentBg === index ? { x: "0%" } : { x: "-100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          ></motion.div>
        ))}

        <motion.div
          className="absolute inset-0 flex items-center justify-center px-6 text-black z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="flex overflow-x-auto gap-6 p-6">
            <div className="min-w-[300px] bg-white p-6 md:p-8 rounded-2xl shadow-xl text-center flex-shrink-0">
              <p className="text-lg font-medium text-gray-800 mb-6">
                "We’ve helped over <strong>1,000 people</strong> improve their lives through support, resources, and opportunities for growth."
              </p>
              <div className="relative mb-4">
                <div className="flex justify-between text-xs text-gray-400 px-1 pb-1">
                  {[10, 15, 20, 30, 40].map((num) => (
                    <span key={num}>{num}</span>
                  ))}
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-green-700 w-[25%]"></div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={handleDonateClick}
                  className="bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition"
                >
                  Donate now
                </button>
                <span className="text-sm text-gray-500">17.8k donations</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* About Section */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">About us</h2>
            <p className="text-gray-700 text-lg mb-6">
              At <span className="text-green-600 font-semibold">Global Fund Raising</span>, we are dedicated to creating meaningful change by addressing critical needs and empowering communities.
              With transparency and compassion, we’ve impacted over 10,000+ lives, striving every day to build a brighter future.
              Together, we can make a difference.
            </p>
            <Link
              to="/about"
              className="inline-block px-6 py-2 border border-gray-400 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              More about us →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {[
              { value: "20+", label: "Years of Service" },
              { value: "1,200+", label: "Lives Transformed" },
              { value: "300,000+", label: "Meals Provided" },
              { value: "1,000+", label: "Families Helped" },
            ].map((stat, idx) => (
              <div key={idx} className="bg-gray-100 p-6 rounded-xl text-center shadow">
                <p className="text-3xl font-bold text-black">{stat.value}</p>
                <p className="text-sm text-gray-600 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hero Section from Screenshot */}
      <section className="relative w-full h-screen">
        <img
          src="/HOME@.jpg" // Replace with actual image path
          alt="Child Background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 z-10"></div>

        <div className="relative z-20 flex items-center h-full px-6">
          <div className="bg-white bg-opacity-90 p-8 md:p-12 rounded-xl max-w-md">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
              Give today impact <br /> tomorrow’s future
            </h1>
            <p className="text-gray-600 mb-6"></p>
            <button
              onClick={handleDonateClick}
              className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition"
            >
              Go For Fund
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Testimonials – Empowered Communities
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-md flex items-start gap-4">
              <img
                src="/2testominal.png" // Replace with actual image later
                alt="Fatima Testimonial"
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <p className="text-gray-700 mb-2">
                  “My son received life-saving treatment through your health fund. Thank you for giving us hope.”
                </p>
                <p className="font-semibold text-gray-900">Fatima, Karachi</p>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-md flex items-start gap-4">
              <img
                src="/1testominal.png" // Replace with actual image later
                alt="Raza Testimonial"
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <p className="text-gray-700 mb-2">
                  “Thanks to the school supplies campaign, my son could return to school with pride.”
                </p>
                <p className="font-semibold text-gray-900">Raza, Quetta</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-16 text-gray-700 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="text-center md:col-span-4">
            <div className="max-w-md mx-auto">
              <p className="mb-4 text-sm text-center text-gray-600">
                Your small act can spark a lifetime of change.
                <br />Donate today and help build a better tomorrow.
              </p>
              <h4 className="font-semibold mb-4 text-center">Our social links</h4>
              <div className="flex gap-4 justify-center">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 text-white p-2 rounded-full hover:opacity-90">
                  <FaTwitter />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 text-white p-2 rounded-full hover:opacity-90">
                  <FaFacebook />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 text-white p-2 rounded-full hover:opacity-90">
                  <FaInstagram />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 text-white p-2 rounded-full hover:opacity-90">
                  <FaLinkedin />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 text-white p-2 rounded-full hover:opacity-90">
                  <FaYoutube />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t pt-6 text-center">
          <div className="overflow-hidden relative w-full mb-4">
            <div className="flex gap-8 animate-slide px-4 w-max">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-2xl font-bold text-black">
                    Global Fund Raising
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
