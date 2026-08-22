import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

type ProductProps = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
};

export default function ProductCard({
  id,
  name,
  price,
  image,
  category,
  rating,
}: ProductProps) {
  const { addToCart } = useCart();

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlist();

  const handleAddToCart = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      id,
      name,
      price,
      image,
      quantity: 1,
    });

    alert(`${name} added to cart!`);
  };

  const handleWishlist = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist(id)) {
      removeFromWishlist(id);
    } else {
      addToWishlist({
        id,
        name,
        price,
        image,
      });
    }
  };

  return (
    <div className="rounded-xl border shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 relative">

      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-lg"
      >
        <FaHeart
          className={
            isInWishlist(id)
              ? "text-red-500 text-xl"
              : "text-gray-400 text-xl"
          }
        />
      </button>

      <Link to={`/product/${id}`}>
        <img
          src={image}
          alt={name}
          className="w-full h-72 object-cover"
        />

        <div className="p-4">
          <h2 className="text-xl font-bold">{name}</h2>

          <p className="text-gray-500">{category}</p>

          <p className="text-yellow-500 mt-2">
            ⭐ {rating}
          </p>
        </div>
      </Link>

      <div className="flex justify-between items-center px-4 pb-4">

        <span className="text-orange-500 font-bold text-lg">
          ₹ {price}
        </span>

        <button
          onClick={handleAddToCart}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          Add To Cart
        </button>

      </div>

    </div>
  );
}