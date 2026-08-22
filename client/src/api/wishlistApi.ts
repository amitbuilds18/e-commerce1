import API from "./axios";

export const getWishlist = async () => {
  const response = await API.get("/wishlist");
  return response.data;
};

export const addWishlist = async (
  product_id: number
) => {
  const response = await API.post("/wishlist", {
    product_id,
  });

  return response.data;
};

export const removeWishlist = async (
  id: number
) => {
  const response = await API.delete(`/wishlist/${id}`);
  return response.data;
};