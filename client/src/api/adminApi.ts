import axios from "axios";

const API = "http://localhost:5000/api/admin";

export const getOrders = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${API}/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.orders;
};