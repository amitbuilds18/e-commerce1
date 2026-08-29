import { useEffect, useState } from "react";
import DashboardCard from "../../components/superAdmin/DashboardCard";
import { getAnalytics } from "../../api/analyticsApi";

export default function Dashboard() {
  const [data, setData] = useState({
    totalAdmins: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const res = await getAnalytics();
        if (res.analytics) {
          setData({
            totalAdmins: Number(res.analytics.totalAdmins || 0),
            totalUsers: Number(res.analytics.totalUsers || 0),
            totalProducts: Number(res.analytics.totalProducts || 0),
            totalOrders: Number(res.analytics.totalOrders || 0),
            totalRevenue: Number(res.analytics.totalRevenue || 0),
          });
        }
      } catch (error) {
        console.error("Super Admin Dashboard load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-2xl">Loading Super Admin Dashboard...</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
        <DashboardCard
          title="Admins"
          value={data.totalAdmins.toString()}
          color="bg-red-500"
        />

        <DashboardCard
          title="Users"
          value={data.totalUsers.toString()}
          color="bg-blue-500"
        />

        <DashboardCard
          title="Products"
          value={data.totalProducts.toString()}
          color="bg-green-500"
        />

        <DashboardCard
          title="Orders"
          value={data.totalOrders.toString()}
          color="bg-orange-500"
        />

        <DashboardCard
          title="Revenue"
          value={`₹${data.totalRevenue.toLocaleString()}`}
          color="bg-purple-500"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl shadow p-6 min-h-64">
          <h2 className="text-2xl font-bold mb-4">
            System Overview
          </h2>
          <div className="space-y-3 text-gray-700">
            <div className="flex justify-between border-b pb-2">
              <span>Total Registered Customers</span>
              <span className="font-bold">{data.totalUsers}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Staff / Admin Accounts</span>
              <span className="font-bold">{data.totalAdmins}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Active Catalog Products</span>
              <span className="font-bold">{data.totalProducts}</span>
            </div>
            <div className="flex justify-between pb-2">
              <span>All-time Total Orders</span>
              <span className="font-bold">{data.totalOrders}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 min-h-64">
          <h2 className="text-2xl font-bold mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <a
              href="/super-admin/admins"
              className="p-4 bg-purple-50 text-purple-700 font-semibold rounded-xl text-center hover:bg-purple-100 transition"
            >
              Manage Admins
            </a>
            <a
              href="/super-admin/users"
              className="p-4 bg-blue-50 text-blue-700 font-semibold rounded-xl text-center hover:bg-blue-100 transition"
            >
              Manage Users
            </a>
            <a
              href="/super-admin/orders"
              className="p-4 bg-orange-50 text-orange-700 font-semibold rounded-xl text-center hover:bg-orange-100 transition"
            >
              View Orders
            </a>
            <a
              href="/super-admin/products"
              className="p-4 bg-green-50 text-green-700 font-semibold rounded-xl text-center hover:bg-green-100 transition"
            >
              View Products
            </a>
          </div>
        </div>
      </div>
    </>
  );
}