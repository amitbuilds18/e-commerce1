import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaBars,
} from "react-icons/fa";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}

        <Link
          to="/"
          className="text-3xl font-bold text-orange-500"
        >
          StyleHub
        </Link>

        {/* Desktop Menu */}

        <div className="hidden md:flex items-center gap-8">

          <NavLink to="/">Home</NavLink>

          <NavLink to="/products">Products</NavLink>

          <NavLink to="/contact">Contact</NavLink>

          {token && (
            <NavLink to="/orders">
              My Orders
            </NavLink>
          )}

        </div>

        {/* Right Side */}

        <div className="hidden md:flex items-center gap-5">

          <Link to="/wishlist">
            <FaHeart size={20} />
          </Link>

          <Link to="/cart">
            <FaShoppingCart size={20} />
          </Link>

          {token ? (
            <>
              <Link to="/profile">
                <FaUser size={20} />
              </Link>

              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-orange-500 text-white px-4 py-2 rounded-lg"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="border border-orange-500 text-orange-500 px-4 py-2 rounded-lg"
              >
                Register
              </Link>
            </>
          )}

        </div>

        {/* Mobile Button */}

        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FaBars size={22} />
        </button>

      </div>

      {/* Mobile Menu */}

      {menuOpen && (
        <div className="md:hidden bg-white border-t">

          <NavLink
            to="/"
            className="block px-6 py-3"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            className="block px-6 py-3"
            onClick={() => setMenuOpen(false)}
          >
            Products
          </NavLink>

          <NavLink
            to="/contact"
            className="block px-6 py-3"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </NavLink>

          {token && (
            <NavLink
              to="/orders"
              className="block px-6 py-3"
              onClick={() => setMenuOpen(false)}
            >
              My Orders
            </NavLink>
          )}

          <NavLink
            to="/wishlist"
            className="block px-6 py-3"
            onClick={() => setMenuOpen(false)}
          >
            Wishlist
          </NavLink>

          <NavLink
            to="/cart"
            className="block px-6 py-3"
            onClick={() => setMenuOpen(false)}
          >
            Cart
          </NavLink>

          {!token ? (
            <>
              <NavLink
                to="/login"
                className="block px-6 py-3"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="block px-6 py-3"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </NavLink>
            </>
          ) : (
            <button
              onClick={logout}
              className="block w-full text-left px-6 py-3 text-red-500"
            >
              Logout
            </button>
          )}

        </div>
      )}
    </nav>
  );
}