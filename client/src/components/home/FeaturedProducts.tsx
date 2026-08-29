import { useEffect, useState } from "react";
import ProductGrid from "../product/ProductGrid";
import { products as fallbackProducts } from "../../data/products";
import { getProducts } from "../../api/productApi";

export default function FeaturedProducts() {
  const [items, setItems] = useState(() =>
    fallbackProducts.filter((product) => product.isFeatured)
  );

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        if (data?.products && data.products.length > 0) {
          setItems(data.products.slice(0, 4));
        }
      } catch (err) {
        // Keep fallback products
      }
    };

    loadProducts();
  }, []);

  return (
    <section className="max-w-7xl mx-auto py-16 px-6">
      <h2 className="text-4xl font-bold mb-8">Featured Products</h2>
      <ProductGrid products={items} />
    </section>
  );
}