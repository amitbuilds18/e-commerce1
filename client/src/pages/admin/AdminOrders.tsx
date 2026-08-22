import { useEffect, useState } from "react";
import { getOrders } from "../../api/adminApi";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Orders
      </h1>

      <table className="w-full border">

        <thead className="bg-gray-100">

          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Status</th>
            <th>Payment</th>
          </tr>

        </thead>

        <tbody>

          {orders.map((order: any) => (

            <tr key={order.id} className="border">

              <td>{order.id}</td>

              <td>{order.user}</td>

              <td>{order.product}</td>

              <td>{order.quantity}</td>

              <td>₹{order.total}</td>

              <td>{order.status}</td>

              <td>{order.payment_status}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}
