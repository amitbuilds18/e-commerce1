export default function Testimonials() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">

        <h2 className="text-4xl font-bold text-center mb-10">
          What Our Customers Say
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="shadow-lg rounded-xl p-6">
            <p>
              Amazing quality and fast delivery.
            </p>

            <h3 className="mt-4 font-bold">
              Rahul
            </h3>
          </div>

          <div className="shadow-lg rounded-xl p-6">
            <p>
              Best shopping experience.
            </p>

            <h3 className="mt-4 font-bold">
              Priya
            </h3>
          </div>

          <div className="shadow-lg rounded-xl p-6">
            <p>
              Highly recommended.
            </p>

            <h3 className="mt-4 font-bold">
              Amit
            </h3>
          </div>

        </div>

      </div>
    </section>
  );
}