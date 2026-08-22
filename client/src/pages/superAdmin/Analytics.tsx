import { useEffect, useState } from "react";
import { getAnalytics } from "../../api/analyticsApi";

export default function Analytics() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const res = await getAnalytics();
    setData(res.analytics);
  };

  if (!data) return <h2>Loading...</h2>;

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-8">
        Analytics Dashboard
      </h1>

      <div className="grid grid-cols-5 gap-6">

        <div className="bg-white shadow rounded-xl p-6">
          <h2>Total Users</h2>
          <p className="text-3xl font-bold">
            {data.totalUsers}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2>Total Admins</h2>
          <p className="text-3xl font-bold">
            {data.totalAdmins}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2>Total Products</h2>
          <p className="text-3xl font-bold">
            {data.totalProducts}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2>Total Orders</h2>
          <p className="text-3xl font-bold">
            {data.totalOrders}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2>Revenue</h2>
          <p className="text-3xl font-bold">
            ₹{data.totalRevenue}
          </p>
        </div>

      </div>

    </div>
  );
}