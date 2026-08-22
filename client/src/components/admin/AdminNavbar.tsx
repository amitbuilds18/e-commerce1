import { useState } from "react";
import { FaBell, FaMoon, FaSearch, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  return (
    <header className="bg-white shadow-md h-20 flex items-center justify-between px-8 sticky top-0 z-40">

      {/* Left */}

      <div>

        <h1 className="text-2xl font-bold">
          Dashboard
        </h1>

        <p className="text-gray-500 text-sm">
          Welcome back 👋
        </p>

      </div>

      {/* Search */}

      <div className="hidden lg:flex items-center bg-gray-100 rounded-xl px-4 py-2 w-96">

        <FaSearch className="text-gray-400" />

        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none ml-3 w-full"
        />

      </div>

      {/* Right */}

      <div className="flex items-center gap-6">

      <button
  onClick={() => navigate("/admin/notifications")}
  className="relative cursor-pointer"
>
  <FaBell className="text-2xl text-gray-600 hover:text-orange-500" />

  <span className="absolute -top-1 -right-1 bg-red-500 text-white w-4 h-4 rounded-full text-[10px] flex items-center justify-center">
    3
  </span>
</button>

        <button>

          <FaMoon className="text-2xl text-gray-600 hover:text-orange-500" />

        </button>

        {/* Profile */}

        <div className="relative">

          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3"
          >

            <FaUserCircle className="text-4xl text-orange-500" />

            <div className="text-left hidden md:block">

              <h2 className="font-semibold">
                {user?.name}
              </h2>

              <p className="text-xs text-gray-500">
                {user?.role}
              </p>

            </div>

          </button>

          {open && (

            <div className="absolute right-0 mt-4 bg-white rounded-xl shadow-xl border w-56">

              <div className="p-4">

                <h2 className="font-bold">
                  {user?.name}
                </h2>

                <p className="text-sm text-gray-500">
                  {user?.email}
                </p>

              </div>

              <hr />

              <button
                className="w-full text-left px-4 py-3 hover:bg-gray-100"
              >
                My Profile
              </button>

              <button
                className="w-full text-left px-4 py-3 hover:bg-gray-100"
              >
                Settings
              </button>

              <button
                onClick={logout}
                className="w-full text-left px-4 py-3 text-red-500 hover:bg-gray-100"
              >
                Logout
              </button>

            </div>

          )}

        </div>

      </div>

    </header>
  );
}