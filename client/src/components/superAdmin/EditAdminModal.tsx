import { useState } from "react";
import { updateAdmin } from "../../api/superAdminApi";

type Props = {
  admin: {
    id: number;
    name: string;
    email: string;
  };
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditAdminModal({
  admin,
  onClose,
  onSuccess,
}: Props) {
  const [name, setName] = useState(admin.name);
  const [email, setEmail] = useState(admin.email);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      await updateAdmin(admin.id, {
        name,
        email,
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

      <div className="bg-white rounded-xl p-8 w-96">

        <h2 className="text-2xl font-bold mb-6">
          Edit Admin
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            className="border w-full p-3 rounded mb-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="border w-full p-3 rounded mb-6"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button
              className="bg-blue-600 text-white px-5 py-2 rounded"
            >
              Update
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}