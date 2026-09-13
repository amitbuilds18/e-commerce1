import { useEffect, useMemo, useState } from "react";
import {
  getUsers,
  deleteUser,
  blockUser,
} from "../../api/superAdminApi";
import { useToast } from "../../context/ToastContext";
import {
  FaUsers,
  FaSearch,
  FaBan,
  FaCheckCircle,
  FaTrash,
  FaUserCheck,
  FaShieldAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_blocked: boolean;
  created_at?: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "blocked">("all");
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const { success, error } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
      error("Failed to load users from database");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        String(u.id).includes(search);

      if (!matchesSearch) return false;

      if (statusFilter === "active") return !u.is_blocked;
      if (statusFilter === "blocked") return u.is_blocked;
      return true;
    });
  }, [users, search, statusFilter]);

  const activeCount = users.filter((u) => !u.is_blocked).length;
  const blockedCount = users.filter((u) => u.is_blocked).length;

  const handleBlockToggle = async (user: User) => {
    setActionLoading(true);
    try {
      await blockUser(user.id);
      success(
        user.is_blocked
          ? `User "${user.name}" has been unblocked`
          : `User "${user.name}" has been blocked`
      );
      fetchUsers();
    } catch {
      error("Failed to update user block status");
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await deleteUser(deleteTarget.id);
      success(`User "${deleteTarget.name}" deleted permanently`);
      setDeleteTarget(null);
      fetchUsers();
    } catch {
      error("Failed to delete user");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Loading User Accounts...</p>
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
              Total Customers
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {users.length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
            <FaUsers />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Users
            </p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">
              {activeCount}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold">
            <FaUserCheck />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Restricted / Blocked
            </p>
            <h3 className="text-2xl font-black text-rose-600 mt-1">
              {blockedCount}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl font-bold">
            <FaBan />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full md:w-auto">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              statusFilter === "all"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            All Users ({users.length})
          </button>
          <button
            onClick={() => setStatusFilter("active")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              statusFilter === "active"
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setStatusFilter("blocked")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              statusFilter === "blocked"
                ? "bg-white text-rose-700 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Blocked ({blockedCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search name, email or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-slate-50/50"
          />
        </div>
      </div>

      {/* Users Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <FaUsers className="text-4xl text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-semibold">
                      No user accounts found matching your query.
                    </p>
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="text-xs text-purple-600 font-bold mt-2 hover:underline"
                      >
                        Clear search filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 text-white font-bold flex items-center justify-center shadow-xs shrink-0">
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{user.name}</p>
                          <span className="text-[11px] text-slate-400">
                            ID: #{user.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-slate-600 font-medium">{user.email}</td>

                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        <FaShieldAlt className="text-[10px] text-slate-500" />
                        {user.role}
                      </span>
                    </td>

                    <td className="p-4">
                      {user.is_blocked ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
                          <FaBan className="text-[10px]" />
                          Blocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                          <FaCheckCircle className="text-[10px]" />
                          Active
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleBlockToggle(user)}
                          disabled={actionLoading}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                            user.is_blocked
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                          }`}
                          title={user.is_blocked ? "Unblock User" : "Block User"}
                        >
                          <FaBan className="text-xs" />
                          {user.is_blocked ? "Unblock" : "Block"}
                        </button>

                        <button
                          onClick={() => setDeleteTarget(user)}
                          disabled={actionLoading}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition flex items-center gap-1.5"
                          title="Delete User"
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
              Delete User Account?
            </h3>
            <p className="text-slate-500 text-center text-sm mt-2 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-slate-900">{deleteTarget.name}</strong> (
              {deleteTarget.email})? This action will remove all their orders and data.
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
                {actionLoading ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}