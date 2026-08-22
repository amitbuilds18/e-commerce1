import { useEffect, useState } from "react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import { getMyOrders } from "../api/orderApi";

export default function Orders() {

  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {

    loadOrders();

  }, []);

  const loadOrders = async () => {

    try {

      const data = await getMyOrders();

      setOrders(data);

    } catch (err) {

      console.log(err);

    }

  };

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto p-8">

        <h1 className="text-4xl font-bold mb-8">
          My Orders
        </h1>

        {orders.length === 0 ? (

          <div className="text-center py-20">

            <h2 className="text-2xl font-bold">
              No Orders Found
            </h2>

          </div>

        ) : (

          <div className="space-y-6">

            {orders.map((order) => (

              <div
                key={order.id}
                className="bg-white shadow rounded-xl p-5 flex justify-between items-center"
              >

                <div className="flex items-center gap-5">

                  <img
                    src={order.image}
                    alt={order.name}
                    className="w-24 h-24 rounded object-cover"
                  />

                  <div>

                    <h2 className="text-xl font-bold">
                      {order.name}
                    </h2>

                    <p>
                      Quantity : {order.quantity}
                    </p>

                    <p>
                      ₹ {order.total}
                    </p>

                  </div>

                </div>

                <div className="text-right">

                  <p className="font-bold">
                    {order.status}
                  </p>

                  <p className="text-green-600">
                    {order.payment_status}
                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      <Footer />
    </>
  );
}