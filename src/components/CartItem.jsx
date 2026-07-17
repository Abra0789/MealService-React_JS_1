import { useDispatch } from "react-redux";

import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../redux/slices/cartSlice";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  return (
    <div className="flex items-center justify-between rounded-3xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl">

      {/* Left Side */}
      <div className="flex items-center gap-6">

        <img
          src={item.image}
          alt={item.name}
          className="h-28 w-28 rounded-2xl object-cover"
        />

        <div>

          <h2 className="text-3xl font-bold">
            {item.name}
          </h2>

          <p className="mt-2 text-lg text-gray-500">
            Price : ৳{item.price}
          </p>

          <p className="mt-1 text-sm text-gray-400">
            {item.category}
          </p>

        </div>

      </div>

      {/* Right Side */}
      <div className="text-right">

        <p className="mb-4 text-lg font-semibold">
          Quantity
        </p>

        {/* Quantity Controller */}
        <div className="flex items-center justify-end gap-4">

          <button
            onClick={() => dispatch(decreaseQuantity(item.id))}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-2xl font-bold transition hover:bg-gray-300"
          >
            −
          </button>

          <span className="w-8 text-center text-2xl font-bold">
            {item.quantity}
          </span>

          <button
            onClick={() => dispatch(increaseQuantity(item.id))}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-2xl font-bold text-white transition hover:bg-orange-600"
          >
            +
          </button>

        </div>

        {/* Total Price */}
        <h2 className="mt-6 text-4xl font-bold text-orange-500">
          ৳{item.totalPrice}
        </h2>

        {/* Remove Button */}
        <button
          onClick={() => dispatch(removeFromCart(item.id))}
          className="mt-5 rounded-xl bg-red-500 px-5 py-3 font-semibold text-white transition duration-300 hover:bg-red-600 hover:scale-105 active:scale-95"
        >
          🗑 Remove
        </button>

      </div>

    </div>
  );
};

export default CartItem;