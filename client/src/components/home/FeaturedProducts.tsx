import ProductGrid from "../product/ProductGrid";
import { products } from "../../data/products";

export default function FeaturedProducts() {
  const featuredProducts = products.filter(
    (product) => product.isFeatured
  );

  return (
    <section className="max-w-7xl mx-auto py-16">
      <h2 className="text-4xl font-bold mb-8">Featured Products</h2>

      <ProductGrid products={featuredProducts} />
    </section>
  );
}