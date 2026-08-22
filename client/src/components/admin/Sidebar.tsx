import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaPlusCircle,
  FaShoppingBag,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Sidebar() {
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/admin/login");
  };

  const menus = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <FaTachometerAlt />,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: <FaBoxOpen />,
    },
    {
      name: "Add Product",
      path: "/admin/add-product",
      icon: <FaPlusCircle />,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: <FaShoppingBag />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <FaUsers />,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white">

      <div className="h-20 flex items-center justify-center border-b border-gray-700">
        <h1 className="text-3xl font-bold text-orange-500">
          StyleHub
        </h1>
      </div>

      <nav className="mt-6">

        {menus.map((menu) => (
          <NavLink
            key={menu.name}
            to={menu.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-4 transition
              ${
                isActive
                  ? "bg-orange-500"
                  : "hover:bg-gray-800"
              }`
            }
          >
            {menu.icon}

            <span>{menu.name}</span>
          </NavLink>
        ))}

      </nav>

      <div className="absolute bottom-6 left-6">

        <button
          onClick={logoutHandler}
          className="flex items-center gap-3 text-red-400 hover:text-red-500"
        >
          <FaSignOutAlt />

          Logout
        </button>

      </div>

    </aside>
  );
}