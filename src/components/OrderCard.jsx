import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

import { toast } from "react-toastify";

const OrderCard = ({ order }) => {
  const orderDate = order.createdAt?.seconds
    ? new Date(order.createdAt.seconds * 1000)
    : new Date();

  const handleCancelOrder = async () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) return;

    try {
      await updateDoc(doc(db, "orders", order.id), {
        status: "Cancelled",
      });

      toast.success("Order Cancelled Successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed To Cancel Order");
    }
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl transition hover:shadow-2xl">
      {/* Header */}

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold">
            Order #{order.id.slice(0, 8)}
          </h2>

          <p className="mt-2 text-gray-500">
            {orderDate.toLocaleDateString()} •{" "}
            {orderDate.toLocaleTimeString()}
          </p>
        </div>

        <span
          className={`rounded-full px-5 py-2 font-semibold
          ${
            order.status === "Delivered"
              ? "bg-green-100 text-green-700"
              : order.status === "Preparing"
              ? "bg-blue-100 text-blue-700"
              : order.status === "On The Way"
              ? "bg-purple-100 text-purple-700"
              : order.status === "Pending"
              ? "bg-orange-100 text-orange-700"
              : order.status === "Cancelled"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {order.status}
        </span>
      </div>

      <hr className="my-6" />

      {/* Customer */}

      <div className="space-y-2">
        <p>
          <span className="font-bold">Customer :</span>{" "}
          {order.userName}
        </p>

        <p>
          <span className="font-bold">Email :</span>{" "}
          {order.email}
        </p>
      </div>

      <hr className="my-6" />

      {/* Items */}

      <div className="space-y-4">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-2xl bg-orange-50 p-5"
          >
            <div>
              <h3 className="text-xl font-bold">
                {item.name}
              </h3>

              <p className="text-gray-500">
                Qty : {item.quantity}
              </p>

              <p className="text-gray-500">
                Price : ৳{item.price}
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-orange-500">
                ৳{item.totalPrice}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <hr className="my-6" />

      {/* Footer */}

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">
          Grand Total
        </h2>

        <h2 className="text-4xl font-bold text-orange-500">
          ৳{order.totalAmount}
        </h2>
      </div>

      {/* Cancel Button */}

      {order.status === "Pending" && (
        <button
          onClick={handleCancelOrder}
          className="mt-8 w-full rounded-xl bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600"
        >
          Cancel Order
        </button>
      )}
    </div>
  );
};

export default OrderCard;