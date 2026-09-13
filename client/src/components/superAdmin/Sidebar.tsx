import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserShield,
  FaUsers,
  FaBoxOpen,
  FaShoppingCart,
  FaChartBar,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaCrown,
  FaExternalLinkAlt,
  FaTimes,
} from "react-icons/fa";
import { useToast } from "../../context/ToastContext";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { info } = useToast();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    info("Logged out successfully");
    navigate("/super-admin/login");
  };

  const menus = [
    {
      name: "Dashboard",
      path: "/super-admin",
      icon: <FaTachometerAlt className="text-lg" />,
    },
    {
      name: "Admins",
      path: "/super-admin/admins",
      icon: <FaUserShield className="text-lg" />,
    },
    {
      name: "Users",
      path: "/super-admin/users",
      icon: <FaUsers className="text-lg" />,
    },
    {
      name: "Products",
      path: "/super-admin/products",
      icon: <FaBoxOpen className="text-lg" />,
    },
    {
      name: "Orders",
      path: "/super-admin/orders",
      icon: <FaShoppingCart className="text-lg" />,
    },
    {
      name: "Analytics",
      path: "/super-admin/analytics",
      icon: <FaChartBar className="text-lg" />,
    },
    {
      name: "Notifications",
      path: "/super-admin/notifications",
      icon: <FaBell className="text-lg" />,
    },
    {
      name: "Settings",
      path: "/super-admin/settings",
      icon: <FaCog className="text-lg" />,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 w-72 h-screen bg-slate-950 text-slate-200 shadow-2xl flex flex-col z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-900/50 ring-2 ring-purple-400/20">
              <FaCrown className="text-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  Style<span className="text-purple-400">Hub</span>
                </span>
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                Super Admin
              </span>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <FaTimes />
            </button>
          )}
        </div>

        {/* Store Link Shortcut */}
        <div className="px-4 pt-4">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 text-xs font-semibold text-slate-300 hover:text-purple-300 transition group"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              View Live Storefront
            </span>
            <FaExternalLinkAlt className="text-[10px] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
          </a>
        </div>

        {/* Navigation Menus */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5 custom-scrollbar">
          <div className="px-3 pb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Main Management
          </div>
          {menus.map((menu) => (
            <NavLink
              key={menu.name}
              to={menu.path}
              end={menu.path === "/super-admin"}
              onClick={() => onClose && onClose()}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 font-semibold"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/80"
                }`
              }
            >
              <span className="shrink-0">{menu.icon}</span>
              <span className="flex-1">{menu.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Card & Logout Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-500/40 flex items-center justify-center font-bold text-purple-300 shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-semibold text-white truncate">
                {user?.name || "Super Admin"}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {user?.email || "superadmin@stylehub.com"}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl text-sm font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/30 transition duration-150"
          >
            <FaSignOutAlt className="text-sm" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}