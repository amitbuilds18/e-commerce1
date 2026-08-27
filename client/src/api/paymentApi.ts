import API from "./axios";

export const createCheckoutSession = async (
  amount: number,
  cart: any[]
) => {
  const res = await API.post(
    "/payment/create-checkout-session",
    {
      amount,
      cart,
    },
  );

  return res.data;
};