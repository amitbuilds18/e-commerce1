import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTruck } from "react-icons/fa";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import API from "../api/axios";
import { useToast } from "../context/ToastContext";

type Order = {
  id: number;
  product_name?: string;
  name?: string;
  image: string;
  quantity: number;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
};

export default function MyOrders() {
  const navigate = useNavigate();
  const { error: toastError } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<"all" | "active" | "delivered">("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders/my-orders");
        setOrders(res.data.orders || []);
      } catch (err: any) {
        console.error(err);
        toastError(err.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [toastError]);

  const filteredOrders = orders.filter((o) => {
    if (filterTab === "active") return o.status === "Pending" || o.status === "Processing" || o.status === "Shipped";
    if (filterTab === "delivered") return o.status === "Delivered";
    return true;
  });

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      Pending: "bg-amber-100 text-amber-800",
      Processing: "bg-blue-100 text-blue-800",
      Shipped: "bg-purple-100 text-purple-800",
      Delivered: "bg-emerald-100 text-emerald-800",
      Cancelled: "bg-rose-100 text-rose-800",
    };
    return map[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <>
      <Navbar />

      <div className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                My Orders
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Track shipments and view payment invoices
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
              <button
                onClick={() => setFilterTab("all")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                  filterTab === "all" ? "bg-orange-500 text-white shadow-sm" : "text-gray-600 hover:text-black"
                }`}
              >
                All ({orders.length})
              </button>
              <button
                onClick={() => setFilterTab("active")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                  filterTab === "active" ? "bg-orange-500 text-white shadow-sm" : "text-gray-600 hover:text-black"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilterTab("delivered")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                  filterTab === "delivered" ? "bg-orange-500 text-white shadow-sm" : "text-gray-600 hover:text-black"
                }`}
              >
                Delivered
              </button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-40 animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center max-w-lg mx-auto">
              <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                📦
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Found</h2>
              <p className="text-gray-500 mb-8 text-sm">
                You haven't placed any orders in this category yet.
              </p>
              <button
                onClick={() => navigate("/products")}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-2xl shadow transition"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-md transition duration-300 flex flex-col md:flex-row justify-between items-center gap-6"
                >
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full md:w-auto text-center sm:text-left">
                    <img
                      src={order.image}
                      alt={order.product_name || order.name || "Product"}
                      className="w-24 h-24 rounded-xl object-cover border bg-gray-50 shrink-0"
                    />

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3 justify-center sm:justify-start">
                        <span className="text-xs font-mono font-bold bg-gray-100 px-2.5 py-1 rounded text-gray-700">
                          Order #{order.id}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900">
                        {order.product_name || order.name}
                      </h3>

                      <div className="flex items-center gap-4 text-sm text-gray-600 justify-center sm:justify-start">
                        <span>Quantity: <strong>{order.quantity}</strong></span>
                        <span>Total: <strong className="text-orange-600 font-extrabold">₹{order.total.toLocaleString()}</strong></span>
                      </div>

                      <div className="flex items-center gap-2 pt-1 justify-center sm:justify-start">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            order.payment_status === "Paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.payment_status === "Paid" ? "Payment Paid" : "Cash on Delivery"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row sm:flex-col gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition shadow-sm text-sm"
                    >
                      <FaTruck className="text-xs" />
                      <span>Track & Invoice</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}