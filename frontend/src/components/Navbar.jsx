import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import logo from "../assets/logo.jpg"; // Adjust the path as necessary
import { NavLink , useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";


const Navbar = () => {

  const [isDark, setIsDark] = useState(false);
  const {token,userData,setToken} = useContext(AppContext)
  const navigate = useNavigate();
  console.log(userData)


  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Problems", path: "/problems" },
    { name: "Leaderboard", path: "/leaderboard"},
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
    { name: "Admin" , path:`${import.meta.env.VITE_ADMIN_URL}/login`}
  ];

  const onSubmitHandler = () => {
    setToken(false)
    localStorage.removeItem("token");
    toast.success("Logout successfully");
    navigate("/");
  }


  return (
    <nav className="w-full h-16 px-6 py-4 flex items-center justify-between bg-[#ffffff] dark:bg-gray-900 shadow-lg fixed z-50">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <img src={logo} onClick={()=>navigate('/')} alt="Logo" className="h-15 w-15 cursor-pointer" />
        <span className="text-2xl font-bold text-gray-800 dark:text-white">THE OJ</span>
      </div>

      {/* Navigation Links */}
      <ul className="hidden md:flex ml-80 space-x-10 text-md font-medium">
                
        {navItems.map(({ name, path }) => (
            <NavLink
              key={name}
              to={path}
              className={({ isActive }) =>
                `relative group text-lg font-medium transition-colors duration-300 
                ${isActive ? "text-violet-800" : "text-violet-500"}`
              }
            >
              {name}
              {/* Animated underline for active link */}
              <span
                className={`absolute left-0 -bottom-1 h-[2px] bg-violet-500 transition-all duration-300
                  ${window.location.pathname === path ? "w-full" : "w-0 group-hover:w-full"}
                `}
              ></span>
            </NavLink>
            
          ))}

          {
            userData?.role==='Admin' && (<NavLink
              to={"/admin"}
              className={({ isActive }) =>
                `relative group text-lg font-medium transition-colors duration-300 
                ${isActive ? "text-violet-800" : "text-violet-500"}`
              }
            >
              {/* Animated underline for active link */}
              <span
                className={`absolute left-0 -bottom-1 h-[2px] bg-violet-500 transition-all duration-300
                  ${window.location.pathname === path ? "w-full" : "w-0 group-hover:w-full"}
                `}
              ></span>
            </NavLink>)
          }

      </ul>

      {/* Right Side Buttons */}
      <div className="flex items-center space-x-4">
        {/* Dark Mode Toggle */}

        {!token && !userData ? (
          <>
            <button onClick={()=>navigate('/login')} className="relative px-5 py-2 font-semibold rounded-lg overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white animate-none transition-all duration-300 hover:scale-105 shadow-lg">
              Login
            </button>
          </>
        ) : (
          <>
          <span onClick={()=>navigate('/my-profile')} className="text-gray-700 dark:text-gray-300 font-semibold cursor-pointer">👋{userData?.username}</span>
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
