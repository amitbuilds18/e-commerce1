import { useEffect, useState } from "react";
import ProductGrid from "../product/ProductGrid";
import { products as fallbackProducts } from "../../data/products";
import { getProducts } from "../../api/productApi";

export default function BestSellers() {
  const [items, setItems] = useState(() =>
    fallbackProducts.filter((product) => product.isBestSeller)
  );

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        if (data?.products && data.products.length > 8) {
          setItems(data.products.slice(8, 12));
        } else if (data?.products && data.products.length > 0) {
          setItems(data.products);
        }
      } catch (err) {
        // Keep fallback products
      }
    };

    loadProducts();
  }, []);

  return (
    <section className="max-w-7xl mx-auto py-16 px-6">
      <h2 className="text-4xl font-bold mb-8">Best Sellers</h2>
      <ProductGrid products={items} />
    </section>
  );
}