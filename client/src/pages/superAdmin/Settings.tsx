import { useState } from "react";
import {
  FaStore,
  FaShippingFast,
  FaShieldAlt,
  FaSave,
} from "react-icons/fa";
import { useToast } from "../../context/ToastContext";

export default function Settings() {
  const { success } = useToast();
  const [activeTab, setActiveTab] = useState<"general" | "shipping" | "security">("general");

  // General Settings
  const [websiteName, setWebsiteName] = useState("StyleHub");
  const [supportEmail, setSupportEmail] = useState("support@stylehub.com");
  const [phone, setPhone] = useState("+91 9876543210");
  const [currency, setCurrency] = useState("INR (₹)");

  // Shipping & Taxes
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(2000);
  const [flatShippingFee, setFlatShippingFee] = useState(50);
  const [gstPercentage, setGstPercentage] = useState(18);

  // Security & System Mode
  const [maintenance, setMaintenance] = useState(false);
  const [allowRegistrations, setAllowRegistrations] = useState(true);
  const [rateLimitStrict, setRateLimitStrict] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    success("Platform configuration updated successfully! 🚀");
  };

  return (
    <div className="p-8 max-w-5xl space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900">System Settings</h1>
        <p className="text-gray-500 text-sm mt-1">
          Configure global platform parameters, financial rules, and security controls
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b space-x-8">
        <button
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-2 pb-4 text-sm font-bold transition border-b-2 ${
            activeTab === "general"
              ? "border-purple-600 text-purple-600"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <FaStore />
          <span>General Store</span>
        </button>

        <button
          onClick={() => setActiveTab("shipping")}
          className={`flex items-center gap-2 pb-4 text-sm font-bold transition border-b-2 ${
            activeTab === "shipping"
              ? "border-purple-600 text-purple-600"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <FaShippingFast />
          <span>Shipping & GST</span>
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 pb-4 text-sm font-bold transition border-b-2 ${
            activeTab === "security"
              ? "border-purple-600 text-purple-600"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <FaShieldAlt />
          <span>Security & System</span>
        </button>
      </div>

      {/* Tab Content */}
      <form onSubmit={handleSave} className="space-y-8">
        {activeTab === "general" && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Brand & Store Profile</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Store Display Name
                </label>
                <input
                  type="text"
                  value={websiteName}
                  onChange={(e) => setWebsiteName(e.target.value)}
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Base Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-400 outline-none bg-white font-semibold"
                >
                  <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                  <option value="USD ($)">USD ($) - US Dollar</option>
                  <option value="EUR (€)">EUR (€) - Euro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Support Email
                </label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Helpline Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Shipping Rates & Tax Calculations</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Free Shipping Above (₹)
                </label>
                <input
                  type="number"
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-400 outline-none font-bold"
                />
                <p className="text-xs text-gray-400 mt-1">Orders above this qualify for free delivery</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Flat Standard Delivery Fee (₹)
                </label>
                <input
                  type="number"
                  value={flatShippingFee}
                  onChange={(e) => setFlatShippingFee(Number(e.target.value))}
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-400 outline-none font-bold"
                />
                <p className="text-xs text-gray-400 mt-1">Standard courier charge</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  GST Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={gstPercentage}
                  onChange={(e) => setGstPercentage(Number(e.target.value))}
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-400 outline-none font-bold"
                />
                <p className="text-xs text-gray-400 mt-1">Standard apparel GST slab</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">System State & Security Rules</h2>

            <div className="space-y-4">
              <label className="flex items-start justify-between p-4 border rounded-2xl cursor-pointer hover:bg-gray-50 transition">
                <div>
                  <div className="font-bold text-gray-900">Allow Customer Registrations</div>
                  <div className="text-xs text-gray-500">Enable new shoppers to create accounts</div>
                </div>
                <input
                  type="checkbox"
                  checked={allowRegistrations}
                  onChange={(e) => setAllowRegistrations(e.target.checked)}
                  className="accent-purple-600 w-5 h-5 mt-1"
                />
              </label>

              <label className="flex items-start justify-between p-4 border rounded-2xl cursor-pointer hover:bg-gray-50 transition">
                <div>
                  <div className="font-bold text-gray-900">Strict Auth Rate Limiting</div>
                  <div className="text-xs text-gray-500">Enforce brute-force login lockouts</div>
                </div>
                <input
                  type="checkbox"
                  checked={rateLimitStrict}
                  onChange={(e) => setRateLimitStrict(e.target.checked)}
                  className="accent-purple-600 w-5 h-5 mt-1"
                />
              </label>

              <label className="flex items-start justify-between p-4 border border-amber-200 bg-amber-50/50 rounded-2xl cursor-pointer hover:bg-amber-50 transition">
                <div>
                  <div className="font-bold text-amber-900">Maintenance Mode</div>
                  <div className="text-xs text-amber-700">Display maintenance screen to public shoppers</div>
                </div>
                <input
                  type="checkbox"
                  checked={maintenance}
                  onChange={(e) => setMaintenance(e.target.checked)}
                  className="accent-amber-600 w-5 h-5 mt-1"
                />
              </label>
            </div>
          </div>
        )}

        {/* Save Button */}
        <button
          type="submit"
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition"
        >
          <FaSave />
          <span>Save System Settings</span>
        </button>
      </form>
    </div>
  );
}