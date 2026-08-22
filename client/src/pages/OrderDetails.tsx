import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import { getOrderDetails } from "../api/orderApi";

type Order = {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
};

export default function OrderDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!id) return;

        const data = await getOrderDetails(id);

        setOrder(data);
      } catch (err) {
        console.log(err);
        alert("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-2xl font-bold">
        Loading...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex justify-center items-center text-2xl">
        Order Not Found
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">

        <button
          onClick={() => navigate(-1)}
          className="mb-8 bg-gray-200 px-5 py-2 rounded-lg hover:bg-gray-300"
        >
          ← Back
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">

          <div className="grid md:grid-cols-2 gap-10">

            <img
              src={order.image}
              alt={order.name}
              className="w-full rounded-xl border"
            />

            <div>

              <h1 className="text-4xl font-bold">
                {order.name}
              </h1>

              <p className="text-gray-600 mt-4">
                {order.description}
              </p>

              <div className="space-y-3 mt-8">

                <p>
                  <strong>Order ID :</strong> #{order.id}
                </p>

                <p>
                  <strong>Price :</strong> ₹{order.price}
                </p>

                <p>
                  <strong>Quantity :</strong> {order.quantity}
                </p>

                <p>
                  <strong>Total :</strong> ₹{order.total}
                </p>

                <p>
                  <strong>Status :</strong>

                  <span className="ml-2 font-bold text-blue-600">
                    {order.status}
                  </span>
                </p>

                <p>
                  <strong>Payment :</strong>

                  <span className="ml-2 font-bold text-green-600">
                    {order.payment_status}
                  </span>
                </p>

                <p>
                  <strong>Ordered On :</strong>{" "}
                  {new Date(order.created_at).toLocaleString()}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      <Footer />
    </>
  );
}