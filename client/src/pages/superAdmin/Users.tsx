import { useEffect, useMemo, useState } from "react";
import {
  getUsers,
  deleteUser,
  blockUser,
} from "../../api/superAdminApi";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_blocked: boolean;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data.users || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await deleteUser(id);
      fetchUsers();
    } catch {
      alert("Delete Failed");
    }
  };

  const handleBlock = async (id: number) => {
    try {
      await blockUser(id);
      fetchUsers();
    } catch {
      alert("Update Failed");
    }
  };

  if (loading) {
    return (
      <h1 className="text-center text-2xl mt-20">
        Loading Users...
      </h1>
    );
  }

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">

        <div>

          <h1 className="text-3xl font-bold">
            Users Management
          </h1>

          <p className="text-gray-500">
            Total Users : {filteredUsers.length}
          </p>

        </div>

        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-72"
        />

      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">ID</th>

              <th>Name</th>

              <th>Email</th>

              <th>Status</th>

              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {filteredUsers.length === 0 ? (

              <tr>

                <td
                  colSpan={5}
                  className="text-center p-10"
                >
                  No Users Found
                </td>

              </tr>

            ) : (

              filteredUsers.map((user) => (

                <tr
                  key={user.id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="p-4">
                    {user.id}
                  </td>

                  <td>{user.name}</td>

                  <td>{user.email}</td>

                  <td>

                    {user.is_blocked ? (

                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full">

                        Blocked

                      </span>

                    ) : (

                      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full">

                        Active

                      </span>

                    )}

                  </td>

                  <td>

                    <button
                      onClick={() => handleBlock(user.id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2"
                    >
                      {user.is_blocked
                        ? "Unblock"
                        : "Block"}
                    </button>

                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}