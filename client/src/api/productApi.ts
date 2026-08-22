import API from "./axios";

export const getProducts = async () => {
  const response = await API.get("/products");
  return response.data;
};

export const getProduct = async (id: number) => {
  const response = await API.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (data: {
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  rating: number;
}) => {
  const response = await API.post("/products", data);
  return response.data;
};

export const updateProduct = async (
  id: number,
  data: {
    name: string;
    description: string;
    category: string;
    price: number;
    image: string;
    rating: number;
  }
) => {
  const response = await API.put(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: number) => {
  const response = await API.delete(`/products/${id}`);
  return response.data;
};