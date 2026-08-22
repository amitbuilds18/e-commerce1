import API from "./axios";

export const getDashboardStats = async () => {
  const response = await API.get("/admin/dashboard");
  return response.data;
};