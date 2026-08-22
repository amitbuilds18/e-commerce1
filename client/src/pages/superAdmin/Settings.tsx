import { useState } from "react";

export default function Settings() {
  const [websiteName, setWebsiteName] = useState("StyleHub");
  const [supportEmail, setSupportEmail] = useState(
    "support@stylehub.com"
  );
  const [phone, setPhone] = useState("+91 9876543210");

  const [shipping, setShipping] = useState(999);
  const [shippingCharge, setShippingCharge] = useState(50);

  const [maintenance, setMaintenance] =
    useState(false);

  const handleSave = () => {
    alert("Settings Saved Successfully");
  };

  return (
    <div className="p-8">

      <h1 className="text-4xl font-bold mb-8">
        Super Admin Settings
      </h1>

      {/* Website Settings */}

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">

        <h2 className="text-2xl font-semibold mb-5">
          Website Settings
        </h2>

        <div className="space-y-4">

          <input
            type="text"
            value={websiteName}
            onChange={(e) =>
              setWebsiteName(e.target.value)
            }
            className="w-full border p-3 rounded-lg"
            placeholder="Website Name"
          />

          <input
            type="email"
            value={supportEmail}
            onChange={(e) =>
              setSupportEmail(e.target.value)
            }
            className="w-full border p-3 rounded-lg"
            placeholder="Support Email"
          />

          <input
            type="text"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
            className="w-full border p-3 rounded-lg"
            placeholder="Phone Number"
          />

        </div>

      </div>

      {/* Shipping */}

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">

        <h2 className="text-2xl font-semibold mb-5">
          Shipping Settings
        </h2>

        <div className="space-y-4">

          <input
            type="number"
            value={shipping}
            onChange={(e) =>
              setShipping(Number(e.target.value))
            }
            className="w-full border p-3 rounded-lg"
            placeholder="Free Shipping Above"
          />

          <input
            type="number"
            value={shippingCharge}
            onChange={(e) =>
              setShippingCharge(Number(e.target.value))
            }
            className="w-full border p-3 rounded-lg"
            placeholder="Shipping Charge"
          />

        </div>

      </div>

      {/* Maintenance */}

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">

        <h2 className="text-2xl font-semibold mb-5">
          Maintenance Mode
        </h2>

        <label className="flex items-center gap-3">

          <input
            type="checkbox"
            checked={maintenance}
            onChange={() =>
              setMaintenance(!maintenance)
            }
          />

          Enable Maintenance Mode

        </label>

      </div>

      <button
        onClick={handleSave}
        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg"
      >
        Save Settings
      </button>

    </div>
  );
}