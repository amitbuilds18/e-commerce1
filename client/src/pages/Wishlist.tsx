import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto py-12 px-6 min-h-[70vh]">

        <h1 className="text-5xl font-bold text-center mb-10">
          My Wishlist ❤️
        </h1>

        {wishlist.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-500 text-xl mb-8">
              Your wishlist is empty.
            </p>

            <Link
              to="/products"
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">

            {wishlist.map((item) => (
              <div
                key={item.id}
                className="border rounded-xl shadow-lg overflow-hidden"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-64 object-cover"
                />

                <div className="p-4">

                  <h2 className="text-xl font-bold">
                    {item.name}
                  </h2>

                  <p className="text-orange-500 font-bold mt-2">
                    ₹ {item.price}
                  </p>

                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>

      <Footer />
    </>
  );
}