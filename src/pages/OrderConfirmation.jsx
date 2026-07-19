import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const OrderConfirmation = () => {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const docSnap = await getDoc(doc(db, "orders", orderId));

        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() });
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error(error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="text-gray-500">Loading your order...</p>
      </section>
    );
  }

  if (notFound || !order) {
    return (
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl font-bold">Order Not Found</h1>
        <p className="mt-4 text-gray-500">
          We couldn't find that order.
        </p>
        <Link
          to="/my-orders"
          className="mt-8 inline-block rounded-xl bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600"
        >
          View My Orders
        </Link>
      </section>
    );
  }

  const orderDate = order.createdAt?.seconds
    ? new Date(order.createdAt.seconds * 1000)
    : new Date();

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">

      {/* Success Header */}
      <div className="mb-10 text-center">

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
          ✅
        </div>

        <h1 className="text-4xl font-bold">
          Order Confirmed!
        </h1>

        <p className="mt-3 text-gray-500">
          Thanks {order.userName?.split(" ")[0]}, your order has been placed successfully.
        </p>

      </div>

      {/* Receipt Slip */}
      <div className="rounded-3xl bg-white p-8 shadow-xl">

        {/* Order Meta */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed pb-6">

          <div>
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="text-lg font-bold">
              #{order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500">Placed On</p>
            <p className="font-semibold">
              {orderDate.toLocaleDateString()} · {orderDate.toLocaleTimeString()}
            </p>
          </div>

          <span className="rounded-full bg-orange-100 px-4 py-1 text-sm font-semibold text-orange-700">
            {order.status}
          </span>

        </div>

        {/* Customer & Delivery Info */}
        <div className="grid gap-6 border-b border-dashed py-6 sm:grid-cols-2">

          <div>
            <p className="text-sm text-gray-500">Customer</p>
            <p className="font-semibold">{order.userName}</p>
            <p className="text-sm text-gray-600">{order.email}</p>
            {order.phone && (
              <p className="text-sm text-gray-600">{order.phone}</p>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500">Delivery Address</p>
            <p className="font-semibold">
              {order.address || "—"}
            </p>
            <p className="text-sm text-gray-600">
              {order.city} {order.zip}
            </p>
          </div>

        </div>

        {/* Items */}
        <div className="border-b border-dashed py-6">

          <p className="mb-4 text-sm font-semibold text-gray-500">
            Items
          </p>

          <div className="space-y-4">
            {order.items?.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty {item.quantity} · ৳{item.price} each
                    </p>
                  </div>
                </div>

                <p className="font-bold text-orange-500">
                  ৳{item.totalPrice}
                </p>
              </div>
            ))}
          </div>

        </div>

        {/* Payment & Total */}
        <div className="flex items-center justify-between pt-6">

          <div>
            <p className="text-sm text-gray-500">Payment Method</p>
            <p className="font-semibold">{order.paymentMethod}</p>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-3xl font-bold text-orange-500">
              ৳{order.totalAmount?.toFixed(2)}
            </p>
          </div>

        </div>

      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">

        <Link
          to="/my-orders"
          className="flex-1 rounded-xl border-2 border-orange-500 py-4 text-center font-semibold text-orange-500 transition hover:bg-orange-500 hover:text-white"
        >
          View My Orders
        </Link>

        <Link
          to="/meals"
          className="flex-1 rounded-xl bg-orange-500 py-4 text-center font-semibold text-white transition hover:bg-orange-600"
        >
          Continue Shopping
        </Link>

      </div>

    </section>
  );
};

export default OrderConfirmation;