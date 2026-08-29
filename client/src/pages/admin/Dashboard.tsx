import { useEffect, useState } from "react";
import DashboardCard from "../../components/admin/DashboardCard";
import { getDashboardStats } from "../../api/dashboardApi";

interface RecentOrder {
  id: number;
  name: string;
  product: string;
  quantity: number;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
  });

  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboardStats();

        if (data.stats) {
          setStats({
            products: Number(data.stats.totalProducts || 0),
            orders: Number(data.stats.totalOrders || 0),
            users: Number(data.stats.totalUsers || 0),
            revenue: Number(data.stats.totalRevenue || 0),
          });
        } else {
          setStats({
            products: Number(data.products || 0),
            orders: Number(data.orders || 0),
            users: Number(data.users || 0),
            revenue: Number(data.revenue || 0),
          });
        }

        if (data.recentOrders) {
          setRecentOrders(data.recentOrders);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-2xl mt-20">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <DashboardCard
          title="Products"
          value={stats.products.toString()}
          color="bg-blue-500"
        />

        <DashboardCard
          title="Orders"
          value={stats.orders.toString()}
          color="bg-green-500"
        />

        <DashboardCard
          title="Users"
          value={stats.users.toString()}
          color="bg-orange-500"
        />

        <DashboardCard
          title="Revenue"
          value={`₹${stats.revenue.toLocaleString()}`}
          color="bg-purple-500"
        />
      </div>

      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">
          Recent Orders
        </h2>

        {recentOrders.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No recent orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Product</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Payment</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-semibold">#{order.id}</td>
                    <td className="p-3">{order.name}</td>
                    <td className="p-3">{order.product}</td>
                    <td className="p-3">{order.quantity}</td>
                    <td className="p-3 font-semibold text-orange-600">₹{order.total}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {order.status}
                      </span>
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}