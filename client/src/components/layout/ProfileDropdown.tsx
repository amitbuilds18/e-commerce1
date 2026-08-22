import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

export default function ProfileDropdown() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex flex-col items-center">
        <FaUserCircle size={22} />
        <span className="text-sm font-semibold">
          Profile
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white shadow-xl rounded-lg border z-50">

          <div className="p-5">

            {!user ? (
              <>
                <h2 className="font-bold text-lg">
                  Welcome
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  To access account and manage orders
                </p>

                <Link
                  to="/login"
                  className="block mt-4 text-center border border-pink-500 text-pink-500 font-semibold py-2 rounded hover:bg-pink-50"
                >
                  LOGIN / SIGNUP
                </Link>
              </>
            ) : (
              <>
                <h2 className="font-bold text-lg">
                  Hello, {user.name}
                </h2>

                <p className="text-gray-500 text-sm">
                  {user.email}
                </p>
              </>
            )}

          </div>

          <hr />

          <div className="py-2">

            <Link
              to="/profile"
              className="block px-5 py-2 hover:bg-gray-100"
            >
              Profile
            </Link>

            <Link
              to="/orders"
              className="block px-5 py-2 hover:bg-gray-100"
            >
              Orders
            </Link>

            <Link
              to="/wishlist"
              className="block px-5 py-2 hover:bg-gray-100"
            >
              Wishlist
            </Link>

            <Link
              to="/cart"
              className="block px-5 py-2 hover:bg-gray-100"
            >
              Cart
            </Link>

            <Link
              to="/contact"
              className="block px-5 py-2 hover:bg-gray-100"
            >
              Contact Us
            </Link>

          </div>

          {user && (
            <>
              <hr />

              <button
                onClick={logout}
                className="w-full text-left px-5 py-3 text-red-500 hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          )}

        </div>
      )}
    </div>
  );
}