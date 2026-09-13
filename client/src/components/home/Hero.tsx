import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaShippingFast } from "react-icons/fa";
import hero from "../../assets/images/hero.png";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50/80 via-white to-amber-50/50 py-16 lg:py-24">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 items-center gap-12 lg:gap-8">
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-orange-100/80 border border-orange-200 text-orange-700 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              <span>New Season 2026 Collection Live</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
              Discover Your <br />
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Signature Style
              </span>
            </h1>

            <p className="text-gray-600 text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Curated luxury fashion, streetwear, and everyday essentials designed for modern trendsetters.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => navigate("/products")}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold px-8 py-4 rounded-2xl shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 transition duration-300"
              >
                <span>Shop Catalog</span>
                <FaArrowRight className="text-sm" />
              </button>

              <button
                onClick={() => navigate("/products?sort=rating_desc")}
                className="w-full sm:w-auto bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 font-bold px-8 py-4 rounded-2xl shadow-sm hover:shadow transition duration-300"
              >
                Best Sellers ⭐
              </button>
            </div>

            {/* Trust Highlights Bar */}
            <div className="pt-8 border-t border-gray-200/60 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-gray-900">50K+</div>
                <div className="text-xs text-gray-500 font-medium mt-0.5">Happy Shoppers</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-gray-900">4.9/5</div>
                <div className="text-xs text-gray-500 font-medium mt-0.5">Verified Reviews</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-gray-900">100%</div>
                <div className="text-xs text-gray-500 font-medium mt-0.5">Original Quality</div>
              </div>
            </div>
          </div>

          {/* Right Image Container */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Floating Discount Tag */}
              <div className="absolute top-6 left-2 bg-white/90 backdrop-blur-md border border-white/50 p-3.5 rounded-2xl shadow-xl flex items-center gap-3 z-10 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">
                  %
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">Special Promo</div>
                  <div className="text-xs font-semibold text-orange-600">Use code: STYLE20</div>
                </div>
              </div>

              {/* Floating Quality Tag */}
              <div className="absolute bottom-6 right-2 bg-white/90 backdrop-blur-md border border-white/50 p-3 rounded-2xl shadow-xl flex items-center gap-2.5 z-10">
                <FaShippingFast className="text-orange-500 text-xl" />
                <div className="text-xs font-bold text-gray-800">Express Delivery</div>
              </div>

              {/* Hero Image */}
              <img
                src={hero}
                alt="StyleHub Premium Fashion"
                className="w-full h-auto object-contain drop-shadow-2xl hover:scale-105 transition duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}