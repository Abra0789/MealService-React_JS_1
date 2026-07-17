import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const OrderSummary = () => {

  const { cartItems, totalAmount } = useSelector(
    (state) => state.cart
  );

  const deliveryFee = cartItems.length > 0 ? 5 : 0;

  const tax = totalAmount * 0.05;

  const grandTotal =
    totalAmount + deliveryFee + tax;

  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl">

      <h2 className="mb-6 text-3xl font-bold">
        Order Summary
      </h2>

      <div className="mb-8 space-y-4">

        {cartItems.map((item) => (

          <div
            key={item.id}
            className="flex justify-between border-b pb-3"
          >

            <div>

              <h3 className="font-semibold">
                {item.name}
              </h3>

              <p className="text-sm text-gray-500">
                Quantity : {item.quantity}
              </p>

            </div>

            <p className="font-semibold">
              ৳{item.totalPrice}
            </p>

          </div>

        ))}

      </div>

      <div className="space-y-4">

        <div className="flex justify-between">

          <span>Subtotal</span>

          <span>৳{totalAmount.toFixed(2)}</span>

        </div>

        <div className="flex justify-between">

          <span>Delivery Fee</span>

          <span>৳{deliveryFee.toFixed(2)}</span>

        </div>

        <div className="flex justify-between">

          <span>Tax (5%)</span>

          <span>৳{tax.toFixed(2)}</span>

        </div>

        <hr />

        <div className="flex justify-between text-2xl font-bold">

          <span>Total</span>

          <span className="text-orange-500">
            ৳{grandTotal.toFixed(2)}
          </span>

        </div>

      </div>

      <Link
        to="/cart"
        className="mt-8 block rounded-xl border-2 border-orange-500 py-3 text-center font-semibold text-orange-500 transition hover:bg-orange-500 hover:text-white"
      >
        Back To Cart
      </Link>

    </div>
  );
};

export default OrderSummary;