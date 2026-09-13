import { useEffect, useState } from "react";
import { FaBell, FaBars, FaClock } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { getNotifications } from "../../api/notificationApi";

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await getNotifications();
        if (res.notifications) {
          const unread = res.notifications.filter(
            (n: any) => !n.is_read
          ).length;
          setUnreadCount(unread);
        }
      } catch {
        // silent catch
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  // Derive section title from route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/admins")) return "Admin Staff Oversight";
    if (path.includes("/users")) return "Customer & User Management";
    if (path.includes("/products")) return "Global Product Catalog";
    if (path.includes("/orders")) return "Order Fulfillment & Transactions";
    if (path.includes("/analytics")) return "Executive Business Analytics";
    if (path.includes("/notifications")) return "System Broadcasts & Alerts";
    if (path.includes("/settings")) return "Global Platform Configuration";
    return "Executive Command Center";
  };

  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200/80 px-4 sm:px-8 py-4 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-slate-600 hover:text-purple-600 rounded-lg hover:bg-slate-100 transition"
            aria-label="Toggle Sidebar"
          >
            <FaBars className="text-xl" />
          </button>
        )}

        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            {getPageTitle()}
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block">
            Signed in as{" "}
            <span className="font-semibold text-purple-700">
              {user?.name || "Super Admin"}
            </span>{" "}
            ({user?.email || "superadmin@stylehub.com"})
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        {/* Live Clock Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
          <FaClock className="text-purple-600 text-xs" />
          <span>{time}</span>
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => navigate("/super-admin/notifications")}
          className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-purple-50 text-slate-600 hover:text-purple-600 transition cursor-pointer border border-slate-200/80"
          title="Notifications"
        >
          <FaBell className="text-lg" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white shadow-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* User Mini Badge */}
        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 sm:border-l border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center shadow-md shadow-purple-600/30 ring-2 ring-purple-100">
            {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
          </div>
          <div className="hidden lg:block text-left leading-tight">
            <span className="block font-bold text-sm text-slate-900 truncate max-w-[120px]">
              {user?.name || "Super Admin"}
            </span>
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-purple-600">
              Super Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}