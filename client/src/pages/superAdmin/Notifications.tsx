import { useState } from "react";
import {
  FaBell,
  FaCheckCircle,
  FaTrash,
} from "react-icons/fa";

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "New user registered successfully.",
      time: "2 mins ago",
      read: false,
    },
    {
      id: 2,
      message: "New order placed by Amit.",
      time: "10 mins ago",
      read: false,
    },
    {
      id: 3,
      message: "Product 'Watch' stock is low.",
      time: "1 hour ago",
      read: true,
    },
    {
      id: 4,
      message: "Admin created successfully.",
      time: "Yesterday",
      read: true,
    },
  ]);

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((item) =>
        item.id === id
          ? { ...item, read: true }
          : item
      )
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(
      notifications.filter((item) => item.id !== id)
    );
  };

  return (
    <div className="p-6">

      <div className="flex items-center gap-3 mb-8">
        <FaBell className="text-3xl text-purple-600" />
        <h1 className="text-3xl font-bold">
          Notifications
        </h1>
      </div>

      <div className="space-y-4">

        {notifications.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-xl shadow-md p-5 flex justify-between items-center ${
              item.read
                ? ""
                : "border-l-4 border-purple-600"
            }`}
          >
            <div>
              <h2
                className={`font-semibold ${
                  item.read
                    ? "text-gray-700"
                    : "text-black"
                }`}
              >
                {item.message}
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                {item.time}
              </p>
            </div>

            <div className="flex gap-3">

              {!item.read && (
                <button
                  onClick={() =>
                    markAsRead(item.id)
                  }
                  className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg"
                >
                  <FaCheckCircle />
                </button>
              )}

              <button
                onClick={() =>
                  deleteNotification(item.id)
                }
                className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg"
              >
                <FaTrash />
              </button>

            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="bg-white p-10 rounded-xl shadow text-center">
            <FaBell className="text-5xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              No Notifications
            </p>
          </div>
        )}

      </div>
    </div>
  );
}