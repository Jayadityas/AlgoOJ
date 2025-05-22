import { FaTwitter, FaLinkedin, FaEnvelope } from "react-icons/fa";
import logo from "../assets/logo.jpg";

const Footer = () => {
  return (
    <footer className="bg-[#0a1930] py-8 text-white">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        
        {/* Left: Logo + Address */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="Company Logo" className="w-10 h-10 object-cover" />
          <div className="text-sm leading-snug">
            <p>123 Coding Lane</p>
            <p>Dev City, 456789</p>
          </div>
        </div>

        {/* Center: Icons + Copyright */}
        <div className="flex flex-col items-center justify-center mr-130 mt-2 md:mt-0">
          <div className="flex gap-4 text-xl">
            <a href="mailto:your-email@example.com" target="_blank" rel="noopener noreferrer">
              <FaEnvelope className="hover:text-red-500 transition duration-300" />
            </a>
            <a href="https://www.linkedin.com/in/chetan-sharma-70ba70270" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="hover:text-blue-500 transition duration-300" />
            </a>
            <a href="" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="hover:text-sky-400 transition duration-300" />
            </a>
          </div>
          <p className="text-xs mt-1">© 2025 THE OJ | All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
