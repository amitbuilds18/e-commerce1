import API from "./axios";

// ============================
// CREATE ORDER (COD)
// ============================

export const createOrder = async (order: {
  product_id: number;
  quantity: number;
  total: number;
}) => {
  const res = await API.post("/orders", order);
  return res.data;
};

// ============================
// USER MY ORDERS
// ============================

export const getMyOrders = async () => {
  const res = await API.get("/orders/my-orders");
  return res.data.orders;
};

// ============================
// ORDER DETAILS
// ============================

export const getOrderDetails = async (id: string) => {
  const res = await API.get(`/orders/${id}`);
  return res.data.order;
};

// ============================
// ADMIN GET ALL ORDERS
// ============================

export const getOrders = async () => {
  const res = await API.get("/orders");
  return res.data.orders;
};

// ============================
// UPDATE ORDER STATUS
// ============================

export const updateOrderStatus = async (
  id: number,
  status: string
) => {
  const res = await API.put(`/orders/${id}`, {
    status,
  });

  return res.data;
};

// ============================
// DELETE ORDER
// ============================

export const deleteOrder = async (id: number) => {
  const res = await API.delete(`/orders/${id}`);
  return res.data;
};