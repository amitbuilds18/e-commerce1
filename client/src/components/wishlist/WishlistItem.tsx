import { FaTrash, FaShoppingCart, FaStar } from "react-icons/fa";

type Props = {
  product: any;
};

export default function WishlistItem({ product }: Props) {
  return (
    <div className="flex bg-white rounded-xl shadow-lg p-5 gap-5">

      <img
        src={product.image}
        alt={product.name}
        className="w-36 h-36 object-cover rounded-lg"
      />

      <div className="flex-1">

        <h2 className="text-2xl font-bold">
          {product.name}
        </h2>

        <p className="text-gray-500">
          {product.category}
        </p>

        <div className="flex items-center gap-2 mt-2 text-yellow-500">
          <FaStar />
          {product.rating}
        </div>

        <h3 className="text-orange-500 text-2xl font-bold mt-3">
          ₹ {product.price}
        </h3>

        <div className="flex gap-4 mt-5">

          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600">
            <FaShoppingCart />
            Add To Cart
          </button>

          <button className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600">
            <FaTrash />
            Remove
          </button>

        </div>

      </div>

    </div>
  );
}