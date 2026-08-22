import { useState } from "react";
import { FaBell, FaCheckCircle, FaTrash } from "react-icons/fa";

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "New order placed.",
      time: "5 mins ago",
      read: false,
    },
    {
      id: 2,
      message: "Product stock is low.",
      time: "20 mins ago",
      read: false,
    },
  ]);

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(
      notifications.filter((n) => n.id !== id)
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-8">
        <FaBell className="text-3xl text-orange-500" />
        <h1 className="text-3xl font-bold">Notifications</h1>
      </div>

      <div className="space-y-4">
        {notifications.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-xl shadow-md p-5 flex justify-between items-center ${
              item.read ? "" : "border-l-4 border-orange-500"
            }`}
          >
            <div>
              <h2 className="font-semibold">{item.message}</h2>
              <p className="text-gray-500 text-sm">{item.time}</p>
            </div>

            <div className="flex gap-2">
              {!item.read && (
                <button
                  onClick={() => markAsRead(item.id)}
                  className="bg-green-500 text-white p-3 rounded-lg"
                >
                  <FaCheckCircle />
                </button>
              )}

              <button
                onClick={() => deleteNotification(item.id)}
                className="bg-red-500 text-white p-3 rounded-lg"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}