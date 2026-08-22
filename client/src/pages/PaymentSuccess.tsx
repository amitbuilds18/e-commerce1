import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const session_id = params.get("session_id");

        const token = localStorage.getItem("token");

        const cart = JSON.parse(
          localStorage.getItem("cart") || "[]"
        );

        console.log("Session:", session_id);
        console.log("Cart:", cart);

        await axios.post(
          "http://localhost:5000/api/payment/confirm-payment",
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

        alert("Payment Successful 🎉");

        navigate("/orders");
      } catch (err: any) {
        console.log(err);

        alert(
          err.response?.data?.message ||
            "Payment Verification Failed"
        );
      }
    };

    verify();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold">
        Verifying Payment...
      </h1>
    </div>
  );
}