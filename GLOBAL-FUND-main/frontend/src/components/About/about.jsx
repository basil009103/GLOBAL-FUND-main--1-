import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../Navbar/navbar";
import Footer from "../Footer/footer.jsx";
import { Link } from "react-router-dom";

const About = () => {
  const [showFirstImage, setShowFirstImage] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const interval = setInterval(() => {
      setShowFirstImage((prev) => !prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col bg-gray-100 text-gray-900 pt-20">
      <Navbar />

      {/* About Section */}
      <section className="flex flex-row justify-between px-6 py-10 items-center">
        <div className="w-2/3 pr-6">
          <motion.h2
            className="text-5xl font-extrabold text-left mb-3"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            Giving Made Simple, Impact Made Real
          </motion.h2>

          <motion.p
            className="max-w-2xl text-lg text-justify leading-relaxed"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          >
            At <strong>Global Fund Raising</strong>, we believe in the power of collective giving. Our mission is to
            connect people around the world to support life-changing causes, from disaster relief to education and
            healthcare initiatives.
          </motion.p>

          <div className="relative mt-3 w-[85%] h-[50vh] overflow-hidden">
            <motion.img
              key={showFirstImage ? "abt1" : "abt2"}
              src={showFirstImage ? "/abt1.avif" : "/abt2.webp"}
              alt="Sliding Image"
              className="absolute w-full h-full rounded-lg shadow-lg object-cover"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          </div>
        </div>

        <motion.div
          className="w-1/3 flex justify-start ml-2"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
        >
          <img
            src="/abt3.avif"
            alt="About Image 3"
            className="w-[85%] h-[80vh] rounded-lg shadow-lg object-cover"
          />
        </motion.div>
      </section>

      {/* Values Section */}
      <motion.section
        className="py-20 px-6 bg-white text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-extrabold mb-6">Building Trust Through Shared Values</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
          Our principles define who we are. We are committed to integrity, innovation, and transparency in all our endeavors.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            { title: "Integrity", text: "We uphold the highest ethical standards in all we do.", icon: "🤝" },
            { title: "Innovation", text: "We seek creative solutions to global challenges.", icon: "💡" },
            { title: "Transparency", text: "We ensure complete accountability and openness.", icon: "🔍" },
            { title: "Excellence", text: "We strive for the best in every aspect of our mission.", icon: "🌟" },
            { title: "Collaboration", text: "We work together to create lasting change.", icon: "🤝" },
            { title: "Empowerment", text: "We empower communities to achieve sustainable success.", icon: "⚡" },
          ].map((value, index) => (
            <motion.div
              key={index}
              className="p-6 bg-gray-100 rounded-lg shadow-md"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-5xl mb-4">{value.icon}</div>
              <h3 className="text-2xl font-bold">{value.title}</h3>
              <p className="text-gray-600 mt-2">{value.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Empowering Lives Section */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Empowering lives through your help
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            VOLUNTEER
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                name: "Basil",
                role: "Community Outreach Specialist",
                img: "/v1.jpg",
              },
              {
                name: "Usman",
                role: "Fundraising Coordinator",
                img: "/v2.jpg",
              },
              {
                name: "Habib",
                role: "Program Manager",
                img: "/V3.jpg",
              },
            ].map((volunteer, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl overflow-hidden shadow-md text-center"
              >
                <img
                  src={volunteer.img}
                  alt={volunteer.name}
                  className="w-full h-80 object-cover transform scale-90"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {volunteer.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{volunteer.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
