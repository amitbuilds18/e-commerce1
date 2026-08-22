import type { ReactNode } from "react";
import Sidebar from "../components/superAdmin/Sidebar";
import Navbar from "../components/superAdmin/Navbar";

type Props = {
  children: ReactNode;
};

export default function SuperAdminLayout({
  children,
}: Props) {
  return (
    <div className="bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="ml-72">

        <Navbar />

        <main className="p-8">
          {children}
        </main>

      </div>

    </div>
  );
}