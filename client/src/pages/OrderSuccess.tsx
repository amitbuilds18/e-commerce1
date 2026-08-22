import { Link } from "react-router-dom";

export default function OrderSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-10 rounded-xl shadow-xl text-center max-w-lg">

        <div className="text-6xl mb-5">
          ✅
        </div>

        <h2 className="text-4xl font-bold text-green-600">
          Order Confirmed
        </h2>

        <p className="text-gray-600 mt-4">
          Your order has been placed successfully.
        </p>

        <p className="text-gray-500 mt-2">
          Thank you for shopping with <b>StyleHub</b>.
        </p>

        <div className="flex justify-center gap-4 mt-8">

          <Link
            to="/orders"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            My Orders
          </Link>

          <Link
            to="/products"
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
          >
            Continue Shopping
          </Link>

        </div>

      </div>

    </div>
  );
}