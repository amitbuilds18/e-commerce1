import API from "./axios";

export const getCart = async () => {
  const response = await API.get("/cart");
  return response.data;
};

export const addToCart = async (
  product_id: number,
  quantity: number
) => {
  const response = await API.post("/cart", {
    product_id,
    quantity,
  });

  return response.data;
};

export const removeCart = async (id: number) => {
  const response = await API.delete(`/cart/${id}`);
  return response.data;
};