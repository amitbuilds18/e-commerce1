import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { getProduct } from "../api/productApi";

type Product = {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  rating: number;
};

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { success } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = useCallback(async () => {
    try {
      const data = await getProduct(Number(id));
      setProduct(data.product);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">
        Product Not Found
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto py-12 px-6 grid md:grid-cols-2 gap-12 items-start">
        <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="rounded-xl w-full max-h-[500px] object-cover"
          />
        </div>

        <div className="space-y-6">
          <div>
            <span className="text-orange-500 font-bold uppercase tracking-wider text-sm">
              {product.category}
            </span>
            <h1 className="text-4xl font-extrabold text-gray-900 mt-1">
              {product.name}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              ⭐ {product.rating}
            </span>
            <span className="text-gray-400 text-sm">In Stock: {product.stock || 50} units</span>
          </div>

          <div className="text-4xl font-extrabold text-orange-600">
            ₹ {product.price}
          </div>

          <p className="text-gray-600 text-lg leading-relaxed">
            {product.description}
          </p>

          <button
            onClick={() => {
              addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1,
              });
              success(`${product.name} added to cart!`);
            }}
            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transition duration-300"
          >
            Add To Cart 🛒
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}