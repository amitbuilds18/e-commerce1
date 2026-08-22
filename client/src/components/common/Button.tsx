type ButtonProps = {
  title: string;
  onClick?: () => void;
};

export default function Button({ title, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800"
    >
      {title}
    </button>
  );
}