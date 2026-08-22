import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function Contact() {
  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto py-16 px-4">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>

        <form className="max-w-lg space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full border rounded-lg p-3"
          />

          <input
            type="email"
            placeholder="Your Email"
            className="w-full border rounded-lg p-3"
          />

          <textarea
            rows={5}
            placeholder="Your Message"
            className="w-full border rounded-lg p-3"
          />

          <button className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600">
            Send Message
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
}