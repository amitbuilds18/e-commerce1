export default function RecentOrders() {
  const orders = [
    {
      id: 1001,
      customer: "Amit",
      amount: "₹2500",
      status: "Delivered",
    },
    {
      id: 1002,
      customer: "Rahul",
      amount: "₹1800",
      status: "Pending",
    },
    {
      id: 1003,
      customer: "Rohit",
      amount: "₹5200",
      status: "Cancelled",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow p-6">

      <h2 className="text-xl font-bold mb-4">
        Recent Orders
      </h2>

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="py-3 text-left">
              Order
            </th>

            <th className="text-left">
              Customer
            </th>

            <th className="text-left">
              Amount
            </th>

            <th className="text-left">
              Status
            </th>

          </tr>

        </thead>

        <tbody>

          {orders.map((order) => (

            <tr
              key={order.id}
              className="border-b hover:bg-gray-50"
            >

              <td className="py-4">
                #{order.id}
              </td>

              <td>
                {order.customer}
              </td>

              <td>
                {order.amount}
              </td>

              <td>

                <span
                  className={`px-3 py-1 rounded-full text-sm text-white ${
                    order.status === "Delivered"
                      ? "bg-green-500"
                      : order.status === "Pending"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                >
                  {order.status}
                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}