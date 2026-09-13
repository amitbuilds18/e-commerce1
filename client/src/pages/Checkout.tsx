import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTag, FaCheck, FaTimes } from "react-icons/fa";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import { useCart } from "../context/CartContext";
import { createOrder } from "../api/orderApi";
import { createCheckoutSession } from "../api/paymentApi";
import API from "../api/axios";

import { useToast } from "../context/ToastContext";

export default function Checkout() {
  const navigate = useNavigate();
  const { success, error: toastError, warning } = useToast();

  const { cart, clearCart } = useCart();

  const [payment, setPayment] = useState("COD");
  const [loading, setLoading] = useState(false);

  // Shipping Form
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    message: string;
  } | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // ======================
  // PRICE CALCULATION
  // ======================

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = cart.length > 0 ? 50 : 0;
  const gst = Math.round(subtotal * 0.18);
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const grandTotal = Math.max(0, subtotal + shipping + gst - discount);

  // ======================
  // COUPON VALIDATION
  // ======================

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = codeToApply || couponCode;
    if (!code.trim()) {
      warning("Please enter a promo code");
      return;
    }

    try {
      setValidatingCoupon(true);
      const res = await API.post("/coupons/validate", {
        code,
        cartTotal: subtotal,
      });

      if (res.data?.success) {
        setAppliedCoupon({
          code: res.data.code,
          discountAmount: res.data.discountAmount,
          message: res.data.message,
        });
        setCouponCode(res.data.code);
        success(res.data.message);
      }
    } catch (err: any) {
      toastError(err.response?.data?.message || "Invalid coupon code");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    success("Promo code removed");
  };

  // ======================
  // PLACE ORDER
  // ======================

  const handlePlaceOrder = async () => {
    if (
      !fullName ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      warning("Please fill in all shipping details");
      return;
    }

    try {
      setLoading(true);

      // COD
      if (payment === "COD") {
        for (const item of cart) {
          await createOrder({
            product_id: item.id,
            quantity: item.quantity,
            total: item.price * item.quantity,
          });
        }

        clearCart();
        success("Order Placed Successfully 🎉");
        navigate("/order-success");
        return;
      }

      // Stripe Payment
      const session = await createCheckoutSession(
        grandTotal,
        cart
      );

      if (session?.url) {
        window.location.href = session.url;
      } else {
        throw new Error("Checkout session could not be created.");
      }
    } catch (err: any) {
      console.error(err);
      toastError(err.response?.data?.message || "Order placement failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
          Checkout
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center max-w-lg mx-auto">
            <div className="text-5xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
            <p className="text-gray-500 mb-6">Add items before proceeding to checkout.</p>
            <button
              onClick={() => navigate("/products")}
              className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold shadow hover:bg-orange-600 transition"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Shipping Address */}
            <div className="lg:col-span-7 bg-white rounded-2xl shadow-md border border-gray-100 p-8 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b pb-4">
                1. Shipping Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Arvind Kumar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Street Address</label>
                  <textarea
                    rows={2}
                    placeholder="Flat / House No., Landmark, Street"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">City</label>
                  <input
                    type="text"
                    placeholder="Mumbai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">State</label>
                  <input
                    type="text"
                    placeholder="Maharashtra"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Pincode</label>
                  <input
                    type="text"
                    placeholder="400001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                  />
                </div>
              </div>

              {/* Payment Option */}
              <div className="pt-6 border-t">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  2. Payment Method
                </h2>

                <div className="space-y-3">
                  <label
                    className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition ${
                      payment === "COD" ? "border-orange-500 bg-orange-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={payment === "COD"}
                        onChange={() => setPayment("COD")}
                        className="accent-orange-500"
                      />
                      <div>
                        <span className="font-bold block text-gray-800">Cash On Delivery</span>
                        <span className="text-xs text-gray-500">Pay when your order arrives</span>
                      </div>
                    </div>
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">COD</span>
                  </label>

                  <label
                    className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition ${
                      payment === "Stripe" ? "border-orange-500 bg-orange-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={payment === "Stripe"}
                        onChange={() => setPayment("Stripe")}
                        className="accent-orange-500"
                      />
                      <div>
                        <span className="font-bold block text-gray-800">Online Card / Stripe</span>
                        <span className="text-xs text-gray-500">Instant secure checkout</span>
                      </div>
                    </div>
                    <span className="text-xs bg-purple-100 text-purple-700 font-bold px-2 py-1 rounded">Card / UPI</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary & Coupons */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 border-b pb-4">
                  Order Summary ({cart.length} items)
                </h2>

                {/* Items List */}
                <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-lg object-cover border"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm line-clamp-1">{item.name}</h3>
                        <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <div className="font-bold text-sm text-gray-800">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code Box */}
                <div className="border-t pt-4 space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase flex items-center gap-1">
                    <FaTag className="text-orange-500" /> Have a Promo Code?
                  </label>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 text-green-700 px-4 py-2.5 rounded-xl text-sm font-semibold">
                      <div className="flex items-center gap-2">
                        <FaCheck className="text-xs" />
                        <span>{appliedCoupon.code} applied (-₹{appliedCoupon.discountAmount})</span>
                      </div>
                      <button onClick={handleRemoveCoupon} className="text-red-500 hover:text-red-700 p-1">
                        <FaTimes />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. STYLE20"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1 border rounded-xl px-3 py-2 text-sm uppercase font-mono tracking-wider focus:ring-1 focus:ring-orange-400 outline-none"
                      />
                      <button
                        onClick={() => handleApplyCoupon()}
                        disabled={validatingCoupon}
                        className="bg-gray-900 hover:bg-black text-white px-5 py-2 rounded-xl text-sm font-bold transition disabled:opacity-50"
                      >
                        {validatingCoupon ? "..." : "Apply"}
                      </button>
                    </div>
                  )}

                  {/* Available Coupon Chips */}
                  {!appliedCoupon && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <button
                        onClick={() => handleApplyCoupon("STYLE20")}
                        className="text-xs bg-orange-50 text-orange-700 border border-orange-200 px-2.5 py-0.5 rounded-full hover:bg-orange-100 transition"
                      >
                        STYLE20 (20% OFF)
                      </button>
                      <button
                        onClick={() => handleApplyCoupon("FIRST500")}
                        className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded-full hover:bg-purple-100 transition"
                      >
                        FIRST500 (₹500 OFF)
                      </button>
                      <button
                        onClick={() => handleApplyCoupon("FASHION10")}
                        className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full hover:bg-blue-100 transition"
                      >
                        FASHION10 (10% OFF)
                      </button>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="border-t pt-4 space-y-2.5 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹{shipping}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span>₹{gst.toLocaleString()}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Promo Discount ({appliedCoupon.code})</span>
                      <span>-₹{appliedCoupon.discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xl font-extrabold text-gray-900 border-t pt-3">
                    <span>Grand Total</span>
                    <span className="text-orange-600">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Place Order Action */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-4 rounded-xl text-lg font-bold transition duration-300 shadow-lg hover:shadow-xl"
                >
                  {loading
                    ? "Processing Order..."
                    : payment === "COD"
                    ? `Place Order • ₹${grandTotal.toLocaleString()}`
                    : `Proceed to Pay • ₹${grandTotal.toLocaleString()}`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}