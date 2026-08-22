import axios from "axios";

const API = "http://localhost:5000/api/payment";

export const createCheckoutSession = async (
  amount: number,
  cart: any[]
) => {
  const token = localStorage.getItem("token");

  const res = await axios.post(
    `${API}/create-checkout-session`,
    {
      amount,
      cart,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};