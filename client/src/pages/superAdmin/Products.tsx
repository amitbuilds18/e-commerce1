import { useEffect, useState } from "react";
import {
  getProducts,
  deleteProduct,
} from "../../api/productApi";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data.products || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete Product?")) return;

    await deleteProduct(id);
    fetchProducts();
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="p-6">

      <div className="flex justify-between mb-6">

        <h1 className="text-4xl font-bold">
          Super Admin Products
        </h1>

        <button className="bg-purple-600 text-white px-5 py-2 rounded">
          + Add Product
        </button>

      </div>

      <table className="w-full bg-white shadow rounded">

        <thead className="bg-gray-100">

          <tr>

            <th className="p-4">Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Rating</th>
            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {products.map((product) => (

            <tr key={product.id} className="border-t">

              <td className="p-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-14 h-14 rounded object-cover"
                />
              </td>

              <td>{product.name}</td>

              <td>{product.category}</td>

              <td>₹{product.price}</td>

              <td>⭐ {product.rating}</td>

              <td>

                <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2">
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}