import { useEffect, useState } from "react";
import API from "../../api/axios";

interface Order {
  id: number;
  user: string;
  product: string;
  quantity: number;
  total: number;
  status: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    const res = await API.get("/orders");
    setOrders(res.data.orders);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (
    id: number,
    status: string
  ) => {
    await API.put(`/orders/${id}`, {
      status,
    });

    fetchOrders();
  };

  const deleteOrder = async (id: number) => {
    if (!window.confirm("Delete Order?")) return;

    await API.delete(`/orders/${id}`);

    fetchOrders();
  };

  const filtered = orders.filter((o) =>
    o.user.toLowerCase().includes(search.toLowerCase())
  );

  const revenue = orders.reduce(
    (sum, o) => sum + Number(o.total),
    0
  );

  const pending = orders.filter(
    (o) => o.status === "Pending"
  ).length;

  const completed = orders.filter(
    (o) => o.status === "Delivered"
  ).length;

  return (
    <div className="p-8">

      <h1 className="text-4xl font-bold mb-8">
        Orders Management
      </h1>

      {/* Cards */}

      <div className="grid grid-cols-4 gap-5 mb-8">

        <div className="bg-white rounded-xl shadow p-5">
          <h2>Total Orders</h2>
          <p className="text-3xl font-bold">
            {orders.length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h2>Pending</h2>
          <p className="text-3xl font-bold text-orange-500">
            {pending}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h2>Delivered</h2>
          <p className="text-3xl font-bold text-green-600">
            {completed}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h2>Total Revenue</h2>
          <p className="text-3xl font-bold text-purple-600">
            ₹{revenue}
          </p>
        </div>

      </div>

      {/* Search */}

      <input
        placeholder="Search User..."
        className="border rounded-lg p-3 w-72 mb-6"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      {/* Table */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4">ID</th>
              <th>User</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {filtered.map((order) => (

              <tr
                key={order.id}
                className="border-t text-center"
              >

                <td>{order.id}</td>

                <td>{order.user}</td>

                <td>{order.product}</td>

                <td>{order.quantity}</td>

                <td>₹{order.total}</td>

                <td>

                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(
                        order.id,
                        e.target.value
                      )
                    }
                    className="border rounded px-2 py-1"
                  >
                    <option>Pending</option>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>

                </td>

                <td>

                  <button
                    onClick={() =>
                      deleteOrder(order.id)
                    }
                    className="bg-red-500 text-white px-4 py-1 rounded"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}