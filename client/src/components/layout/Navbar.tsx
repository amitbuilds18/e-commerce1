import { useState, useMemo } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaBars,
  FaTimes,
  FaShieldAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useToast } from "../../context/ToastContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { success } = useToast();

  const token = localStorage.getItem("token");

  const user = useMemo(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }, [token]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    success("Logged out successfully");
    navigate("/login");
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-semibold transition duration-200 hover:text-orange-500 ${
      isActive ? "text-orange-500 border-b-2 border-orange-500 pb-1" : "text-gray-700"
    }`;

  // Safe display fallbacks
  const displayName = user?.name
    ? user.name.split(" ")[0]
    : user?.email
    ? user.email.split("@")[0]
    : "Profile";

  const avatarInitial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : "U";

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          <span className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
            S
          </span>
          <span>Style<span className="text-orange-500">Hub</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            Products
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
          {token && (
            <NavLink to="/orders" className={navLinkClass}>
              My Orders
            </NavLink>
          )}
          {user && (user.role === "admin" || user.role === "superAdmin") && (
            <NavLink
              to={user.role === "superAdmin" ? "/super-admin" : "/admin"}
              className="flex items-center gap-1.5 text-xs font-bold bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full hover:bg-purple-200 transition"
            >
              <FaShieldAlt className="text-xs" />
              <span>{user.role === "superAdmin" ? "SuperAdmin" : "Admin Panel"}</span>
            </NavLink>
          )}
        </div>

        {/* Right Side Icons & Auth */}
        <div className="hidden md:flex items-center gap-6">
          {/* Wishlist Icon */}
          <Link
            to="/wishlist"
            className="relative text-gray-600 hover:text-orange-500 transition p-2"
            aria-label="Wishlist"
          >
            <FaHeart className="text-xl" />
            {wishlist.length > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative text-gray-600 hover:text-orange-500 transition p-2"
            aria-label="Cart"
          >
            <FaShoppingCart className="text-xl" />
            {totalCartCount > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow animate-bounce">
                {totalCartCount}
              </span>
            )}
          </Link>

          {/* User Auth Section */}
          {token ? (
            <div className="flex items-center gap-3 pl-2 border-l">
              <Link
                to="/profile"
                className="flex items-center gap-2 text-sm font-semibold text-gray-800 hover:text-orange-500 transition"
              >
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  {avatarInitial ? avatarInitial : <FaUser className="text-xs" />}
                </div>
                <span className="hidden lg:inline">{displayName}</span>
              </Link>

              <button
                onClick={logout}
                className="text-gray-400 hover:text-red-500 p-2 transition"
                title="Logout"
              >
                <FaSignOutAlt className="text-lg" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-semibold text-gray-700 hover:text-orange-500 px-3 py-2 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden text-gray-700 p-2 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-6 py-5 space-y-4 shadow-xl animate-fadeIn">
          <NavLink
            to="/"
            className="block text-base font-semibold text-gray-800"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className="block text-base font-semibold text-gray-800"
            onClick={() => setMenuOpen(false)}
          >
            Products
          </NavLink>
          <NavLink
            to="/contact"
            className="block text-base font-semibold text-gray-800"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </NavLink>
          {token && (
            <NavLink
              to="/orders"
              className="block text-base font-semibold text-gray-800"
              onClick={() => setMenuOpen(false)}
            >
              My Orders
            </NavLink>
          )}

          <div className="pt-4 border-t flex items-center justify-between">
            <Link
              to="/wishlist"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700"
              onClick={() => setMenuOpen(false)}
            >
              <FaHeart className="text-red-500" /> Wishlist ({wishlist.length})
            </Link>
            <Link
              to="/cart"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700"
              onClick={() => setMenuOpen(false)}
            >
              <FaShoppingCart className="text-orange-500" /> Cart ({totalCartCount})
            </Link>
          </div>

          <div className="pt-4 border-t">
            {token ? (
              <div className="space-y-3">
                <Link
                  to="/profile"
                  className="block text-sm font-bold text-gray-900"
                  onClick={() => setMenuOpen(false)}
                >
                  My Profile ({user?.name || user?.email || "Account"})
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="w-full text-center bg-red-50 text-red-600 font-bold py-2.5 rounded-xl text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  className="text-center border border-gray-200 py-2.5 rounded-xl font-bold text-sm text-gray-700"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-center bg-orange-500 text-white py-2.5 rounded-xl font-bold text-sm"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}