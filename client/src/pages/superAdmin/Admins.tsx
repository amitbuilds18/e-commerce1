import { useEffect, useState } from "react";
import {
  getAdmins,
  deleteAdmin,
} from "../../api/superAdminApi";

import AddAdminModal from "../../components/superAdmin/AddAdminModal";
import EditAdminModal from "../../components/superAdmin/EditAdminModal";

interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function Admins() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedAdmin, setSelectedAdmin] =
    useState<Admin | null>(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const data = await getAdmins();
      setAdmins(data.admins || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this admin?"
    );

    if (!confirmDelete) return;

    try {
      await deleteAdmin(id);

      alert("Admin Deleted Successfully");

      fetchAdmins();
    } catch (error) {
      console.log(error);
      alert("Failed to delete admin");
    }
  };

  const handleEdit = (admin: Admin) => {
    setSelectedAdmin(admin);
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <h1 className="text-2xl text-center mt-10">
        Loading...
      </h1>
    );
  }

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Manage Admins
        </h1>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg"
        >
          + Add Admin
        </button>

      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">
                ID
              </th>

              <th className="text-left">
                Name
              </th>

              <th className="text-left">
                Email
              </th>

              <th className="text-left">
                Role
              </th>

              <th className="text-center">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {admins.length > 0 ? (

              admins.map((admin) => (

                <tr
                  key={admin.id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="p-4">
                    {admin.id}
                  </td>

                  <td>
                    {admin.name}
                  </td>

                  <td>
                    {admin.email}
                  </td>

                  <td>

                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      {admin.role}
                    </span>

                  </td>

                  <td className="text-center">

                    <button
                      onClick={() =>
                        handleEdit(admin)
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(admin.id)
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan={5}
                  className="text-center p-8 text-gray-500"
                >
                  No Admin Found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* Add Admin Modal */}

      {showAddModal && (

        <AddAdminModal
          onClose={() =>
            setShowAddModal(false)
          }
          onSuccess={fetchAdmins}
        />

      )}

      {/* Edit Admin Modal */}

      {showEditModal &&
        selectedAdmin && (

          <EditAdminModal
            admin={selectedAdmin}
            onClose={() =>
              setShowEditModal(false)
            }
            onSuccess={fetchAdmins}
          />

        )}

    </div>
  );
}