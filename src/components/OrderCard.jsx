const OrderCard = ({ order }) => {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold">
            Order #{order.id}
          </h2>

          <p className="mt-1 text-gray-500">
            {order.date}
          </p>

        </div>

        <span
          className={`rounded-full px-4 py-2 text-sm font-semibold
          ${
            order.status === "Delivered"
              ? "bg-green-100 text-green-700"
              : order.status === "Preparing"
              ? "bg-yellow-100 text-yellow-700"
              : order.status === "Pending"
              ? "bg-orange-100 text-orange-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {order.status}
        </span>

      </div>

      <div className="my-6 space-y-2">

        {order.items.map((item) => (

          <div
            key={item.id}
            className="flex justify-between"
          >
            <span>
              {item.name} × {item.quantity}
            </span>

            <span>
              ${item.totalPrice}
            </span>

          </div>

        ))}

      </div>

      <hr />

      <div className="mt-5 flex items-center justify-between">

        <h3 className="text-xl font-bold">
          Total
        </h3>

        <h3 className="text-2xl font-bold text-orange-500">
          ${order.total}
        </h3>

      </div>

    </div>
  );
};

export default OrderCard;