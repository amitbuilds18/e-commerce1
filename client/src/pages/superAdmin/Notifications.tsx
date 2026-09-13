import { useEffect, useMemo, useState } from "react";
import {
  getNotifications,
  readNotification,
  createNotification,
  deleteNotification,
} from "../../api/notificationApi";
import { useToast } from "../../context/ToastContext";
import {
  FaBell,
  FaCheckCircle,
  FaTrash,
  FaPaperPlane,
  FaBroadcastTower,
  FaRegBell,
  FaClock,
} from "react-icons/fa";

interface NotificationItem {
  id: number;
  message: string;
  is_read: boolean;
  created_at?: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [sending, setSending] = useState(false);

  const { success, error, info } = useToast();

  const fetchNotificationsList = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.notifications || []);
    } catch (err) {
      console.error(err);
      error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotificationsList();
  }, []);

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    setSending(true);
    try {
      await createNotification(broadcastMessage.trim());
      success("System broadcast published successfully");
      setBroadcastMessage("");
      fetchNotificationsList();
    } catch (err) {
      console.error(err);
      error("Failed to post system broadcast");
    } finally {
      setSending(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await readNotification(id);
      success("Notification marked as read");
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch {
      error("Failed to update notification");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNotification(id);
      info("Notification removed");
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {
      error("Failed to delete notification");
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const readCount = notifications.filter((n) => n.is_read).length;

  const filteredNotifications = useMemo(() => {
    if (filter === "unread") return notifications.filter((n) => !n.is_read);
    if (filter === "read") return notifications.filter((n) => n.is_read);
    return notifications;
  }, [notifications, filter]);

  const formatTimestamp = (dateStr?: string) => {
    if (!dateStr) return "Just now";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Loading Notifications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Broadcast Composer Card */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-purple-800/40">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-purple-300">
            <FaBroadcastTower className="text-xl" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">
              Broadcast System Announcement
            </h2>
            <p className="text-xs text-purple-200">
              Send alerts and notices visible across the administrative team.
            </p>
          </div>
        </div>

        <form onSubmit={handleSendBroadcast} className="mt-4 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            placeholder="e.g. System maintenance scheduled at midnight or warehouse stock updated..."
            value={broadcastMessage}
            onChange={(e) => setBroadcastMessage(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-950/60 border border-purple-500/30 text-white placeholder:text-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
          />
          <button
            type="submit"
            disabled={sending}
            className="px-6 py-3 rounded-xl font-bold text-sm bg-purple-500 hover:bg-purple-400 text-white transition flex items-center justify-center gap-2 shadow-lg shadow-purple-950/50 cursor-pointer shrink-0"
          >
            <FaPaperPlane className="text-xs" />
            <span>{sending ? "Broadcasting..." : "Broadcast"}</span>
          </button>
        </form>
      </div>

      {/* Filter & Count Header */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg">
            <FaBell />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Notification Center</h3>
            <p className="text-xs text-slate-500">
              {unreadCount} unread / {notifications.length} total
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              filter === "all"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              filter === "unread"
                ? "bg-white text-purple-700 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              filter === "read"
                ? "bg-white text-slate-700 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Read ({readCount})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-sm">
            <FaRegBell className="text-5xl text-slate-300 mx-auto mb-3" />
            <p className="text-base font-bold text-slate-700">
              No Notifications
            </p>
            <p className="text-xs text-slate-400 mt-1">
              You're all caught up! No notifications matching current view.
            </p>
          </div>
        ) : (
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl p-5 shadow-sm border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                item.is_read
                  ? "border-slate-200/80 bg-white"
                  : "border-purple-200 bg-purple-50/20 ring-1 ring-purple-100"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 mt-0.5 ${
                    item.is_read
                      ? "bg-slate-100 text-slate-400"
                      : "bg-purple-100 text-purple-600 font-bold"
                  }`}
                >
                  <FaBell />
                </div>
                <div>
                  <p
                    className={`text-sm leading-relaxed ${
                      item.is_read
                        ? "text-slate-600 font-normal"
                        : "text-slate-900 font-bold"
                    }`}
                  >
                    {item.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <FaClock className="text-[10px]" />
                    <span>{formatTimestamp(item.created_at)}</span>
                    {!item.is_read && (
                      <span className="font-bold text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded text-[10px]">
                        NEW
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {!item.is_read && (
                  <button
                    onClick={() => handleMarkAsRead(item.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition flex items-center gap-1.5"
                    title="Mark as Read"
                  >
                    <FaCheckCircle className="text-xs" />
                    <span>Mark Read</span>
                  </button>
                )}

                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition flex items-center gap-1.5"
                  title="Delete Notification"
                >
                  <FaTrash className="text-xs" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}