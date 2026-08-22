import ProductGrid from "../product/ProductGrid";
import { products } from "../../data/products";

export default function TrendingProducts() {
  const trendingProducts = products.filter(
    (product) => product.isTrending
  );

  return (
    <section className="max-w-7xl mx-auto py-16">
      <h2 className="text-4xl font-bold mb-8">Trending Products</h2>

      <ProductGrid products={trendingProducts} />
    </section>
  );
}