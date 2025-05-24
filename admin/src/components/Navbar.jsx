import { useState, useEffect, useContext } from "react";
import logo from "../assets/logo.jpg";
import {useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AdminContext } from "../context/AdminContext";


const Navbar = () => {

  const {adminData,setAdminData,token,setToken} = useContext(AdminContext)
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const onSubmitHandler = () => {
    localStorage.removeItem("token");
    setToken(false)
    toast.success("Logout successfully");
    window.location.href = import.meta.env.VITE_FRONTEND_URL
  }


  return (
    <nav className="w-full h-16 px-6 py-4 flex items-center justify-between bg-[#ffffff] dark:bg-gray-900 shadow-lg fixed z-50">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <img src={logo} onClick={()=>navigate('/')} alt="Logo" className="h-15 w-15 cursor-pointer" />
        <span className="text-2xl font-bold text-gray-800 dark:text-white">THE OJ</span>
      </div>

      {/* Right Side Buttons */}
      <div className="flex items-center space-x-4">
        {/* Dark Mode Toggle */}

        {!token && !adminData ? (
          <>
            <button onClick={()=>navigate('/login')} className="relative px-5 py-2 font-semibold rounded-lg overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white animate-none transition-all duration-300 hover:scale-105 shadow-lg">
              Login
            </button>
          </>
        ) : (
          <>
          <span onClick={()=>navigate('/my-profile')} className="text-gray-700 dark:text-gray-300 font-semibold cursor-pointer">👋{adminData?.username}</span>
          <button onClick={onSubmitHandler} className="relative px-5 py-2 font-semibold rounded-lg overflow-hidden bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white animate transition-all duration-300 hover:scale-105 shadow-lg">
              Logout
          </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
