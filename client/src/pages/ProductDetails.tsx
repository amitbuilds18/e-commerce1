import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useCart } from "../context/CartContext";
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

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await getProduct(Number(id));
      setProduct(data.product);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h1 className="text-center mt-20">Loading...</h1>;
  }

  if (!product) {
    return <h1 className="text-center mt-20">Product Not Found</h1>;
  }

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto py-10 px-6 grid md:grid-cols-2 gap-10">

        <img
          src={product.image}
          alt={product.name}
          className="rounded-xl shadow-lg w-full"
        />

        <div>

          <h1 className="text-4xl font-bold">
            {product.name}
          </h1>

          <p className="text-xl text-gray-500 mt-3">
            {product.category}
          </p>

          <p className="text-yellow-500 text-xl mt-3">
            ⭐ {product.rating}
          </p>

          <h2 className="text-3xl text-orange-500 font-bold mt-6">
            ₹ {product.price}
          </h2>

          <p className="mt-6 text-gray-600">
            {product.description}
          </p>

          <p className="mt-4 font-semibold">
            Stock : {product.stock}
          </p>

          <button
            onClick={() =>
              addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1,
              })
            }
            className="mt-8 bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600"
          >
            Add To Cart
          </button>

        </div>

      </div>

      <Footer />
    </>
  );
}