import { Link } from "react-router-dom";

import men from "../../assets/images/men.jpg";
import women from "../../assets/images/women.jpg";
import kids from "../../assets/images/kids.jpg";
import accessories from "../../assets/images/accessories.jpg";

const categories = [
  {
    name: "Men",
    image: men,
  },
  {
    name: "Women",
    image: women,
  },
  {
    name: "Kids",
    image: kids,
  },
  {
    name: "Accessories",
    image: accessories,
  },
];

export default function Categories() {
  return (
    <section className="max-w-7xl mx-auto py-20 px-4">

      <h2 className="text-4xl font-bold text-center mb-12">
        Shop by Category
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {categories.map((category) => (
          <Link
            key={category.name}
            to="/products"
            className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
          >
            <div className="overflow-hidden">

              <img
                src={category.image}
                alt={category.name}
                className="w-full h-80 object-cover group-hover:scale-110 transition duration-500"
              />

            </div>

            <div className="bg-white p-5 text-center">

              <h3 className="text-2xl font-bold">
                {category.name}
              </h3>

              <p className="text-orange-500 mt-2 font-semibold">
                Shop Now →
              </p>

            </div>

          </Link>
        ))}

      </div>

    </section>
  );
}