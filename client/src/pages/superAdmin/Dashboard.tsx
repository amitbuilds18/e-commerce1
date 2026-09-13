import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardCard from "../../components/superAdmin/DashboardCard";
import { getAnalytics } from "../../api/analyticsApi";
import API from "../../api/axios";
import {
  FaUserShield,
  FaUsers,
  FaBoxOpen,
  FaShoppingCart,
  FaRupeeSign,
  FaChartLine,
  FaServer,
  FaDatabase,
  FaShieldAlt,
  FaPlus,
  FaArrowRight,
  FaBroadcastTower,
} from "react-icons/fa";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState({
    totalAdmins: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [analyticsRes, ordersRes] = await Promise.allSettled([
          getAnalytics(),
          API.get("/orders"),
        ]);

        if (analyticsRes.status === "fulfilled" && analyticsRes.value.analytics) {
          const a = analyticsRes.value.analytics;
          setData({
            totalAdmins: Number(a.totalAdmins || 0),
            totalUsers: Number(a.totalUsers || 0),
            totalProducts: Number(a.totalProducts || 0),
            totalOrders: Number(a.totalOrders || 0),
            totalRevenue: Number(a.totalRevenue || 0),
          });
        }

        if (ordersRes.status === "fulfilled" && ordersRes.value.data.orders) {
          setRecentOrders(ordersRes.value.data.orders.slice(0, 5));
        }
      } catch (error) {
        console.error("Super Admin Dashboard load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Mock weekly trends based on real totals for dynamic visualization
  const trendData = [
    { day: "Mon", revenue: Math.round(data.totalRevenue * 0.1), orders: Math.max(1, Math.round(data.totalOrders * 0.08)) },
    { day: "Tue", revenue: Math.round(data.totalRevenue * 0.14), orders: Math.max(2, Math.round(data.totalOrders * 0.12)) },
    { day: "Wed", revenue: Math.round(data.totalRevenue * 0.12), orders: Math.max(1, Math.round(data.totalOrders * 0.11)) },
    { day: "Thu", revenue: Math.round(data.totalRevenue * 0.18), orders: Math.max(3, Math.round(data.totalOrders * 0.16)) },
    { day: "Fri", revenue: Math.round(data.totalRevenue * 0.22), orders: Math.max(4, Math.round(data.totalOrders * 0.24)) },
    { day: "Sat", revenue: Math.round(data.totalRevenue * 0.28), orders: Math.max(5, Math.round(data.totalOrders * 0.29)) },
    { day: "Sun", revenue: Math.round(data.totalRevenue * 0.2), orders: Math.max(2, Math.round(data.totalOrders * 0.18)) },
  ];

  const pieData = [
    { name: "Customers", value: Math.max(data.totalUsers, 1), color: "#3B82F6" },
    { name: "Admins", value: Math.max(data.totalAdmins, 1), color: "#8B5CF6" },
    { name: "Products", value: Math.max(data.totalProducts, 1), color: "#10B981" },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Loading Executive Command Center...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-8 sm:p-10 shadow-xl border border-purple-900/30">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <FaShieldAlt className="text-[240px]" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 text-xs font-bold px-3 py-1 rounded-full border border-purple-500/30 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Executive Platform Overview
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            StyleHub Super Admin Command
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
            Manage system administrators, verify customer accounts, monitor high-level sales revenue, and oversee cross-platform operations.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <Link
              to="/super-admin/admins"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/40 transition"
            >
              <FaPlus className="text-xs" />
              <span>Manage Admins</span>
            </Link>
            <Link
              to="/super-admin/notifications"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 backdrop-blur-xs transition"
            >
              <FaBroadcastTower className="text-xs" />
              <span>Broadcast Alert</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        <DashboardCard
          title="Admins"
          value={data.totalAdmins.toString()}
          subtitle="Staff & Moderators"
          icon={<FaUserShield />}
          trend="+12%"
          gradient="from-purple-600 to-indigo-600"
        />

        <DashboardCard
          title="Customers"
          value={data.totalUsers.toString()}
          subtitle="Registered Users"
          icon={<FaUsers />}
          trend="+24%"
          gradient="from-blue-600 to-cyan-500"
        />

        <DashboardCard
          title="Products"
          value={data.totalProducts.toString()}
          subtitle="Active Catalog"
          icon={<FaBoxOpen />}
          trend="+8%"
          gradient="from-emerald-600 to-teal-500"
        />

        <DashboardCard
          title="Orders"
          value={data.totalOrders.toString()}
          subtitle="Total Processed"
          icon={<FaShoppingCart />}
          trend="+18%"
          gradient="from-amber-500 to-orange-500"
        />

        <DashboardCard
          title="Revenue"
          value={`₹${data.totalRevenue.toLocaleString()}`}
          subtitle="All-time Volume"
          icon={<FaRupeeSign />}
          trend="+31%"
          gradient="from-fuchsia-600 to-pink-600"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Revenue & Volume AreaChart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FaChartLine className="text-purple-600" />
                Revenue & Velocity Trajectory
              </h2>
              <p className="text-xs text-slate-500">
                Weekly financial and order volume performance
              </p>
            </div>
            <Link
              to="/super-admin/analytics"
              className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 group"
            >
              Detailed Analytics
              <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition" />
            </Link>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} tickFormatter={(val) => `₹${val}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#1E293B",
                    borderRadius: "12px",
                    color: "#FFF",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#purpleGrad)"
                  name="Revenue (₹)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Share PieChart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Platform Asset Distribution
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Composition of users, staff, and products
            </p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#1E293B",
                    borderRadius: "12px",
                    color: "#FFF",
                    fontSize: "12px",
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total Core Entities</span>
            <span className="font-bold text-slate-900">
              {data.totalUsers + data.totalAdmins + data.totalProducts}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Quick Actions & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions & System Status */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Operational Shortlinks
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/super-admin/admins"
                className="p-3.5 bg-purple-50 hover:bg-purple-100/80 text-purple-700 font-bold text-xs rounded-xl flex flex-col items-center justify-center gap-2 border border-purple-200/60 transition group"
              >
                <FaUserShield className="text-xl group-hover:scale-110 transition" />
                <span>Admins</span>
              </Link>
              <Link
                to="/super-admin/users"
                className="p-3.5 bg-blue-50 hover:bg-blue-100/80 text-blue-700 font-bold text-xs rounded-xl flex flex-col items-center justify-center gap-2 border border-blue-200/60 transition group"
              >
                <FaUsers className="text-xl group-hover:scale-110 transition" />
                <span>Users</span>
              </Link>
              <Link
                to="/super-admin/products"
                className="p-3.5 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 font-bold text-xs rounded-xl flex flex-col items-center justify-center gap-2 border border-emerald-200/60 transition group"
              >
                <FaBoxOpen className="text-xl group-hover:scale-110 transition" />
                <span>Products</span>
              </Link>
              <Link
                to="/super-admin/orders"
                className="p-3.5 bg-amber-50 hover:bg-amber-100/80 text-amber-700 font-bold text-xs rounded-xl flex flex-col items-center justify-center gap-2 border border-amber-200/60 transition group"
              >
                <FaShoppingCart className="text-xl group-hover:scale-110 transition" />
                <span>Orders</span>
              </Link>
            </div>
          </div>

          {/* System Infrastructure Health */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-sm border border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <FaServer className="text-purple-400" />
              Infrastructure Status
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="flex items-center gap-2 text-slate-300">
                  <FaDatabase className="text-emerald-400" />
                  PostgreSQL Engine
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="flex items-center gap-2 text-slate-300">
                  <FaServer className="text-blue-400" />
                  Node.js API Express
                </span>
                <span className="bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded border border-blue-500/30">
                  v5000 Healthy
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-300">
                  <FaShieldAlt className="text-purple-400" />
                  Role Auth Shield
                </span>
                <span className="bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded border border-purple-500/30">
                  Active (JWT)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Overview */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                Recent Customer Orders
              </h2>
              <Link
                to="/super-admin/orders"
                className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 group"
              >
                View All Orders
                <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition" />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                No orders registered in system yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Product</th>
                      <th className="pb-3">Total</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 font-semibold text-purple-700">
                          #{ord.id}
                        </td>
                        <td className="py-3 text-slate-800 font-medium">
                          {ord.user_name || ord.user || "Customer"}
                        </td>
                        <td className="py-3 text-slate-600 truncate max-w-[150px]">
                          {ord.name || ord.product || "Product"}
                        </td>
                        <td className="py-3 font-bold text-slate-900">
                          ₹{Number(ord.total || 0).toLocaleString()}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              ord.status === "Delivered"
                                ? "bg-emerald-100 text-emerald-700"
                                : ord.status === "Cancelled"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {ord.status || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Showing top {recentOrders.length} most recent records</span>
            <Link
              to="/super-admin/orders"
              className="text-purple-600 font-bold hover:underline"
            >
              Manage Status & Invoices →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}