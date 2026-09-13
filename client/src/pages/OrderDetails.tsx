import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaPrint,
  FaArrowLeft,
  FaCheckCircle,
  FaFileInvoice,
  FaBox,
  FaTruck,
  FaHome,
  FaClipboardCheck,
  FaTimesCircle,
} from "react-icons/fa";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { getOrderDetails } from "../api/orderApi";
import { useToast } from "../context/ToastContext";

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

const ORDER_STEPS = [
  { key: "Pending", label: "Order Placed", icon: FaClipboardCheck },
  { key: "Processing", label: "Processing", icon: FaBox },
  { key: "Shipped", label: "Shipped", icon: FaTruck },
  { key: "Delivered", label: "Delivered", icon: FaHome },
];

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { error: toastError } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!id) return;
        const data = await getOrderDetails(id);
        setOrder(data);
      } catch (err: any) {
        console.error(err);
        toastError(err.response?.data?.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, toastError]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl text-gray-500">
        Loading Order Details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Order Not Found</h2>
        <button
          onClick={() => navigate("/orders")}
          className="bg-orange-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-orange-600 transition"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const subtotal = order.price * order.quantity;
  const shipping = 50;
  const gst = Math.round(subtotal * 0.18);

  const getStepIndex = (status: string) => {
    switch (status) {
      case "Pending":
        return 0;
      case "Processing":
        return 1;
      case "Shipped":
        return 2;
      case "Delivered":
        return 3;
      default:
        return 0;
    }
  };

  const currentStep = getStepIndex(order.status);
  const isCancelled = order.status === "Cancelled";

  return (
    <>
      <div className="print:hidden">
        <Navbar />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Navigation & Action Header */}
        <div className="flex items-center justify-between print:hidden">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold transition"
          >
            <FaArrowLeft className="text-sm" /> Back
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold transition shadow-md"
          >
            <FaPrint className="text-sm" /> Print Invoice
          </button>
        </div>

        {/* Visual Order Tracking Stepper */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 print:hidden">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order Tracking</h2>

          {isCancelled ? (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
              <FaTimesCircle className="text-2xl shrink-0" />
              <div>
                <h4 className="font-bold">This order has been cancelled</h4>
                <p className="text-xs mt-0.5">Refund (if applicable) will be credited within 3-5 business days.</p>
              </div>
            </div>
          ) : (
            <div className="relative flex justify-between items-center">
              {/* Progress Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0" />
              <div
                className="absolute top-1/2 left-0 h-1 bg-orange-500 -translate-y-1/2 z-0 transition-all duration-500"
                style={{
                  width: `${(currentStep / (ORDER_STEPS.length - 1)) * 100}%`,
                }}
              />

              {/* Step Icons */}
              {ORDER_STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx <= currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <div key={step.key} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition duration-300 shadow-md ${
                        isCompleted
                          ? "bg-orange-500 text-white"
                          : "bg-white text-gray-400 border-2 border-gray-200"
                      } ${isCurrent ? "ring-4 ring-orange-200" : ""}`}
                    >
                      <Icon className="text-lg" />
                    </div>
                    <span
                      className={`text-xs mt-2 font-semibold text-center ${
                        isCompleted ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Invoice Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 print:shadow-none print:border-none print:p-0">
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b pb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-orange-500 font-black text-2xl tracking-tight">
                <FaFileInvoice className="text-3xl" />
                <span>STYLEHUB</span>
              </div>
              <p className="text-gray-500 text-xs mt-1">Official E-Commerce Tax Invoice</p>
              <p className="text-gray-400 text-xs">support@stylehub.com | www.stylehub.com</p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-2xl font-bold text-gray-900 block">
                INVOICE #{order.id}
              </span>
              <p className="text-gray-500 text-sm mt-1">
                Date: {new Date(order.created_at).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <div className="mt-2 flex items-center sm:justify-end gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                    order.payment_status === "Paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  <FaCheckCircle className="text-xs" /> {order.payment_status}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                    order.status === "Delivered"
                      ? "bg-emerald-100 text-emerald-700"
                      : order.status === "Cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          {/* Item Details */}
          <div className="py-8 border-b">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Ordered Items
            </h3>

            <div className="flex items-center gap-6 bg-gray-50 p-4 rounded-xl">
              <img
                src={order.image}
                alt={order.name}
                className="w-20 h-20 rounded-lg object-cover border"
              />
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900">{order.name}</h4>
                <p className="text-gray-500 text-sm line-clamp-1">{order.description}</p>
                <div className="text-xs text-gray-400 mt-1">
                  Qty: {order.quantity} × ₹{order.price}
                </div>
              </div>
              <div className="text-lg font-bold text-orange-600">
                ₹{subtotal.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="py-6 border-b flex justify-end">
            <div className="w-full sm:w-72 space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Estimated GST (18%)</span>
                <span>₹{gst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping Fee</span>
                <span>₹{shipping}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-3">
                <span>Grand Total</span>
                <span className="text-orange-600">₹{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Order Status & Footer */}
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 gap-4">
            <div>
              <p>Delivery Status: <strong className="text-gray-700">{order.status}</strong></p>
              <p>Payment Mode: <strong className="text-gray-700">{order.payment_status === "Paid" ? "Online / Stripe" : "Cash on Delivery"}</strong></p>
            </div>
            <div className="text-center sm:text-right">
              <p>Thank you for shopping with StyleHub!</p>
              <p>This is a computer-generated invoice and requires no signature.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="print:hidden">
        <Footer />
      </div>
    </>
  );
}