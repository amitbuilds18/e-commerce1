import type { ReactNode } from "react";
import Sidebar from "../components/admin/Sidebar";
import AdminNavbar from "../components/admin/AdminNavbar";

type Props = {
  children: ReactNode;
};

export default function AdminLayout({ children }: Props) {
  return (
    <div className="bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="ml-64">

        <AdminNavbar />

        <div className="p-8">
          {children}
        </div>

      </div>

    </div>
  );
}