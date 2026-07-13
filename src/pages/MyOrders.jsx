import { useSelector } from "react-redux";

import OrderCard from "../components/OrderCard";

const MyOrders = () => {

  const orders = useSelector(
    (state) => state.order.orders
  );

  return (
    <section className="min-h-screen bg-orange-50 py-16">

      <div className="mx-auto max-w-6xl px-5">

        <h1 className="mb-10 text-center text-5xl font-bold">
          My Orders
        </h1>

        {orders.length === 0 ? (

          <div className="rounded-3xl bg-white p-12 text-center shadow-lg">

            <h2 className="text-3xl font-bold">
              No Orders Yet
            </h2>

            <p className="mt-3 text-gray-500">
              Your orders will appear here after checkout.
            </p>

          </div>

        ) : (

          <div className="grid gap-8">

            {orders.map((order) => (

              <OrderCard
                key={order.id}
                order={order}
              />

            ))}

          </div>

        )}

      </div>

    </section>
  );
};

export default MyOrders;