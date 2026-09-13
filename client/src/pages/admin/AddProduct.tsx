import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlusCircle, FaArrowLeft, FaImage } from "react-icons/fa";
import { createProduct } from "../../api/productApi";
import { useToast } from "../../context/ToastContext";

export default function AddProduct() {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Men",
    price: "",
    image: "",
    rating: "4.5",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      await createProduct({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: Number(formData.price),
        image: formData.image,
        rating: Number(formData.rating),
      });

      success(`Product "${formData.name}" added to catalog! 🎉`);
      navigate("/admin/products");
    } catch (error: any) {
      console.error(error);
      toastError(error.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <button
            onClick={() => navigate("/admin/products")}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-xs font-bold mb-2 transition"
          >
            <FaArrowLeft /> Back to Catalog
          </button>
          <h1 className="text-3xl font-extrabold text-gray-900">Add New Product</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form */}
        <div className="lg:col-span-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Product Title
              </label>
              <input
                name="name"
                required
                placeholder="e.g. Slim-Fit Linen Shirt"
                className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Description
              </label>
              <textarea
                name="description"
                required
                placeholder="Details on material, fit, stitching, and care..."
                className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                rows={4}
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-400 outline-none bg-white font-semibold"
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Kids">Kids</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Price (₹)
                </label>
                <input
                  name="price"
                  type="number"
                  required
                  placeholder="2499"
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-400 outline-none font-bold"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Initial Rating
                </label>
                <input
                  name="rating"
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  required
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                  value={formData.rating}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Product Image URL
              </label>
              <input
                name="image"
                required
                placeholder="https://images.unsplash.com/..."
                className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                value={formData.image}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition"
            >
              <FaPlusCircle />
              <span>{loading ? "Adding Product..." : "Publish Product"}</span>
            </button>
          </form>
        </div>

        {/* Live Card Preview */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4 sticky top-24">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
            Live Catalog Preview
          </h2>

          <div className="rounded-2xl border shadow-md overflow-hidden bg-white">
            {formData.image ? (
              <img
                src={formData.image}
                alt="Preview"
                className="w-full h-56 object-cover bg-gray-50"
                onError={(e) => {
                  (e.target as any).src = "https://placehold.co/400x300?text=Invalid+Image+URL";
                }}
              />
            ) : (
              <div className="w-full h-56 bg-gray-100 flex flex-col items-center justify-center text-gray-400 gap-2">
                <FaImage className="text-3xl" />
                <span className="text-xs">Enter Image URL to Preview</span>
              </div>
            )}

            <div className="p-4 space-y-1.5">
              <span className="text-xs font-semibold text-orange-500 uppercase">
                {formData.category}
              </span>
              <h3 className="font-bold text-gray-900 truncate">
                {formData.name || "Product Name"}
              </h3>
              <p className="text-xs text-gray-400 line-clamp-2">
                {formData.description || "Description preview will appear here..."}
              </p>
              <div className="pt-2 flex justify-between items-center">
                <span className="text-lg font-extrabold text-orange-600">
                  ₹{Number(formData.price || 0).toLocaleString()}
                </span>
                <span className="text-xs text-yellow-600 font-bold bg-yellow-50 px-2 py-0.5 rounded">
                  ⭐ {formData.rating || "4.5"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}