import { useState, useEffect, useContext } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import logo from "../assets/logo.jpg";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { token, userData, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Problems", path: "/problems" },
    { name: "Leaderboard", path: "/leaderboard" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
    { name: "Admin", path: `${import.meta.env.VITE_ADMIN_URL}/login` },
  ];

  const onSubmitHandler = () => {
    setToken(false);
    localStorage.removeItem("token");
    toast.success("Logout successfully");
    navigate("/");
  };

  return (
    <>
      <nav className="w-full h-16 px-6 py-4 flex items-center justify-between backdrop-blur-md bg-white/10 dark:bg-gray-900/30 border-b border-white/20 dark:border-gray-700 shadow-md fixed z-50 transition-all duration-300">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img
            src={logo}
            onClick={() => navigate("/")}
            alt="Logo"
            className="h-10 w-10 rounded-full cursor-pointer hover:scale-105 transition duration-300"
          />
          <span className="text-2xl font-bold text-gray-300 dark:text-white">
            THE <span className="text-violet-400">OJ</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex lg:ml-70 space-x-5 text-md font-medium">
          {navItems.map(({ name, path }) => (
            <NavLink
              key={name}
              to={path}
              className={({ isActive }) =>
                "relative group text-lg font-medium transition-colors duration-300 text-violet-400"
              }
            >
              {name}
              <span className="absolute left-0 -bottom-1 h-[2px] bg-violet-500 group-hover:w-full w-0 transition-all duration-300"></span>
            </NavLink>
          ))}
        </ul>

        {/* Right Side (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          {!token && !userData ? (
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 font-semibold rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:scale-105 transition-all duration-300 shadow-md"
            >
              Login
            </button>
          ) : (
            <>
              <span
                onClick={() => navigate("/my-profile")}
                className="cursor-pointer"
              >
                <img
                  src={userData?.profileImage}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md hover:ring-2 hover:ring-violet-400 transition duration-300"
                />
              </span>
              <button
                onClick={onSubmitHandler}
                className="px-5 py-2 font-semibold rounded-lg bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white hover:scale-105 transition-all duration-300 shadow-md"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Hamburger Icon (Mobile) */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-white hover:text-violet-400 transition"
          >
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
        <div
          className={`fixed top-0 right-0 h-full w-64 backdrop-blur-md bg-white/10 dark:bg-gray-900/30 border-l border-white/20 dark:border-gray-700 shadow-md z-50 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/20">
          <span className="text-xl font-bold text-white">Menu</span>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-white hover:text-red-400 transition"
          >
            <X size={24} />
          </button>
        </div>

        <ul className="flex flex-col space-y-4 px-6 py-4">
          {navItems.map(({ name, path }) => (
            <NavLink
              key={name}
              to={path}
              onClick={() => setIsSidebarOpen(false)}
              className="text-violet-400 text-lg font-medium hover:text-violet-200 transition-all"
            >
              {name}
            </NavLink>
          ))}

          {userData?.role === "Admin" && (
            <NavLink
              to="/admin"
              onClick={() => setIsSidebarOpen(false)}
              className="text-violet-400 text-lg font-medium hover:text-violet-200 transition-all"
            >
              Admin
            </NavLink>
          )}
        </ul>

        <div className="px-6 pt-2 space-y-4">
          {!token && !userData ? (
            <button
              onClick={() => {
                setIsSidebarOpen(false);
                navigate("/login");
              }}
              className="w-full py-2 font-semibold rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:scale-105 transition-all duration-300 shadow-md"
            >
              Login
            </button>
          ) : (
            <>
              <div
                onClick={() => {
                  setIsSidebarOpen(false);
                  navigate("/my-profile");
                }}
                className="flex items-center gap-3 cursor-pointer"
              >
                <img
                  src={userData?.profileImage}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                />
                <span className="text-white">{userData?.username}</span>
              </div>
              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  onSubmitHandler();
                }}
                className="w-full py-2 font-semibold rounded-lg bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white hover:scale-105 transition-all duration-300 shadow-md"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
