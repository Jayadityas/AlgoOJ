import { FaTwitter, FaLinkedin, FaEnvelope } from "react-icons/fa";
import logo from "../assets/logo.jpg";

const Footer = () => {
  return (
    <footer className="bg-[#0a1930] text-white py-4">
      <div className="container mx-auto px-4 text-center">
        {/* Logo and address */}
        <div className="mb-4">
          <img src={logo} alt="Company Logo" className="mx-auto w-15 bg-[##07034d]" />
          <p className="mt-2 text-sm">123 Coding Lane, Dev City, 456789</p>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center items-center gap-6 mt-4 text-white text-xl">
        <a href="mailto:your-email@example.com" target="_blank" rel="noopener noreferrer">
            <FaEnvelope className="hover:text-red-500 transition duration-300" />
        </a>
        <a href="https://www.linkedin.com/in/your-profile" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="hover:text-blue-500 transition duration-300" />
        </a>
        <a href="https://twitter.com/your-handle" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="hover:text-sky-400 transition duration-300" />
        </a>
        </div>

        {/* Footer note */}
        <p className="text-xs mt-6">© 2025 THE OJ | All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
