import API from "./axios";

// ==========================
// ADMIN APIs
// ==========================

export const getAdmins = async () => {
  const res = await API.get("/super-admin/admins");
  return res.data;
};

export const createAdmin = async (admin: any) => {
  const res = await API.post("/super-admin/admins", admin);
  return res.data;
};

export const updateAdmin = async (
  id: number,
  admin: any
) => {
  const res = await API.put(
    `/super-admin/admins/${id}`,
    admin
  );
  return res.data;
};

export const deleteAdmin = async (
  id: number
) => {
  const res = await API.delete(
    `/super-admin/admins/${id}`
  );
  return res.data;
};

// ==========================
// USER APIs
// ==========================

export const getUsers = async () => {
  const res = await API.get("/super-admin/users");
  return res.data;
};

export const blockUser = async (
  id: number
) => {
  const res = await API.put(
    `/super-admin/users/${id}/block`
  );
  return res.data;
};

export const deleteUser = async (
  id: number
) => {
  const res = await API.delete(
    `/super-admin/users/${id}`
  );
  return res.data;
};