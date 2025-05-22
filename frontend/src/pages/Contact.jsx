import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/contact`, formData);
      toast.success("Message sent successfully!");
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="min-h-screen px-4 py-30 bg-[#07034d]">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-blue-700">Contact Us</h1>
        <p className="text-gray-600 text-center">
          Have a question, feedback, or partnership inquiry? We'd love to hear from you.
        </p>
        
        <p className="text-gray-600 text-center">
          Our team at <strong>THE OJ</strong> is always open to improving your experience, resolving any issues,
          or answering any queries related to our platform.
          Whether you're a student, educator, or developer — your thoughts matter. We typically respond within
          24 hours.
        </p>
        
        <p className="text-gray-600 text-center">
          You can also reach out to us directly at <span className="text-blue-600 font-semibold">admin@theoj.com</span>.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="w-full border rounded p-3"
            required
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="w-full border rounded p-3"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <textarea
            name="message"
            placeholder="Your Message"
            className="w-full border rounded p-3"
            rows="5"
            required
            value={formData.message}
            onChange={handleChange}
          />
          <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
