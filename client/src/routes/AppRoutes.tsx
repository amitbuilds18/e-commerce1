import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";

// ================= USER =================

import Home from "../pages/Home";
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Wishlist from "../pages/Wishlist";
import Cart from "../pages/Cart";
import Profile from "../pages/Profile";
import Contact from "../pages/Contact";
import Checkout from "../pages/Checkout";
import OrderSuccess from "../pages/OrderSuccess";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentCancel from "../pages/PaymentCancel";
import MyOrders from "../pages/MyOrders";
import OrderDetails from "../pages/OrderDetails";

// ================= ADMIN =================

import AdminLayout from "../layouts/AdminLayout";
import AdminLogin from "../pages/admin/AdminLogin";
import Dashboard from "../pages/admin/Dashboard";
import AdminProducts from "../pages/admin/AdminProducts";
import AddProduct from "../pages/admin/AddProduct";
import AdminOrders from "../pages/admin/AdminOrders";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminNotifications from "../pages/admin/Notifications";

// ================= SUPER ADMIN =================

import SuperAdminLayout from "../layouts/SuperAdminLayout";
import SuperAdminLogin from "../pages/superAdmin/SuperAdminLogin";
import SuperDashboard from "../pages/superAdmin/Dashboard";
import Admins from "../pages/superAdmin/Admins";
import Users from "../pages/superAdmin/Users";
import SuperProducts from "../pages/superAdmin/Products";
import SuperOrders from "../pages/superAdmin/Orders";
import Analytics from "../pages/superAdmin/Analytics";
import SuperNotifications from "../pages/superAdmin/Notifications";
import Settings from "../pages/superAdmin/Settings";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ================= PUBLIC USER ROUTES ================= */}
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/cart" element={<Cart />} />

      {/* ================= PROTECTED USER ROUTES ================= */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment-success"
        element={
          <ProtectedRoute>
            <PaymentSuccess />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment-cancel"
        element={
          <ProtectedRoute>
            <PaymentCancel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order-success"
        element={
          <ProtectedRoute>
            <OrderSuccess />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/:id"
        element={
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        }
      />

      {/* ================= ADMIN AUTH & ROUTES ================= */}
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin", "superAdmin"]}>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/products"
        element={
          <ProtectedRoute allowedRoles={["admin", "superAdmin"]}>
            <AdminLayout>
              <AdminProducts />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/add-product"
        element={
          <ProtectedRoute allowedRoles={["admin", "superAdmin"]}>
            <AdminLayout>
              <AddProduct />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute allowedRoles={["admin", "superAdmin"]}>
            <AdminLayout>
              <AdminOrders />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin", "superAdmin"]}>
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/notifications"
        element={
          <ProtectedRoute allowedRoles={["admin", "superAdmin"]}>
            <AdminLayout>
              <AdminNotifications />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* ================= SUPER ADMIN AUTH & ROUTES ================= */}
      <Route
        path="/super-admin/login"
        element={<SuperAdminLogin />}
      />

      <Route
        path="/super-admin"
        element={
          <ProtectedRoute allowedRoles={["superAdmin"]}>
            <SuperAdminLayout>
              <SuperDashboard />
            </SuperAdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/super-admin/admins"
        element={
          <ProtectedRoute allowedRoles={["superAdmin"]}>
            <SuperAdminLayout>
              <Admins />
            </SuperAdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/super-admin/users"
        element={
          <ProtectedRoute allowedRoles={["superAdmin"]}>
            <SuperAdminLayout>
              <Users />
            </SuperAdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/super-admin/products"
        element={
          <ProtectedRoute allowedRoles={["superAdmin"]}>
            <SuperAdminLayout>
              <SuperProducts />
            </SuperAdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/super-admin/orders"
        element={
          <ProtectedRoute allowedRoles={["superAdmin"]}>
            <SuperAdminLayout>
              <SuperOrders />
            </SuperAdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/super-admin/analytics"
        element={
          <ProtectedRoute allowedRoles={["superAdmin"]}>
            <SuperAdminLayout>
              <Analytics />
            </SuperAdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/super-admin/notifications"
        element={
          <ProtectedRoute allowedRoles={["superAdmin"]}>
            <SuperAdminLayout>
              <SuperNotifications />
            </SuperAdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/super-admin/settings"
        element={
          <ProtectedRoute allowedRoles={["superAdmin"]}>
            <SuperAdminLayout>
              <Settings />
            </SuperAdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}