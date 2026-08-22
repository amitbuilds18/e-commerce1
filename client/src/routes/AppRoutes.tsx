import { Routes, Route } from "react-router-dom";

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
import OrderDetails from "../pages/OrderDetails";

export default function AppRoutes() {
  return (
    <Routes>

      {/* ================= USER ================= */}

      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/contact" element={<Contact />} />

      <Route path="/checkout" element={<Checkout />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-cancel" element={<PaymentCancel />} />
      <Route path="/order-success" element={<OrderSuccess />} />

      {/* User Orders */}
      <Route path="/orders" element={<MyOrders />} />

      {/* ================= ADMIN ================= */}

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/admin"
        element={
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/products"
        element={
          <AdminLayout>
            <AdminProducts />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/add-product"
        element={
          <AdminLayout>
            <AddProduct />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/orders"
        element={
          <AdminLayout>
            <AdminOrders />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminLayout>
            <AdminUsers />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/notifications"
        element={
          <AdminLayout>
            <AdminNotifications />
          </AdminLayout>
        }
      />

      {/* ================= SUPER ADMIN ================= */}

      <Route
        path="/super-admin/login"
        element={<SuperAdminLogin />}
      />

      <Route
        path="/super-admin"
        element={
          <SuperAdminLayout>
            <SuperDashboard />
          </SuperAdminLayout>
        }
      />

      <Route
        path="/super-admin/admins"
        element={
          <SuperAdminLayout>
            <Admins />
          </SuperAdminLayout>
        }
      />

      <Route
        path="/super-admin/users"
        element={
          <SuperAdminLayout>
            <Users />
          </SuperAdminLayout>
        }
      />

      <Route
        path="/super-admin/products"
        element={
          <SuperAdminLayout>
            <SuperProducts />
          </SuperAdminLayout>
        }
      />

      <Route
        path="/super-admin/orders"
        element={
          <SuperAdminLayout>
            <SuperOrders />
          </SuperAdminLayout>
        }
      />

      <Route
        path="/super-admin/analytics"
        element={
          <SuperAdminLayout>
            <Analytics />
          </SuperAdminLayout>
        }
      />

      <Route
        path="/super-admin/notifications"
        element={
          <SuperAdminLayout>
            <SuperNotifications />
          </SuperAdminLayout>
        }
      />

      <Route
        path="/super-admin/settings"
        element={
          <SuperAdminLayout>
            <Settings />
          </SuperAdminLayout>
        }
      />
      <Route
  path="/orders/:id"
  element={<OrderDetails />}
/>

    </Routes>
  );
}