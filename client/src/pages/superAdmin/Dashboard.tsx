import DashboardCard from "../../components/superAdmin/DashboardCard";

export default function Dashboard() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">

        <DashboardCard
          title="Admins"
          value="5"
          color="bg-red-500"
        />

        <DashboardCard
          title="Users"
          value="1500"
          color="bg-blue-500"
        />

        <DashboardCard
          title="Products"
          value="250"
          color="bg-green-500"
        />

        <DashboardCard
          title="Orders"
          value="450"
          color="bg-orange-500"
        />

        <DashboardCard
          title="Revenue"
          value="₹12,50,000"
          color="bg-purple-500"
        />

      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">

        <div className="bg-white rounded-2xl shadow p-6 h-96">
          <h2 className="text-2xl font-bold">
            Revenue Analytics
          </h2>

          <div className="flex justify-center items-center h-full text-gray-400">
            Chart.js will come here
          </div>

        </div>

        <div className="bg-white rounded-2xl shadow p-6 h-96">
          <h2 className="text-2xl font-bold">
            Latest Admin Activities
          </h2>

          <div className="flex justify-center items-center h-full text-gray-400">
            Activity Table
          </div>

        </div>

      </div>
    </>
  );
}