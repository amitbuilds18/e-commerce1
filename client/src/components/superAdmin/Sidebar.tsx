import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserShield,
  FaUsers,
  FaBoxOpen,
  FaShoppingCart,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/super-admin/login");
  };

  const menus = [
    {
      name: "Dashboard",
      path: "/super-admin",
      icon: <FaTachometerAlt />,
    },
    {
      name: "Admins",
      path: "/super-admin/admins",
      icon: <FaUserShield />,
    },
    {
      name: "Users",
      path: "/super-admin/users",
      icon: <FaUsers />,
    },
    {
      name: "Products",
      path: "/super-admin/products",
      icon: <FaBoxOpen />,
    },
    {
      name: "Orders",
      path: "/super-admin/orders",
      icon: <FaShoppingCart />,
    },
    {
      name: "Analytics",
      path: "/super-admin/analytics",
      icon: <FaChartBar />,
    },
    {
      name: "Settings",
      path: "/super-admin/settings",
      icon: <FaCog />,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 w-72 h-screen bg-slate-900 text-white shadow-xl">

      <div className="h-20 flex items-center justify-center border-b border-slate-700">
        <h1 className="text-3xl font-bold text-purple-500">
          StyleHub
        </h1>
      </div>

      <nav className="mt-6">

        {menus.map((menu) => (
          <NavLink
            key={menu.name}
            to={menu.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-4 transition rounded-lg mx-3 mb-2
              ${
                isActive
                  ? "bg-purple-600"
                  : "hover:bg-slate-800"
              }`
            }
          >
            {menu.icon}

            <span>{menu.name}</span>
          </NavLink>
        ))}

      </nav>

      <div className="absolute bottom-8 left-6">

        <button
          onClick={logout}
          className="flex items-center gap-3 text-red-400 hover:text-red-500"
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>

    </aside>
  );
}