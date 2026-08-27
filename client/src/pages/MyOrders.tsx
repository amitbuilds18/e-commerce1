import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

type Order = {
  id: number;
  name: string;
  image: string;
  quantity: number;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
};

export default function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/my-orders");

      setOrders(res.data.orders);
    } catch (err: any) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Confirmed":
        return "bg-blue-100 text-blue-700";

      case "Packed":
        return "bg-purple-100 text-purple-700";

      case "Shipped":
        return "bg-orange-100 text-orange-700";

      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentColor = (status: string) => {
    return status === "Paid"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-2xl font-bold">
        Loading Orders...
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10">

      <div className="max-w-6xl mx-auto px-5">

        <h1 className="text-4xl font-bold mb-8">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-10 text-center">

            <h2 className="text-3xl font-bold">
              No Orders Found
            </h2>

            <p className="text-gray-500 mt-3">
              Start shopping to see your orders.
            </p>

          </div>
        ) : (
          <div className="space-y-6">

            {orders.map((order) => (

              <div
                key={order.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 p-6 flex flex-col md:flex-row justify-between items-center"
              >

                {/* Left */}

                <div className="flex gap-6">

                  <img
                    src={order.image}
                    alt={order.name}
                    className="w-32 h-32 rounded-lg object-cover border"
                  />

                  <div>

                    <h2 className="text-2xl font-bold">
                      {order.name}
                    </h2>

                    <p className="text-gray-500 mt-1">
                      Order ID :
                      <span className="font-semibold ml-2">
                        #{order.id}
                      </span>
                    </p>

                    <p className="mt-3">
                      Quantity :
                      <span className="font-semibold ml-2">
                        {order.quantity}
                      </span>
                    </p>

                    <p className="mt-2">
                      Total :
                      <span className="text-orange-600 font-bold ml-2">
                        ₹{order.total}
                      </span>
                    </p>

                    <div className="flex gap-3 mt-4">

                      <span
                        className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>

                      <span
                        className={`px-4 py-1 rounded-full text-sm font-semibold ${getPaymentColor(
                          order.payment_status
                        )}`}
                      >
                        {order.payment_status}
                      </span>

                    </div>

                    <p className="text-gray-500 text-sm mt-4">
                      Ordered on{" "}
                      {new Date(
                        order.created_at
                      ).toLocaleString()}
                    </p>

                  </div>

                </div>

                {/* Right */}

                <div className="mt-6 md:mt-0">

          <button
  onClick={() => navigate(`/orders/${order.id}`)}
  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition"
>
  View Details
</button>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}