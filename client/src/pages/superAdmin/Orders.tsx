import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";
import { useToast } from "../../context/ToastContext";
import {
  FaShoppingCart,
  FaSearch,
  FaRupeeSign,
  FaClock,
  FaTrash,
  FaEye,
  FaPrint,
  FaTimes,
  FaExclamationTriangle,
  FaTruck,
  FaReceipt,
} from "react-icons/fa";

interface Order {
  id: number;
  user_name?: string;
  user?: string;
  email?: string;
  name?: string;
  product?: string;
  quantity: number;
  total: number;
  status: string;
  payment_status?: string;
  created_at?: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Modals
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const { success, error } = useToast();

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Failed to load orders:", err);
      error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    setActionLoading(true);
    try {
      await API.put(`/orders/${id}`, { status });
      success(`Order #${id} status updated to "${status}"`);
      fetchOrders();
      if (viewOrder && viewOrder.id === id) {
        setViewOrder({ ...viewOrder, status });
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      error("Failed to update order status");
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await API.delete(`/orders/${deleteTarget.id}`);
      success(`Order #${deleteTarget.id} deleted successfully`);
      setDeleteTarget(null);
      fetchOrders();
    } catch (err) {
      console.error("Failed to delete order:", err);
      error("Failed to delete order");
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const customer = (o.user_name || o.user || o.email || "").toLowerCase();
      const productName = (o.name || o.product || "").toLowerCase();
      const query = search.toLowerCase();
      const matchesSearch =
        customer.includes(query) ||
        productName.includes(query) ||
        String(o.id).includes(query);

      if (!matchesSearch) return false;
      if (statusFilter !== "all" && o.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }
      return true;
    });
  }, [orders, search, statusFilter]);

  const totalRevenue = orders.reduce(
    (sum, o) => sum + Number(o.total || 0),
    0
  );
  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;
  const processingCount = orders.filter(
    (o) => o.status === "Processing" || o.status === "Shipped"
  ).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Loading Orders & Transactions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Orders
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {orders.length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl font-bold">
            <FaShoppingCart />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pending Orders
            </p>
            <h3 className="text-2xl font-black text-amber-500 mt-1">
              {pendingCount}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center text-xl font-bold">
            <FaClock />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              In Transit / Active
            </p>
            <h3 className="text-2xl font-black text-blue-600 mt-1">
              {processingCount}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
            <FaTruck />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Delivered ({deliveredCount})
            </p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">
              ₹{totalRevenue.toLocaleString()}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold">
            <FaRupeeSign />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-100 rounded-xl w-full md:w-auto custom-scrollbar">
          {["all", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition whitespace-nowrap ${
                statusFilter.toLowerCase() === st.toLowerCase()
                  ? "bg-white text-purple-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {st === "all" ? `All (${orders.length})` : st}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search customer, item, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-slate-50/50"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer Info</th>
                <th className="p-4">Product Purchased</th>
                <th className="p-4 text-center">Qty</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Fulfillment Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16">
                    <FaReceipt className="text-4xl text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-semibold">
                      No orders found matching your search criteria.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-black text-purple-700">
                      #{order.id}
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-900">
                        {order.user_name || order.user || "Customer"}
                      </p>
                      {order.email && (
                        <p className="text-xs text-slate-400">{order.email}</p>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="font-semibold text-slate-700">
                        {order.name || order.product || "Standard Item"}
                      </span>
                    </td>

                    <td className="p-4 text-center font-bold text-slate-600">
                      {order.quantity || 1}
                    </td>

                    <td className="p-4">
                      <span className="font-black text-slate-900">
                        ₹{Number(order.total || 0).toLocaleString()}
                      </span>
                    </td>

                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        disabled={actionLoading}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                          order.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : order.status === "Cancelled"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : order.status === "Shipped" || order.status === "Processing"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setViewOrder(order)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition flex items-center gap-1.5"
                          title="View Invoice Details"
                        >
                          <FaEye className="text-xs" />
                          View
                        </button>

                        <button
                          onClick={() => setDeleteTarget(order)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition flex items-center gap-1.5"
                          title="Delete Order"
                        >
                          <FaTrash className="text-xs" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Order / Invoice Modal */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            {/* Printable Invoice Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center text-lg font-bold">
                  <FaReceipt />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Order Invoice #{viewOrder.id}
                  </h3>
                  <p className="text-xs text-slate-400">StyleHub Platform Order</p>
                </div>
              </div>

              <button
                onClick={() => setViewOrder(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <FaTimes />
              </button>
            </div>

            {/* Customer & Order Metadata */}
            <div className="py-4 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    Customer Name
                  </span>
                  <p className="font-bold text-slate-900">
                    {viewOrder.user_name || viewOrder.user || "Customer"}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    Customer Email
                  </span>
                  <p className="font-semibold text-slate-700 text-xs truncate">
                    {viewOrder.email || "No email on record"}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    Payment Method
                  </span>
                  <p className="font-bold text-purple-700">
                    {viewOrder.payment_status === "Paid" ? "Online Paid (Card)" : "Cash / Pending"}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    Status
                  </span>
                  <p className="font-bold text-emerald-600">
                    {viewOrder.status}
                  </p>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="border border-slate-200 rounded-2xl p-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-bold text-slate-900">
                    {viewOrder.name || viewOrder.product || "Fashion Apparel"}
                  </span>
                  <span className="text-slate-500 font-semibold text-xs">
                    Qty: {viewOrder.quantity || 1}
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{Number(viewOrder.total || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping & Handling</span>
                    <span className="text-emerald-600 font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 text-sm pt-2 border-t border-slate-100">
                    <span>Grand Total</span>
                    <span className="text-purple-700">
                      ₹{Number(viewOrder.total || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center gap-2"
              >
                <FaPrint />
                Print Invoice
              </button>
              <button
                onClick={() => setViewOrder(null)}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-white bg-purple-600 hover:bg-purple-700 transition shadow-lg shadow-purple-600/30"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl mx-auto mb-4">
              <FaExclamationTriangle />
            </div>
            <h3 className="text-xl font-bold text-center text-slate-900">
              Delete Order Record?
            </h3>
            <p className="text-slate-500 text-center text-sm mt-2 leading-relaxed">
              Are you sure you want to permanently delete order{" "}
              <strong className="text-slate-900">#{deleteTarget.id}</strong>? This
              action will alter revenue reports and cannot be undone.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={actionLoading}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={actionLoading}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-white bg-rose-600 hover:bg-rose-700 transition shadow-lg shadow-rose-600/30"
              >
                {actionLoading ? "Deleting..." : "Delete Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}