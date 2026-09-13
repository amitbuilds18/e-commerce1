import { useEffect, useState } from "react";
import { FaSearch, FaUserCheck, FaUserShield, FaUserTie } from "react-icons/fa";
import API from "../../api/axios";
import { useToast } from "../../context/ToastContext";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_blocked?: boolean;
}

export default function AdminUsers() {
  const { error: toastError } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data.users || []);
    } catch (err: any) {
      console.error(err);
      toastError("Failed to load user accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const query = search.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(query)) ||
      (u.email && u.email.toLowerCase().includes(query)) ||
      String(u.id).includes(query)
    );
  });

  const getRoleBadge = (role: string) => {
    if (role === "superAdmin") return "bg-purple-100 text-purple-700 border-purple-200";
    if (role === "admin") return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-green-100 text-green-700 border-green-200";
  };

  const getRoleIcon = (role: string) => {
    if (role === "superAdmin") return <FaUserShield className="text-xs" />;
    if (role === "admin") return <FaUserTie className="text-xs" />;
    return <FaUserCheck className="text-xs" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">User Management</h1>
          <p className="text-gray-500 text-sm mt-1">
            View registered customer and staff accounts ({users.length} total)
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <FaSearch className="absolute left-3.5 top-3.5 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading User Accounts...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Account Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-400">
                      No user accounts found matching "{search}".
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const initial = user.name
                      ? user.name.charAt(0).toUpperCase()
                      : user.email.charAt(0).toUpperCase();

                    return (
                      <tr key={user.id} className="hover:bg-gray-50 transition">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center shrink-0">
                              {initial}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">{user.name || "Customer"}</div>
                              <div className="text-xs text-gray-400">ID: #{user.id}</div>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 text-gray-600 font-medium">
                          {user.email}
                        </td>

                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getRoleBadge(
                              user.role
                            )}`}
                          >
                            {getRoleIcon(user.role)}
                            <span>{user.role}</span>
                          </span>
                        </td>

                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.is_blocked
                                ? "bg-red-100 text-red-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {user.is_blocked ? "Blocked" : "Active"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}