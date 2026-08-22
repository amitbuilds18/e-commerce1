import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../api/productApi";

export default function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    image: "",
    rating: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      await createProduct({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: Number(formData.price),
        image: formData.image,
        rating: Number(formData.rating),
      });

      alert("Product Added Successfully");
      navigate("/admin/products");
    } catch (error) {
      console.log(error);
      alert("Failed to Add Product");
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow">
      <h1 className="text-3xl font-bold mb-8">
        Add Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <input
          name="name"
          placeholder="Product Name"
          className="w-full border p-3 rounded"
          value={formData.name}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          className="w-full border p-3 rounded"
          rows={4}
          value={formData.description}
          onChange={handleChange}
        />

        <input
          name="category"
          placeholder="Category"
          className="w-full border p-3 rounded"
          value={formData.category}
          onChange={handleChange}
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          className="w-full border p-3 rounded"
          value={formData.price}
          onChange={handleChange}
        />

        <input
          name="image"
          placeholder="Image URL"
          className="w-full border p-3 rounded"
          value={formData.image}
          onChange={handleChange}
        />

        <input
          name="rating"
          type="number"
          step="0.1"
          placeholder="Rating"
          className="w-full border p-3 rounded"
          value={formData.rating}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}