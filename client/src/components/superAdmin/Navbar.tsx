import { FaBell, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  return (
    <header className="bg-white h-20 shadow flex items-center justify-between px-8">

      <div>
        <h1 className="text-3xl font-bold">
          Super Admin Dashboard
        </h1>

        <p className="text-gray-500">
          Welcome {user?.name}
        </p>
      </div>

      <div className="flex items-center gap-6">

        {/* Notification */}
        <button
          onClick={() => navigate("/super-admin/notifications")}
          className="relative cursor-pointer"
        >
          <FaBell className="text-2xl text-gray-600 hover:text-purple-600 transition" />

          <span className="absolute -top-1 -right-1 bg-red-500 text-white w-4 h-4 rounded-full text-[10px] flex items-center justify-center">
            5
          </span>
        </button>

        {/* Profile */}
        <FaUserCircle className="text-5xl text-purple-600" />

      </div>

    </header>
  );
}