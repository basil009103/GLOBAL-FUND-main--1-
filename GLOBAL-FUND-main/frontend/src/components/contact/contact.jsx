import React, { useState } from "react";
import Navbar from "../Navbar/navbar";
import Footer from "../Footer/footer.jsx";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const faqs = [
  { question: "What is the mission of your charity?", answer: "Our mission is to support global fundraising initiatives by connecting donors with impactful projects and causes." },
  { question: "Who benefits from your programs?", answer: "Our programs benefit individuals and communities in need, including education, healthcare, disaster relief, and more." },
  { question: "Can I make a recurring donation?", answer: "Yes, you can set up a recurring donation to continuously support the causes you care about." },
  { question: "Can I visit the projects I support?", answer: "Absolutely! We encourage donors to visit and see the impact of their contributions firsthand." },
  { question: "How do you maintain accountability?", answer: "We ensure transparency by providing detailed reports and updates on how donations are used." },
  { question: "How can I make a donation?", answer: "You can donate via our website using credit card, PayPal, or bank transfer." },
  { question: "Are donations tax-deductible?", answer: "Yes, all donations are tax-deductible as per applicable laws." },
  { question: "How can I get involved?", answer: "You can volunteer, donate, or spread the word about our fundraising initiatives!" }
];

const Contact = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const phoneRegex = /^\d{11}$/;

    if (!phoneRegex.test(phone)) {
      toast.error("Phone number must be exactly 11 digits and numeric only.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    toast.success("Thank you for your review!", {
      position: "top-center",
      autoClose: 3000,
    });

    // ✅ Clear form
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
  };

  return (
    <div className="bg-white min-h-screen text-gray-900 relative flex flex-col">
      <Navbar />
      <ToastContainer />

      

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center flex-grow">
        <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1 }}>
          <h1 className="text-5xl font-bold text-black mb-6 leading-tight">Get in touch, how can we help?</h1>
          <p className="text-lg text-gray-600 mb-6">
            At <strong>Global Fund Raising</strong>, we are dedicated to creating meaningful change by addressing critical needs and empowering communities.
          </p>
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} className="flex gap-4">
            <a href="mailto:basilmalik153@gmail.com" className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700">
              📧 basilmalik153@gmail.com
            </a>
            <a href="tel:+92224024505" className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700">
              📞 +92 224 024505
            </a>
          </motion.div>
        </motion.div>

        {/* Contact Form */}
        <motion.div className="bg-gray-100 p-8 rounded-xl shadow-md" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1 }}>
          <form onSubmit={handleSubmit}>
            <label className="block text-gray-700 font-semibold">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 bg-gray-800 text-white placeholder-gray-400"
              placeholder="Your Name"
            />

            <label className="block text-gray-700 font-semibold">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 bg-gray-800 text-white placeholder-gray-400"
              placeholder="Your Email"
            />

            <label className="block text-gray-700 font-semibold">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 bg-gray-800 text-white placeholder-gray-400"
              placeholder="Your Phone Number"
            />

            <label className="block text-gray-700 font-semibold">Leave Us a Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 bg-gray-800 text-white placeholder-gray-400"
              placeholder="Write your message here..."
            ></textarea>

            <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900">
              Submit Now
            </button>
          </form>
        </motion.div>
      </div>

      {/* FAQ Section */}
      <motion.section className="py-20 px-6 bg-gray-100 text-center" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }} viewport={{ once: true }}>
        <h2 className="text-4xl font-extrabold mb-6">Frequently Asked Questions</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
          Have questions? We have answers. Explore our frequently asked questions below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div key={index} className="bg-white p-4 rounded-lg shadow-md cursor-pointer" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }} onClick={() => toggleFAQ(index)}>
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">{faq.question}</h3>
<span className="text-2xl">
  {openIndex === index ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-caret-up-fill"
      viewBox="0 0 16 16"
    >
      <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-caret-down-fill"
      viewBox="0 0 16 16"
    >
      <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
    </svg>
  )}
</span>
              </div>
              {openIndex === index && (
                <motion.p className="text-gray-600 mt-2" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.3 }}>
                  {faq.answer}
                </motion.p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default Contact;
