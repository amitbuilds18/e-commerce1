import { useState } from "react";
import { createAdmin } from "../../api/superAdminApi";

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

export default function AddAdminModal({
  onClose,
  onSuccess,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      await createAdmin({
        name,
        email,
        password,
      });

      alert("Admin Created Successfully");

      onSuccess();
      onClose();
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

      <div className="bg-white p-8 rounded-xl w-96">

        <h2 className="text-2xl font-bold mb-6">
          Add Admin
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg w-full mb-4"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="border p-3 rounded-lg w-full mb-4"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="border p-3 rounded-lg w-full mb-6"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-purple-600 text-white px-5 py-2 rounded-lg"
            >
              Create
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}