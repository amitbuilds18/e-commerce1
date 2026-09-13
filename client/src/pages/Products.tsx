import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
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
  const [searchParams, setSearchParams] = useSearchParams();

  const searchParam = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category") || "All";
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";
  const ratingParam = searchParams.get("rating") || "";
  const sortParam = searchParams.get("sort") || "newest";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Local Search Input state for debouncing
  const [searchInput, setSearchInput] = useState(searchParam);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProducts({
        search: searchParam || undefined,
        category: categoryParam !== "All" ? categoryParam : undefined,
        minPrice: minPriceParam ? Number(minPriceParam) : undefined,
        maxPrice: maxPriceParam ? Number(maxPriceParam) : undefined,
        rating: ratingParam ? Number(ratingParam) : undefined,
        sort: sortParam,
        page: pageParam,
        limit: 12,
      });

      setProducts(data.products || []);
      setTotalProducts(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  }, [searchParam, categoryParam, minPriceParam, maxPriceParam, ratingParam, sortParam, pageParam]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchParam) {
        updateQuery({ search: searchInput || undefined, page: "1" });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const updateQuery = (newParams: Record<string, string | undefined>) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === undefined || val === "") {
        nextParams.delete(key);
      } else {
        nextParams.set(key, val);
      }
    });
    setSearchParams(nextParams);
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setSearchParams(new URLSearchParams());
  };

  return (
    <>
      <Navbar />

      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Explore Catalog</h1>
              <p className="text-gray-500 text-sm mt-1">
                Showing {products.length} of {totalProducts} products
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              {/* Search Box */}
              <div className="relative w-full sm:w-72">
                <FaSearch className="absolute left-3.5 top-3.5 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 focus:bg-white transition"
                />
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortParam}
                onChange={(e) => updateQuery({ sort: e.target.value, page: "1" })}
                className="w-full sm:w-auto border rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 outline-none focus:ring-2 focus:ring-orange-400 transition"
              >
                <option value="newest">Sort by: Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Main Grid & Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filter Sidebar */}
            <div className="lg:col-span-1">
              <ProductFilter
                selectedCategory={categoryParam}
                onSelectCategory={(cat) => updateQuery({ category: cat !== "All" ? cat : undefined, page: "1" })}
                minPrice={minPriceParam}
                maxPrice={maxPriceParam}
                onPriceChange={(min, max) => updateQuery({ minPrice: min || undefined, maxPrice: max || undefined, page: "1" })}
                minRating={ratingParam}
                onRatingChange={(r) => updateQuery({ rating: r || undefined, page: "1" })}
                onReset={handleResetFilters}
              />
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100" />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-800">No Products Found</h3>
                  <p className="text-gray-500 mt-2">
                    Try adjusting your filters, price range, or search keywords.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-6 bg-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-orange-600 transition shadow"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <>
                  <ProductGrid products={products} />

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-10">
                      <button
                        onClick={() => updateQuery({ page: String(Math.max(1, pageParam - 1)) })}
                        disabled={pageParam <= 1}
                        className="px-4 py-2 rounded-xl border bg-white text-sm font-semibold disabled:opacity-40 hover:bg-gray-50 transition"
                      >
                        ← Prev
                      </button>

                      {[...Array(totalPages)].map((_, idx) => {
                        const p = idx + 1;
                        return (
                          <button
                            key={p}
                            onClick={() => updateQuery({ page: String(p) })}
                            className={`w-10 h-10 rounded-xl text-sm font-bold transition ${
                              pageParam === p
                                ? "bg-orange-500 text-white shadow-md"
                                : "bg-white border text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {p}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => updateQuery({ page: String(Math.min(totalPages, pageParam + 1)) })}
                        disabled={pageParam >= totalPages}
                        className="px-4 py-2 rounded-xl border bg-white text-sm font-semibold disabled:opacity-40 hover:bg-gray-50 transition"
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}