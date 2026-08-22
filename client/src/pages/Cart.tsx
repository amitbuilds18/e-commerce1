import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart } = useCart();

  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-8">
          My Cart 🛒
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold">
              Your cart is empty
            </h2>

            <p className="text-gray-500 mt-2">
              Add products to your cart.
            </p>

            <button
              onClick={() => navigate("/products")}
              className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row justify-between items-center border rounded-xl p-5 mb-5 shadow-sm bg-white"
              >
                <div className="flex items-center gap-5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />

                  <div>
                    <h2 className="text-xl font-bold">
                      {item.name}
                    </h2>

                    <p className="text-gray-600 mt-1">
                      Price: ₹ {item.price}
                    </p>

                    <p className="text-gray-600">
                      Quantity: {item.quantity}
                    </p>

                    <p className="font-semibold mt-2">
                      Total: ₹{" "}
                      {item.price * item.quantity}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    removeFromCart(item.id)
                  }
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg mt-4 md:mt-0"
                >
                  Remove
                </button>
              </div>
            ))}

            {/* Summary */}

            <div className="bg-white shadow-lg rounded-xl p-6 mt-8">

              <div className="flex justify-between text-lg mb-3">
                <span>Subtotal</span>
                <span>₹ {total}</span>
              </div>

              <div className="flex justify-between text-lg mb-3">
                <span>Shipping</span>
                <span>₹ 50</span>
              </div>

              <div className="flex justify-between text-lg mb-3">
                <span>GST (18%)</span>
                <span>
                  ₹ {Math.round(total * 0.18)}
                </span>
              </div>

              <hr className="my-4" />

              <div className="flex justify-between text-3xl font-bold">
                <span>Grand Total</span>

                <span>
                  ₹{" "}
                  {total +
                    50 +
                    Math.round(total * 0.18)}
                </span>
              </div>

              <div className="flex justify-end gap-4 mt-8">

                <button
                  onClick={() =>
                    navigate("/products")
                  }
                  className="border border-orange-500 text-orange-500 px-6 py-3 rounded-lg hover:bg-orange-50"
                >
                  Continue Shopping
                </button>

                <button
                  onClick={() =>
                    navigate("/checkout")
                  }
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-semibold"
                >
                  Proceed to Checkout
                </button>

              </div>

            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
}