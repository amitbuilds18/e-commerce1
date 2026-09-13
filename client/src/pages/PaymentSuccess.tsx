import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api/axios";
import { useToast } from "../context/ToastContext";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");

  useEffect(() => {
    const verify = async () => {
      try {
        const session_id = params.get("session_id");
        const token = localStorage.getItem("token");
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");

        if (!session_id) {
          throw new Error("Missing session ID.");
        }

        await API.post(
          "/payment/confirm-payment",
          {
            session_id,
            cart,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        localStorage.removeItem("cart");
        setStatus("success");
        success("Payment Successful 🎉 Your order is confirmed!");

        setTimeout(() => {
          navigate("/orders");
        }, 2000);
      } catch (err: any) {
        console.error(err);
        setStatus("error");
        toastError(
          err.response?.data?.message || "Payment verification failed. Please contact support."
        );
      }
    };

    verify();
  }, [navigate, params, success, toastError]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center">
        {status === "verifying" && (
          <>
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-800">Verifying Payment...</h1>
            <p className="text-gray-500 mt-2 text-sm">Please do not close or refresh this page.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
              ✓
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Payment Confirmed!</h1>
            <p className="text-gray-500 mt-2 text-sm">Redirecting to your orders...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
              ✕
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Verification Issue</h1>
            <p className="text-gray-500 mt-2 text-sm">
              We could not verify your session. If your account was debited, your order will be fulfilled automatically via webhook.
            </p>
            <button
              onClick={() => navigate("/orders")}
              className="mt-6 bg-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-orange-600 transition"
            >
              View Orders
            </button>
          </>
        )}
      </div>
    </div>
  );
}