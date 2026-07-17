import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import { clearCart } from "../redux/slices/cartSlice";

import { auth, db } from "../firebase/firebase";

import { toast } from "react-toastify";

const CheckoutForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, totalAmount } = useSelector(
    (state) => state.cart
  );

  const { user } = useSelector(
    (state) => state.auth
  );

  const [loading, setLoading] = useState(false);

  // ============================
  // Shipping Info State
  // ============================

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    paymentMethod: "Cash On Delivery",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.warning("Your cart is empty!");
      return;
    }

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.zip
    ) {
      toast.warning("Please fill all shipping fields.");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "orders"), {
        userId: auth.currentUser.uid,

        userName: formData.fullName,

        email: formData.email,

        phone: formData.phone,

        address: formData.address,

        city: formData.city,

        zip: formData.zip,

        paymentMethod: formData.paymentMethod,

        items: cartItems,

        totalAmount,

        status: "Pending",

        createdAt: serverTimestamp(),
      });

      dispatch(clearCart());

      toast.success("Order Placed Successfully!");

      navigate("/my-orders");

    } catch (error) {
      console.log(error);

      toast.error("Failed To Place Order");
    } finally {
      setLoading(false);
    }
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
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="rounded-xl border p-4 outline-none focus:border-orange-500"
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          className="rounded-xl border p-4 outline-none focus:border-orange-500"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
          className="rounded-xl border p-4 outline-none focus:border-orange-500"
        />

        <textarea
          rows="4"
          name="address"
          placeholder="Delivery Address"
          value={formData.address}
          onChange={handleChange}
          required
          className="rounded-xl border p-4 outline-none focus:border-orange-500"
        />

        <div className="grid gap-6 md:grid-cols-2">

          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
            className="rounded-xl border p-4 outline-none focus:border-orange-500"
          />

          <input
            type="text"
            name="zip"
            placeholder="ZIP Code"
            value={formData.zip}
            onChange={handleChange}
            required
            className="rounded-xl border p-4 outline-none focus:border-orange-500"
          />

        </div>

        <select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          className="rounded-xl border p-4 outline-none focus:border-orange-500"
        >
          <option>Cash On Delivery</option>
          <option>Credit Card</option>
          <option>Mobile Banking</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-orange-500 py-4 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>

      </form>

    </div>
  );
};

export default CheckoutForm;