import { useEffect, useState } from "react";
import { getOrders } from "../../api/adminApi";
import API from "../../api/axios";

interface Order {
  id: number;
  user_name?: string;
  user?: string;
  email?: string;
  name?: string;
  product?: string;
  quantity: number;
  total: number;
  status: string;
  payment_status: string;
  created_at?: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data || []);
    } catch (err) {
      console.error("Failed to load admin orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await API.put(`/orders/${id}`, { status });
      loadOrders();
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update order status");
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-xl">Loading Orders...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h1 className="text-3xl font-bold mb-6">
        Orders Management
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border text-center">ID</th>
              <th className="p-3 border text-left">Customer</th>
              <th className="p-3 border text-left">Product</th>
              <th className="p-3 border text-center">Qty</th>
              <th className="p-3 border text-center">Total</th>
              <th className="p-3 border text-center">Status</th>
              <th className="p-3 border text-center">Payment</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  No Orders Found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border hover:bg-gray-50 text-center">
                  <td className="p-3 font-semibold">#{order.id}</td>
                  <td className="p-3 text-left">
                    <div className="font-semibold">{order.user_name || order.user || "User"}</div>
                    {order.email && <div className="text-xs text-gray-400">{order.email}</div>}
                  </td>
                  <td className="p-3 text-left">{order.name || order.product || "Product"}</td>
                  <td className="p-3">{order.quantity}</td>
                  <td className="p-3 font-semibold text-orange-600">₹{order.total}</td>
                  <td className="p-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm bg-white"
                    >
                      <option>Pending</option>
                      <option>Processing</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.payment_status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.payment_status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
