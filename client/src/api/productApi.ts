import API from "./axios";

export interface GetProductsParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sort?: "price_asc" | "price_desc" | "rating_desc" | "newest" | string;
  page?: number;
  limit?: number;
}

export const getProducts = async (params?: GetProductsParams) => {
  const response = await API.get("/products", { params });
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