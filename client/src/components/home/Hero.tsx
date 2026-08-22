import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import hero from "../../assets/images/hero.png";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-r from-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-8 py-20">

        <div className="grid md:grid-cols-2 items-center gap-12">

          {/* Left */}
          <div>

            <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full">
              New Collection 2026
            </span>

            <h1 className="text-6xl font-bold mt-8 leading-tight">
              Discover Your
              <span className="text-orange-500"> Perfect Style</span>
            </h1>

            <p className="text-gray-600 text-lg mt-6">
              Premium fashion collections for Men, Women & Kids.
            </p>

            <div className="flex gap-5 mt-10">

              <Button
                title="Shop Now"
                onClick={() => navigate("/products")}
              />

              <button
                onClick={() => navigate("/products")}
                className="border px-6 py-3 rounded-xl hover:bg-black hover:text-white"
              >
                Explore
              </button>

            </div>

          </div>

          {/* Right */}
          <div>

            <img
              src={hero}
              alt="Hero"
              className="w-full"
            />

          </div>

        </div>

      </div>
    </section>
  );
}