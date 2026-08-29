import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import API from "../api/axios";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/users/profile");
        if (res.data?.user) {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-gray-800">
            Account Profile
          </h1>

          {loading && !user ? (
            <div className="bg-white p-10 rounded-2xl shadow text-center text-xl text-gray-500">
              Loading Profile...
            </div>
          ) : user ? (
            <div className="space-y-8">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl shadow p-8 flex flex-col md:flex-row items-center gap-8">
                <div className="w-24 h-24 rounded-full bg-orange-500 text-white flex items-center justify-center text-4xl font-bold uppercase shadow-md">
                  {user.name ? user.name.charAt(0) : "U"}
                </div>

                <div className="flex-1 text-center md:text-left space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
                    <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-sm font-semibold rounded-full w-fit mx-auto md:mx-0 uppercase">
                      {user.role}
                    </span>
                  </div>
                  <p className="text-gray-500 text-lg">{user.email}</p>
                  <p className="text-xs text-gray-400">User ID: #{user.id}</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-semibold transition shadow-sm"
                >
                  Logout
                </button>
              </div>

              {/* Quick Navigation Cards */}
              <div className="grid sm:grid-cols-3 gap-6">
                <div
                  onClick={() => navigate("/orders")}
                  className="bg-white p-6 rounded-2xl shadow hover:shadow-lg cursor-pointer transition border border-gray-100 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">My Orders</h3>
                    <p className="text-gray-500 text-sm">Track your shipments and view order receipts.</p>
                  </div>
                  <span className="text-orange-500 font-semibold mt-4 inline-block">View Orders →</span>
                </div>

                <div
                  onClick={() => navigate("/cart")}
                  className="bg-white p-6 rounded-2xl shadow hover:shadow-lg cursor-pointer transition border border-gray-100 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">My Cart</h3>
                    <p className="text-gray-500 text-sm">Review saved items and proceed to checkout.</p>
                  </div>
                  <span className="text-orange-500 font-semibold mt-4 inline-block">Go to Cart →</span>
                </div>

                <div
                  onClick={() => navigate("/wishlist")}
                  className="bg-white p-6 rounded-2xl shadow hover:shadow-lg cursor-pointer transition border border-gray-100 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Wishlist</h3>
                    <p className="text-gray-500 text-sm">Items you saved to purchase later.</p>
                  </div>
                  <span className="text-orange-500 font-semibold mt-4 inline-block">View Wishlist →</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-10 rounded-2xl shadow text-center">
              <p className="text-gray-500 mb-4">You are not logged in.</p>
              <button
                onClick={() => navigate("/login")}
                className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}