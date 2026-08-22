import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ProductGrid from "../components/product/ProductGrid";
import ProductFilter from "../components/product/ProductFilter";
import { getProducts } from "../api/productApi";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();

      setProducts(data.products);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto flex gap-8 py-8">

        <div className="w-1/4">
          <ProductFilter />
        </div>

        <div className="w-3/4">

          {loading ? (
            <h2 className="text-2xl font-bold">
              Loading Products...
            </h2>
          ) : (
            <ProductGrid products={products} />
          )}

        </div>

      </div>

      <Footer />
    </>
  );
}