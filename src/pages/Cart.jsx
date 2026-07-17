import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { clearCart } from "../redux/slices/cartSlice";
import CartItem from "../components/CartItem";

const Cart = () => {
  const dispatch = useDispatch();

  const { cartItems, totalAmount } = useSelector(
    (state) => state.cart
  );

  const deliveryFee = cartItems.length > 0 ? 5 : 0;

  const tax = totalAmount * 0.05;

  const grandTotal = totalAmount + deliveryFee + tax;

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">

      <h1 className="mb-10 text-5xl font-bold">
        Shopping Cart
      </h1>

      {cartItems.length === 0 ? (

        <div className="py-20 text-center">

          <h2 className="text-4xl font-bold">
            Your Cart is Empty
          </h2>

          <p className="mt-4 text-lg text-gray-500">
            Add some delicious meals to your cart.
          </p>

          <Link
            to="/meals"
            className="mt-8 inline-block rounded-xl bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600"
          >
            Browse Meals
          </Link>

        </div>

      ) : (

        <div className="grid gap-10 lg:grid-cols-3">

          {/* Cart Items */}

          <div className="space-y-6 lg:col-span-2">

            {cartItems.map((item) => (

              <CartItem
                key={item.id}
                item={item}
              />

            ))}

          </div>

          {/* Order Summary */}

          <div className="sticky top-24 h-fit rounded-3xl bg-white p-8 shadow-2xl">

            <h2 className="mb-8 text-3xl font-bold">
              Order Summary
            </h2>

            <div className="space-y-5">

              <div className="flex justify-between text-lg">

                <span>Subtotal</span>

                <span>৳{totalAmount.toFixed(2)}</span>

              </div>

              <div className="flex justify-between text-lg">

                <span>Delivery Fee</span>

                <span>৳{deliveryFee.toFixed(2)}</span>

              </div>

              <div className="flex justify-between text-lg">

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

            <button
              onClick={() => dispatch(clearCart())}
              className="mt-8 w-full rounded-xl bg-red-500 py-4 text-lg font-semibold text-white transition duration-300 hover:bg-red-600"
            >
              Clear Cart
            </button>

            <Link
              to="/checkout"
              className="mt-4 block w-full rounded-xl bg-orange-500 py-4 text-center text-lg font-semibold text-white transition duration-300 hover:bg-orange-600"
            >
              Proceed To Checkout
            </Link>

          </div>

        </div>

      )}

    </section>
  );
};

export default Cart;