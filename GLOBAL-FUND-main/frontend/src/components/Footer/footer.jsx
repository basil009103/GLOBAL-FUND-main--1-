import React from "react";
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-center py-10 mt-16 overflow-hidden">
      <p className="text-gray-600 mb-2">
        Your small act can spark a lifetime of change. <br />
        Donate today and help build a better tomorrow.
      </p>

      <p className="text-lg font-semibold mb-2">Our social links</p>

      <div className="flex justify-center space-x-5 text-2xl text-gray-700 mb-4">
        <a href="#" className="hover:text-blue-400 transition-colors duration-300">
          <FaTwitter />
        </a>
        <a href="#" className="hover:text-blue-600 transition-colors duration-300">
          <FaFacebook />
        </a>
        <a href="#" className="hover:text-pink-500 transition-colors duration-300">
          <FaInstagram />
        </a>
        <a href="#" className="hover:text-blue-700 transition-colors duration-300">
          <FaLinkedin />
        </a>
        <a href="#" className="hover:text-red-600 transition-colors duration-300">
          <FaYoutube />
        </a>
      </div>

      <hr className="my-6 border-gray-300" />

      {/* Scrolling Brand Strip */}
      <div className="whitespace-nowrap overflow-hidden">
        <div className="animate-slide inline-block text-lg font-bold text-black">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="mx-4">Global Fund Raising</span>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
