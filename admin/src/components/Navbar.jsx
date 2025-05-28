import { useState, useEffect, useContext } from "react";
import logo from "../assets/logo.jpg";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { AdminContext } from "../context/AdminContext";
import { Menu, X } from "lucide-react"; // Hamburger and close icons

const Navbar = () => {
  const { adminData, setAdminData, token, setToken } = useContext(AdminContext);
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const onSubmitHandler = () => {
    localStorage.removeItem("token");
    setToken(false);
    toast.success("Logout successfully");
    window.location.href = import.meta.env.VITE_FRONTEND_URL;
  };

  const handleToggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="w-full h-16 px-6 py-4 flex items-center justify-between fixed z-50 backdrop-blur-md bg-white/10 dark:bg-black/10 shadow-md border-b border-white/20">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <img
          src={logo}
          onClick={() => navigate("/")}
          alt="Logo"
          className="h-10 w-10 cursor-pointer rounded-full border border-white/30 shadow-md"
        />
        <span className="text-2xl font-bold tracking-tight text-white">
          THE <span className="text-violet-400">OJ</span>
        </span>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center space-x-6">
        <NavLink
          key="Home"
          to={import.meta.env.VITE_FRONTEND_URL}
          className={() =>
            "relative group text-lg font-medium transition-colors duration-300 text-violet-400"
          }
        >
          Home
          <span
            className={`absolute left-0 -bottom-1 h-[2px] bg-violet-500 transition-all duration-300 ${
              window.location.pathname === import.meta.env.VITE_FRONTEND_URL
                ? "w-full"
                : "w-0 group-hover:w-full"
            }`}
          ></span>
        </NavLink>

        {!token && !adminData ? (
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 font-semibold rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:scale-105 transition-transform duration-300"
          >
            Login
          </button>
        ) : (
          <>
            <span onClick={() => navigate("/my-profile")} className="cursor-pointer">
              <img
                src={adminData?.profileImage}
                alt="profile"
                className="w-10 h-10 rounded-full border-2 border-white/50 shadow-md object-cover"
              />
            </span>
            <button
              onClick={onSubmitHandler}
              className="px-5 py-2 font-semibold rounded-lg bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white shadow-lg hover:scale-105 transition-transform duration-300"
            >
              Logout
            </button>
          </>
        )}
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center">
        <button onClick={handleToggleMenu} className="text-white">
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full backdrop-blur-lg bg-black/40 dark:bg-black/50 border-t border-white/20 shadow-lg p-6 space-y-6 z-50 text-white">
          <NavLink
            to={import.meta.env.VITE_FRONTEND_URL}
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-lg font-medium text-violet-400 hover:underline"
          >
            Home
          </NavLink>

          {!token && !adminData ? (
            <button
              onClick={() => {
                navigate("/login");
                setIsMobileMenuOpen(false);
              }}
              className="w-full px-5 py-2 font-semibold rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg"
            >
              Login
            </button>
          ) : (
            <>
              <div
                onClick={() => {
                  navigate("/my-profile");
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <img
                  src={adminData?.profileImage}
                  alt="profile"
                  className="w-10 h-10 rounded-full border-2 border-white/50 shadow-md object-cover"
                />
                <span className="text-white font-medium">My Profile</span>
              </div>
              <button
                onClick={() => {
                  onSubmitHandler();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full px-5 py-2 font-semibold rounded-lg bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white shadow-lg"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
