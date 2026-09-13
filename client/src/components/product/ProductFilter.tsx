import { FaStar, FaUndo } from "react-icons/fa";

interface ProductFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  minPrice: string;
  maxPrice: string;
  onPriceChange: (min: string, max: string) => void;
  minRating: string;
  onRatingChange: (rating: string) => void;
  onReset: () => void;
}

const CATEGORIES = ["All", "Men", "Women", "Accessories", "Shoes", "Kids"];

export default function ProductFilter({
  selectedCategory,
  onSelectCategory,
  minPrice,
  maxPrice,
  minRating,
  onRatingChange,
  onPriceChange,
  onReset,
}: ProductFilterProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 space-y-6 sticky top-20">
      <div className="flex items-center justify-between border-b pb-4">
        <h3 className="text-xl font-bold text-gray-900">Filters</h3>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-600 font-semibold transition"
          title="Reset all filters"
        >
          <FaUndo className="text-xs" /> Reset
        </button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wider">
          Categories
        </h4>
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-sm font-medium transition duration-200 flex justify-between items-center ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span>{cat}</span>
              {selectedCategory.toLowerCase() === cat.toLowerCase() && (
                <span className="text-xs">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wider">
          Price Range (₹)
        </h4>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Min</label>
            <input
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => onPriceChange(e.target.value, maxPrice)}
              className="w-full border rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-orange-400 outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Max</label>
            <input
              type="number"
              placeholder="10000"
              value={maxPrice}
              onChange={(e) => onPriceChange(minPrice, e.target.value)}
              className="w-full border rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-orange-400 outline-none"
            />
          </div>
        </div>

        {/* Quick Price Shortcuts */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onPriceChange("", "1000")}
            className="text-xs bg-gray-100 hover:bg-orange-100 hover:text-orange-700 px-2.5 py-1 rounded-full text-gray-600 transition"
          >
            Under ₹1000
          </button>
          <button
            onClick={() => onPriceChange("1000", "3000")}
            className="text-xs bg-gray-100 hover:bg-orange-100 hover:text-orange-700 px-2.5 py-1 rounded-full text-gray-600 transition"
          >
            ₹1000 - ₹3000
          </button>
          <button
            onClick={() => onPriceChange("3000", "")}
            className="text-xs bg-gray-100 hover:bg-orange-100 hover:text-orange-700 px-2.5 py-1 rounded-full text-gray-600 transition"
          >
            Above ₹3000
          </button>
        </div>
      </div>

      {/* Customer Rating Filter */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wider">
          Rating
        </h4>
        <div className="space-y-1.5">
          {[
            { label: "4.5★ & Above", value: "4.5" },
            { label: "4.0★ & Above", value: "4.0" },
            { label: "3.5★ & Above", value: "3.5" },
            { label: "All Ratings", value: "" },
          ].map((r) => (
            <button
              key={r.label}
              onClick={() => onRatingChange(r.value)}
              className={`w-full text-left px-3 py-1.5 rounded-xl text-sm flex items-center gap-2 transition ${
                minRating === r.value
                  ? "bg-amber-100 text-amber-900 font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <FaStar className="text-amber-500 text-xs" />
              <span>{r.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}