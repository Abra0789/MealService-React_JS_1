const MyOrders = () => {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">

      <h1 className="text-4xl font-bold">
        My Orders
      </h1>

      <div className="mt-10 rounded-3xl bg-white p-8 shadow-xl">

        <h2 className="text-2xl font-semibold">
          No Orders Yet
        </h2>

        <p className="mt-3 text-gray-500">
          Your previous orders will appear here.
        </p>

      </div>

    </section>
  );
};

export default MyOrders;