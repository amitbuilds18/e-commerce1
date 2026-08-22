import { Link } from "react-router-dom";

export default function FlashSale() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-3xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 p-10">

          {/* Left Content */}
          <div className="text-white">
            <span className="inline-block bg-white text-red-500 px-4 py-2 rounded-full font-semibold">
              🔥 Limited Time Offer
            </span>

            <h2 className="text-5xl font-bold mt-6">
              Up To 50% OFF
            </h2>

            <p className="mt-4 text-lg leading-8">
              Discover premium fashion at unbeatable prices.
              Shop your favorite styles before the offer ends.
            </p>

            <Link
              to="/products"
              className="inline-block mt-8 bg-white text-red-500 font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition"
            >
              Shop Now →
            </Link>
          </div>

          {/* Right Content */}
          <div className="flex justify-center">
            <img
              src="/sale.jpg"
              alt="Flash Sale"
              className="w-80 md:w-96"
            />
          </div>

        </div>
      </div>
    </section>
  );
}