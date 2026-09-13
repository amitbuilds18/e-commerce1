import { useEffect, useMemo, useState } from "react";
import {
  getAdmins,
  deleteAdmin,
} from "../../api/superAdminApi";
import AddAdminModal from "../../components/superAdmin/AddAdminModal";
import EditAdminModal from "../../components/superAdmin/EditAdminModal";
import { useToast } from "../../context/ToastContext";
import {
  FaUserShield,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaShieldAlt,
  FaExclamationTriangle,
  FaKey,
} from "react-icons/fa";

interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function Admins() {
  const { success, error: toastError } = useToast();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Admin | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const data = await getAdmins();
      setAdmins(data.admins || []);
    } catch (error) {
      console.error(error);
      toastError("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  const filteredAdmins = useMemo(() => {
    return admins.filter(
      (a) =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase()) ||
        String(a.id).includes(search)
    );
  }, [admins, search]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await deleteAdmin(deleteTarget.id);
      success(`Admin "${deleteTarget.name}" deleted successfully`);
      setDeleteTarget(null);
      fetchAdmins();
    } catch (error) {
      console.error(error);
      toastError("Failed to delete admin");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (admin: Admin) => {
    setSelectedAdmin(admin);
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Loading Administrator Accounts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Staff Administrators
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {admins.length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl font-bold">
            <FaUserShield />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Security Clearance
            </p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">
              Level 2 (Admin)
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold">
            <FaShieldAlt />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Privileges
            </p>
            <h3 className="text-2xl font-black text-blue-600 mt-1">
              Products & Orders
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
            <FaKey />
          </div>
        </div>
      </div>

      {/* Action and Search Bar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search admin name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-slate-50/50"
          />
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md shadow-purple-600/30 transition shrink-0 cursor-pointer"
        >
          <FaPlus />
          <span>Add Admin</span>
        </button>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="p-4">Administrator</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Assigned Role</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-16">
                    <FaUserShield className="text-4xl text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-semibold">
                      No admin accounts found matching your query.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center shrink-0 border border-purple-200">
                          {admin.name ? admin.name.charAt(0).toUpperCase() : "A"}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{admin.name}</p>
                          <span className="text-[11px] text-slate-400">
                            Admin ID: #{admin.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-slate-600 font-medium">
                      {admin.email}
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        <FaShieldAlt className="text-[10px]" />
                        {admin.role}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(admin)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition flex items-center gap-1.5"
                          title="Edit Admin"
                        >
                          <FaEdit className="text-xs" />
                          Edit
                        </button>

                        <button
                          onClick={() => setDeleteTarget(admin)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition flex items-center gap-1.5"
                          title="Delete Admin"
                        >
                          <FaTrash className="text-xs" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl mx-auto mb-4">
              <FaExclamationTriangle />
            </div>
            <h3 className="text-xl font-bold text-center text-slate-900">
              Revoke Admin Access?
            </h3>
            <p className="text-slate-500 text-center text-sm mt-2 leading-relaxed">
              Are you sure you want to delete administrator{" "}
              <strong className="text-slate-900">{deleteTarget.name}</strong> (
              {deleteTarget.email})? They will lose access to staff privileges immediately.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={actionLoading}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={actionLoading}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-white bg-rose-600 hover:bg-rose-700 transition shadow-lg shadow-rose-600/30"
              >
                {actionLoading ? "Deleting..." : "Revoke Access"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Admin Modal */}
      {showAddModal && (
        <AddAdminModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchAdmins}
        />
      )}

      {/* Edit Admin Modal */}
      {showEditModal && selectedAdmin && (
        <EditAdminModal
          admin={selectedAdmin}
          onClose={() => setShowEditModal(false)}
          onSuccess={fetchAdmins}
        />
      )}
    </div>
  );
}