import { useEffect, useState } from "react";
import API from "../../api/axios";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");

      setUsers(res.data.users || []);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">

      <h1 className="text-3xl font-bold mb-6">
        Users
      </h1>

      <table className="w-full border-collapse">

        <thead>

          <tr className="bg-gray-100">

            <th className="border p-3">ID</th>
            <th className="border p-3">Name</th>
            <th className="border p-3">Email</th>
            <th className="border p-3">Role</th>

          </tr>

        </thead>

        <tbody>

          {users.length > 0 ? (

            users.map((user) => (

              <tr key={user.id}>

                <td className="border p-3">
                  {user.id}
                </td>

                <td className="border p-3">
                  {user.name}
                </td>

                <td className="border p-3">
                  {user.email}
                </td>

                <td className="border p-3">
                  {user.role}
                </td>

              </tr>

            ))

          ) : (

            <tr>

              <td
                colSpan={4}
                className="border p-5 text-center"
              >
                No Users Found
              </td>

            </tr>

          )}

        </tbody>

      </table>

    </div>
  );
}