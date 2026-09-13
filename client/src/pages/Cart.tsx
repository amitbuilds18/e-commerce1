import { useNavigate } from "react-router-dom";
import { FaTrash, FaPlus, FaMinus, FaArrowRight, FaShieldAlt, FaUndo } from "react-icons/fa";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function Cart() {
  const { cart, removeFromCart, addToCart } = useCart();
  const navigate = useNavigate();
  const { info } = useToast();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = cart.length > 0 ? (subtotal > 2000 ? 0 : 50) : 0;
  const gst = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + shipping + gst;

  const handleIncrement = (item: any) => {
    addToCart({ ...item, quantity: 1 });
  };

  const handleDecrement = (item: any) => {
    if (item.quantity > 1) {
      addToCart({ ...item, quantity: -1 });
    } else {
      removeFromCart(item.id);
      info(`Removed ${item.name} from cart`);
    }
  };

  const handleRemove = (id: number, name: string) => {
    removeFromCart(id);
    info(`Removed ${name} from cart`);
  };

  return (
    <>
      <Navbar />

      <div className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Shopping Cart ({cart.length} {cart.length === 1 ? "item" : "items"})
            </h1>
            {cart.length > 0 && (
              <button
                onClick={() => navigate("/products")}
                className="text-orange-500 font-semibold text-sm hover:underline"
              >
                + Add More Items
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center max-w-lg mx-auto">
              <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                🛍️
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your cart is feeling lonely
              </h2>
              <p className="text-gray-500 mb-8 text-sm">
                Explore our trending fashion collection and add items to your cart.
              </p>
              <button
                onClick={() => navigate("/products")}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg transition duration-300"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Cart Items List */}
              <div className="lg:col-span-8 space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6 transition hover:shadow-md"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 rounded-xl object-cover border bg-gray-50"
                    />

                    <div className="flex-1 text-center sm:text-left space-y-1">
                      <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                      <p className="text-sm font-semibold text-orange-600">
                        ₹{item.price.toLocaleString()} each
                      </p>
                      <p className="text-xs text-gray-400">Item ID: #{item.id}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
                      <button
                        onClick={() => handleDecrement(item)}
                        className="text-gray-500 hover:text-black p-1 transition"
                        aria-label="Decrease quantity"
                      >
                        <FaMinus className="text-xs" />
                      </button>
                      <span className="font-bold text-sm min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleIncrement(item)}
                        className="text-gray-500 hover:text-black p-1 transition"
                        aria-label="Increase quantity"
                      >
                        <FaPlus className="text-xs" />
                      </button>
                    </div>

                    {/* Item Total Price */}
                    <div className="text-right min-w-[90px]">
                      <span className="text-lg font-extrabold text-gray-900">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>

                    {/* Remove Action */}
                    <button
                      onClick={() => handleRemove(item.id, item.name)}
                      className="text-gray-400 hover:text-red-500 p-2 transition"
                      title="Remove item"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-4 bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 border-b pb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping Estimate</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600 font-bold">FREE</span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Estimated GST (18%)</span>
                    <span>₹{gst.toLocaleString()}</span>
                  </div>

                  <div className="border-t pt-4 flex justify-between text-xl font-extrabold text-gray-900">
                    <span>Total Amount</span>
                    <span className="text-orange-600">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-4 rounded-xl shadow-lg hover:shadow-xl transition duration-300"
                >
                  <span>Proceed to Checkout</span>
                  <FaArrowRight className="text-sm" />
                </button>

                {/* Trust Badges */}
                <div className="pt-4 border-t space-y-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <FaShieldAlt className="text-green-600" />
                    <span>256-Bit SSL Encrypted Checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUndo className="text-blue-600" />
                    <span>7-Day Hassle-Free Returns</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}