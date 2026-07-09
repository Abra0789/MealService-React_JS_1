import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";

const CheckoutForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    alert("Order placed successfully!");

    dispatch(clearCart());

    navigate("/");
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl">

      <h2 className="mb-8 text-3xl font-bold">
        Shipping Information
      </h2>

      <form
        onSubmit={handlePlaceOrder}
        className="grid gap-6"
      >

        <input
          type="text"
          placeholder="Full Name"
          required
          className="rounded-xl border p-4 outline-none focus:border-orange-500"
        />

        <input
          type="email"
          placeholder="Email Address"
          required
          className="rounded-xl border p-4 outline-none focus:border-orange-500"
        />

        <input
          type="text"
          placeholder="Phone Number"
          required
          className="rounded-xl border p-4 outline-none focus:border-orange-500"
        />

        <textarea
          rows="4"
          placeholder="Delivery Address"
          required
          className="rounded-xl border p-4 outline-none focus:border-orange-500"
        />

        <div className="grid gap-6 md:grid-cols-2">

          <input
            type="text"
            placeholder="City"
            required
            className="rounded-xl border p-4 outline-none focus:border-orange-500"
          />

          <input
            type="text"
            placeholder="ZIP Code"
            required
            className="rounded-xl border p-4 outline-none focus:border-orange-500"
          />

        </div>

        <select
          className="rounded-xl border p-4 outline-none focus:border-orange-500"
        >
          <option>Cash On Delivery</option>
          <option>Credit Card</option>
          <option>Mobile Banking</option>
        </select>

        <button
          type="submit"
          className="rounded-xl bg-orange-500 py-4 font-semibold text-white transition hover:bg-orange-600"
        >
          Place Order
        </button>

      </form>

    </div>
  );
};

export default CheckoutForm;