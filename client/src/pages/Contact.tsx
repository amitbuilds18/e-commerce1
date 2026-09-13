import { useState } from "react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useToast } from "../context/ToastContext";

const FAQS = [
  {
    q: "How long will my order take to arrive?",
    a: "Orders are processed within 24 hours and delivered within 3-5 business days across India. You can track status in real-time under My Orders.",
  },
  {
    q: "What is your return and exchange policy?",
    a: "We offer a 7-day hassle-free return and exchange guarantee on all unworn items with original tags intact.",
  },
  {
    q: "What payment methods are supported?",
    a: "We accept all major credit/debit cards, UPI, Net Banking via Stripe, as well as Cash On Delivery (COD).",
  },
  {
    q: "How can I apply promo discount coupons?",
    a: "You can enter discount codes such as STYLE20, FIRST500, or FASHION10 in the Promo Code box at Checkout to receive instant discounts.",
  },
];

export default function Contact() {
  const { success } = useToast();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      success("Message sent! Our support team will reply within 24 hours.");
    }, 600);
  };

  return (
    <>
      <Navbar />

      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-orange-500 font-bold uppercase tracking-wider text-xs bg-orange-100 px-3 py-1 rounded-full">
              Get In Touch
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
              We're Here to Help
            </h1>
            <p className="text-gray-600 text-base">
              Have questions about your order, sizing, or styling advice? Reach out to our dedicated support team anytime.
            </p>
          </div>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center space-y-3">
              <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-xl mx-auto">
                <FaEnvelope />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Email Us</h3>
              <p className="text-gray-500 text-sm">support@stylehub.com</p>
              <p className="text-xs text-orange-600 font-semibold">Average response: 2 hours</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center space-y-3">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-xl mx-auto">
                <FaPhoneAlt />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Call Support</h3>
              <p className="text-gray-500 text-sm">+91 1800 200 4567</p>
              <p className="text-xs text-blue-600 font-semibold">Mon - Sat, 9 AM - 8 PM</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-xl mx-auto">
                <FaMapMarkerAlt />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Headquarters</h3>
              <p className="text-gray-500 text-sm">StyleHub Tower, BKC, Mumbai 400051</p>
              <p className="text-xs text-emerald-600 font-semibold">India Operations</p>
            </div>
          </div>

          {/* Form & FAQ Section */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Contact Form */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl shadow-md border border-gray-100 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
                <p className="text-gray-500 text-sm mt-1">Fill out the form below and we will get back to you promptly.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Your Email</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Order inquiry, sizing, returns..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your issue or feedback in detail..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition disabled:opacity-50"
                >
                  <FaPaperPlane className="text-xs" />
                  <span>{submitting ? "Sending..." : "Send Message"}</span>
                </button>
              </form>
            </div>

            {/* FAQs Accordion */}
            <div className="lg:col-span-5 bg-white p-8 rounded-3xl shadow-md border border-gray-100 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 border-b pb-4">
                Frequently Asked Questions
              </h2>

              <div className="space-y-3">
                {FAQS.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="border rounded-2xl overflow-hidden transition"
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full text-left p-4 flex items-center justify-between gap-3 font-bold text-sm text-gray-900 bg-gray-50/50 hover:bg-gray-100 transition"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? (
                          <FaChevronUp className="text-orange-500 text-xs shrink-0" />
                        ) : (
                          <FaChevronDown className="text-gray-400 text-xs shrink-0" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="p-4 text-xs text-gray-600 leading-relaxed bg-white border-t">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}