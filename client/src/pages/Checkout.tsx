import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import { useCart } from "../context/CartContext";
import { createOrder } from "../api/orderApi";
import { createCheckoutSession } from "../api/paymentApi";

export default function Checkout() {
  const navigate = useNavigate();

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

  // ======================
  // PRICE CALCULATION
  // ======================

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = cart.length > 0 ? 50 : 0;

  const gst = Math.round(subtotal * 0.18);

  const grandTotal = subtotal + shipping + gst;

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
      alert("Please fill all shipping details");
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

  alert("Order Placed Successfully");

  navigate("/order-success");

  return;
}

// Stripe Payment
const session = await createCheckoutSession(
  grandTotal,
  cart
);


window.location.href = session.url;
    } catch (err) {
      console.log(err);

      alert("Order Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold mb-8">
          Checkout
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-10 text-center">

            <h2 className="text-3xl font-bold mb-4">
              Your Cart is Empty 🛒
            </h2>

            <p className="text-gray-500">
              Please add some products before checkout.
            </p>

          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">

                      {/* Shipping Address */}

            <div className="bg-white rounded-xl shadow-lg p-6">

              <h2 className="text-2xl font-bold mb-6">
                Shipping Address
              </h2>

              <div className="space-y-4">

                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border rounded-lg p-3"
                />

                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border rounded-lg p-3"
                />

                <textarea
                  rows={3}
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border rounded-lg p-3"
                />

                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border rounded-lg p-3"
                />

                <input
                  type="text"
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full border rounded-lg p-3"
                />

                <input
                  type="text"
                  placeholder="Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full border rounded-lg p-3"
                />

              </div>

            </div>

            {/* Order Summary */}

            <div className="bg-white rounded-xl shadow-lg p-6">

              <h2 className="text-2xl font-bold mb-6">
                Order Summary
              </h2>

              <div className="space-y-5">

                {cart.map((item) => (

                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b pb-4"
                  >

                    <div className="flex items-center gap-4">

                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />

                      <div>

                        <h3 className="font-bold">
                          {item.name}
                        </h3>

                        <p className="text-gray-500">
                          Qty : {item.quantity}
                        </p>

                      </div>

                    </div>

                    <div className="font-semibold">
                      ₹ {item.price * item.quantity}
                    </div>

                  </div>

                ))}

              </div>

                            {/* Price Summary */}

              <div className="mt-8 space-y-3">

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹ {subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹ {shipping}</span>
                </div>

                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>₹ {gst}</span>
                </div>

                <hr />

                <div className="flex justify-between text-2xl font-bold">

                  <span>Total</span>

                  <span>₹ {grandTotal}</span>

                </div>

              </div>

              {/* Payment */}

              <div className="mt-8">

                <h2 className="text-xl font-bold mb-4">
                  Payment Method
                </h2>

                <label className="flex items-center gap-3 mb-3">

                  <input
                    type="radio"
                    checked={payment === "COD"}
                    onChange={() => setPayment("COD")}
                  />

                  Cash On Delivery

                </label>

                <label className="flex items-center gap-3">

                  <input
                    type="radio"
                    checked={payment === "Stripe"}
                    onChange={() => setPayment("Stripe")}
                  />

                   Stripe

                </label>

              </div>

              {/* Button */}

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-3 rounded-lg mt-8 text-lg font-bold"
              >
                {loading
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

            </div>

          </div>
        )}

      </div>

      <Footer />

    </>
  );
}