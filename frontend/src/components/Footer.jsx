import { FaTwitter, FaLinkedin, FaEnvelope, FaGithub, FaDiscord, FaHeart } from "react-icons/fa";
import { FiArrowUp } from "react-icons/fi";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Footer = () => {
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { icon: FaEnvelope, href: "jayaditya.sahu@gmail.com", color: "hover:text-red-400", label: "Email" },
    { icon: FaLinkedin, href: "https://www.linkedin.com/in/jayaditya-sahu-0b1a922b4/", color: "hover:text-blue-400", label: "LinkedIn" },
    { icon: FaGithub, href: "https://github.com/Jayadityas", color: "hover:text-gray-300", label: "GitHub" },
   
  ];

  return (
    <footer className="relative bg-gradient-to-br from-[#e7f705] via-[#36f905] to-[#0606f9] overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/3 rounded-full blur-3xl"></div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-5 right-8 z-50 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          <FiArrowUp className="w-6 h-6" />
        </motion.button>
      )}

      <div className="relative z-10">
        {/* Bottom Bar */}
        <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-8 pr-24">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              
              {/* Copyright - Now on Left */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center lg:text-left"
              >
                <p className="text-white text-sm">
                  © 2025  All rights reserved.
                </p>
                <p className="text-gray-300 text-xs mt-1">
                  <span className="text-white text-xl font-bold"> By Jayaditya Sahu</span>
                </p>
              </motion.div>

              {/* Brand Section - Centered */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-4"
              >
            
                <div>
                </div>
              </motion.div>

              {/* Social Links - Now on Right */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-2"
              >
                <span className="text-gray-300 text-sm font-medium">Follow us:</span>
                <div className="flex gap-0.5">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className={`text-gray-400 ${social.color} transition-all duration-300 p-2 rounded-full hover:bg-white/5`}
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
