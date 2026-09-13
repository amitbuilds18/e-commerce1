import API from "./axios";

export const getNotifications = async () => {
  const res = await API.get("/notifications");
  return res.data;
};

export const readNotification = async (id: number) => {
  const res = await API.put(`/notifications/${id}`);
  return res.data;
};

export const createNotification = async (message: string) => {
  const res = await API.post("/notifications", { message });
  return res.data;
};

export const deleteNotification = async (id: number) => {
  const res = await API.delete(`/notifications/${id}`);
  return res.data;
};