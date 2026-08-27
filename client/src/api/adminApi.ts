import API from "./axios";

export const getOrders = async () => {
  const res = await API.get("/admin/orders");

  return res.data.orders;
};