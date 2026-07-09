const Statistics = () => {
  return (
    <section className="max-w-7xl mx-auto py-20 px-6">

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-5xl font-bold text-orange-500">500+</h2>
          <p className="mt-3">Meals</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-5xl font-bold text-orange-500">10K+</h2>
          <p className="mt-3">Customers</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-5xl font-bold text-orange-500">30 Min</h2>
          <p className="mt-3">Delivery</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-5xl font-bold text-orange-500">24/7</h2>
          <p className="mt-3">Support</p>
        </div>

      </div>

    </section>
  );
};

export default Statistics;