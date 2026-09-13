import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShieldAlt,
  FaLock,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaUserTie,
} from "react-icons/fa";
import { loginUser } from "../../api/authApi";
import { useToast } from "../../context/ToastContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser({
        email,
        password,
      });

      if (data.user.role !== "admin" && data.user.role !== "superAdmin") {
        const msg = "Access Denied. You do not have administrator permissions.";
        setError(msg);
        toastError(msg);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      success(`Welcome back, Admin ${data.user.name || ""}!`);
      navigate("/admin");
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error?.message ||
        "Admin authentication failed";
      setError(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient Glowing Background Orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Store Link */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white text-xs font-bold transition z-20"
      >
        <FaArrowLeft /> Return to Store
      </Link>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-orange-500/20 rounded-3xl shadow-2xl p-8 sm:p-10 space-y-8">
          {/* Header & Icon */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto shadow-lg shadow-orange-500/30 border border-orange-400/30">
              <FaUserTie />
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold tracking-widest uppercase bg-orange-500/10 text-orange-400 border border-orange-500/30">
                <FaShieldAlt className="text-[10px]" /> Staff Management
              </span>
              <h1 className="text-3xl font-black text-white tracking-tight mt-2">
                Admin Console
              </h1>
              <p className="text-slate-400 text-xs mt-1">
                Sign in to manage products, orders, and customer queries
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Staff Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-3.5 text-slate-500 text-sm" />
                <input
                  type="email"
                  required
                  placeholder="admin@stylehub.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-3.5 text-slate-500 text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl pl-11 pr-11 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300 transition"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition duration-300 text-sm tracking-wide mt-2"
            >
              {loading ? "Authenticating..." : "Sign In to Admin Console"}
            </button>
          </form>

          {/* Footer Security Badge */}
          <div className="pt-4 border-t border-slate-800 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Protected Staff Access Session</span>
            </div>

            <div className="text-xs text-slate-500 pt-1">
              Need executive control?{" "}
              <Link to="/super-admin/login" className="text-orange-400 hover:text-orange-300 font-semibold underline">
                Go to Super Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}