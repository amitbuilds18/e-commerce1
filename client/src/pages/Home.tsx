import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import Hero from "../components/home/Hero";
import Categories from "../components/home/Categories";
import FeaturedProducts from "../components/home/FeaturedProducts";
import TrendingProducts from "../components/home/TrendingProducts";
import BestSellers from "../components/home/BestSellers";
import FlashSale from "../components/home/FlashSale";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Testimonials from "../components/home/Testimonials";
import Newsletter from "../components/home/Newsletter";

export default function Home() {
  return (
    <>
      <Navbar />

      <Hero />

      <Categories />

      <FeaturedProducts />

      <TrendingProducts />

      <BestSellers />

      <FlashSale />

      <WhyChooseUs />

      <Testimonials />

      <Newsletter />

      <Footer />
    </>
  );
}