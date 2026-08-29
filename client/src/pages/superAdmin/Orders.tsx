import { useEffect, useState } from "react";
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
  payment_status?: string;
  created_at?: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (
    id: number,
    status: string
  ) => {
    try {
      await API.put(`/orders/${id}`, {
        status,
      });
      fetchOrders();
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update order status");
    }
  };

  const deleteOrder = async (id: number) => {
    if (!window.confirm("Delete Order?")) return;

    try {
      await API.delete(`/orders/${id}`);
      fetchOrders();
    } catch (error) {
      console.error("Failed to delete order:", error);
      alert("Failed to delete order");
    }
  };

  const filtered = orders.filter((o) => {
    const customer = (o.user_name || o.user || o.email || "").toLowerCase();
    const productName = (o.name || o.product || "").toLowerCase();
    const query = search.toLowerCase();
    return customer.includes(query) || productName.includes(query) || String(o.id).includes(query);
  });

  const revenue = orders.reduce(
    (sum, o) => sum + Number(o.total || 0),
    0
  );

  const pending = orders.filter(
    (o) => o.status === "Pending"
  ).length;

  const completed = orders.filter(
    (o) => o.status === "Delivered"
  ).length;

  if (loading) {
    return (
      <div className="p-8 text-center text-2xl">
        Loading Orders...
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">
        Orders Management
      </h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-gray-500 font-semibold">Total Orders</h2>
          <p className="text-3xl font-bold mt-2">
            {orders.length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-gray-500 font-semibold">Pending</h2>
          <p className="text-3xl font-bold text-orange-500 mt-2">
            {pending}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-gray-500 font-semibold">Delivered</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {completed}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-gray-500 font-semibold">Total Revenue</h2>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            ₹{revenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Search */}
      <input
        placeholder="Search user or product..."
        className="border rounded-lg p-3 w-72 mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-center">ID</th>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Product</th>
              <th className="p-4 text-center">Qty</th>
              <th className="p-4 text-center">Total</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-8 text-gray-500">
                  No Orders Found
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
                <tr
                  key={order.id}
                  className="border-t text-center hover:bg-gray-50"
                >
                  <td className="p-4 font-semibold">#{order.id}</td>

                  <td className="p-4 text-left">
                    <div className="font-semibold">{order.user_name || order.user || "User"}</div>
                    {order.email && <div className="text-xs text-gray-400">{order.email}</div>}
                  </td>

                  <td className="p-4 text-left">{order.name || order.product || "Product"}</td>

                  <td className="p-4">{order.quantity}</td>

                  <td className="p-4 font-semibold text-orange-600">₹{order.total}</td>

                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(
                          order.id,
                          e.target.value
                        )
                      }
                      className="border rounded px-3 py-1 bg-white"
                    >
                      <option>Pending</option>
                      <option>Processing</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() =>
                        deleteOrder(order.id)
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded transition"
                    >
                      Delete
                    </button>
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