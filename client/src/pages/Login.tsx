import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { success, error: toastError } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from = (location.state as any)?.from?.pathname || "/";

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser({ email, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      success(`Welcome back, ${data.user.name}!`);

      if (data.user.role === "admin") {
        navigate("/admin");
      } else if (data.user.role === "superAdmin") {
        navigate("/super-admin");
      } else {
        navigate(from);
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error?.message ||
        "Login failed. Please check your credentials.";
      setError(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 shadow-2xl rounded-2xl bg-white border border-gray-100">
      <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
        Welcome Back
      </h2>
      <p className="text-center text-gray-500 mb-6">Sign in to access your StyleHub account</p>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            required
            className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            required
            className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-3.5 rounded-xl font-bold transition duration-300 shadow-md"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-orange-500 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}