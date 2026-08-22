import { useEffect, useState } from "react";
import DashboardCard from "../../components/admin/DashboardCard";
import { getDashboardStats } from "../../api/dashboardApi";

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboardStats();

        console.log(data);

        setStats({
          products: data.products,
          orders: data.orders,
          users: data.users,
          revenue: data.revenue,
        });
      } catch (error) {
        console.log(error);
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
          value={`₹${stats.revenue}`}
          color="bg-purple-500"
        />

      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">

        <div className="bg-white rounded-xl shadow p-6 h-80">
          <h2 className="text-xl font-bold mb-4">
            Revenue Chart
          </h2>

          <div className="flex justify-center items-center h-full text-gray-400">
            Chart will come here
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 h-80">
          <h2 className="text-xl font-bold mb-4">
            Recent Orders
          </h2>

          <div className="flex justify-center items-center h-full text-gray-400">
            Orders table will come here
          </div>
        </div>

      </div>
    </>
  );
}