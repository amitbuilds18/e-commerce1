type Props = {
  title: string;
  value: string;
  color: string;
};

export default function DashboardCard({
  title,
  value,
  color,
}: Props) {
  return (
    <div
      className={`${color} rounded-xl shadow-lg p-6 text-white hover:scale-105 transition`}
    >

      <h3 className="text-lg">
        {title}
      </h3>

      <h1 className="text-4xl font-bold mt-4">
        {value}
      </h1>

    </div>
  );
}
