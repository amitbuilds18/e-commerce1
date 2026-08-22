import ProductGrid from "../product/ProductGrid";
import { products } from "../../data/products";

export default function BestSellers() {
  const bestSellerProducts = products.filter(
    (product) => product.isBestSeller
  );

  return (
    <section className="max-w-7xl mx-auto py-16">
      <h2 className="text-4xl font-bold mb-8">Best Sellers</h2>

      <ProductGrid products={bestSellerProducts} />
    </section>
  );
}