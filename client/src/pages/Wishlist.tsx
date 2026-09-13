import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaShoppingCart, FaHeart } from "react-icons/fa";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { success, info } = useToast();
  const navigate = useNavigate();

  const handleMoveToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
    });
    removeFromWishlist(item.id);
    success(`Moved ${item.name} to Cart 🛒`);
  };

  const handleRemove = (id: number, name: string) => {
    removeFromWishlist(id);
    info(`Removed ${name} from wishlist`);
  };

  return (
    <>
      <Navbar />

      <div className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <FaHeart className="text-red-500 text-2xl" />
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                My Wishlist ({wishlist.length})
              </h1>
            </div>

            {wishlist.length > 0 && (
              <button
                onClick={() => navigate("/products")}
                className="text-orange-500 font-semibold text-sm hover:underline"
              >
                + Discover More
              </button>
            )}
          </div>

          {wishlist.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center max-w-lg mx-auto">
              <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                ❤️
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-gray-500 mb-8 text-sm">
                Save items you love by tapping the heart icon on any product card.
              </p>
              <Link
                to="/products"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg transition duration-300 inline-block"
              >
                Explore Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition duration-300 flex flex-col justify-between"
                >
                  <div className="relative group">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
                    />
                    <button
                      onClick={() => handleRemove(item.id, item.name)}
                      className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full text-gray-400 hover:text-red-500 shadow transition"
                      title="Remove from wishlist"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>

                  <div className="p-5 space-y-3">
                    <Link to={`/product/${item.id}`} className="block">
                      <h3 className="font-bold text-gray-900 truncate hover:text-orange-500 transition">
                        {item.name}
                      </h3>
                    </Link>

                    <div className="text-xl font-extrabold text-orange-600">
                      ₹{item.price.toLocaleString()}
                    </div>

                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-orange-500 text-white font-bold py-2.5 rounded-xl transition duration-300 text-sm shadow"
                    >
                      <FaShoppingCart className="text-xs" /> Move To Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}