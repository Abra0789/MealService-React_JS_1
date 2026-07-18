import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { toast } from "react-toastify";

import { addToCart } from "../redux/slices/cartSlice";

import meals from "../data/meals";
import RelatedMeals from "../components/RelatedMeals";

const MealDetails = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { isLoggedIn } = useSelector(
    (state) => state.auth
  );

  const [quantity, setQuantity] = useState(1);

  const meal = meals.find(
    (item) => item.id === Number(id)
  );

  if (!meal) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center">
        <h1 className="text-5xl font-bold">
          Meal Not Found 😢
        </h1>

        <Link
          to="/meals"
          className="inline-block mt-8 rounded-xl bg-orange-500 px-6 py-3 text-white"
        >
          Back To Meals
        </Link>
      </div>
    );
  }

  const relatedMeals = meals
    .filter(
      (item) =>
        item.category === meal.category &&
        item.id !== meal.id
    )
    .slice(0, 3);

  const increase = () => {
    setQuantity(quantity + 1);
  };

  const decrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        ...meal,
        quantity,
      })
    );

    toast.success(`${meal.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    dispatch(
      addToCart({
        ...meal,
        quantity,
      })
    );

    toast.success(`${meal.name} added to cart!`);

    navigate("/checkout");
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">

      <Link
        to="/meals"
        className="mb-10 inline-block rounded-xl bg-orange-100 px-5 py-3 text-orange-600 transition hover:bg-orange-500 hover:text-white"
      >
        ← Back To Meals
      </Link>

      <div className="grid items-center gap-16 lg:grid-cols-2">

        <div>
          <img
            src={meal.image}
            alt={meal.name}
            className="w-full rounded-3xl shadow-2xl transition duration-500 hover:scale-105"
          />
        </div>

        <div>

          <span className="rounded-full bg-orange-100 px-4 py-2 font-semibold text-orange-600">
            {meal.category}
          </span>

          <div className="mt-6 flex items-center justify-between">

            <h1 className="text-5xl font-bold">
              {meal.name}
            </h1>

            

          </div>

          <div className="mt-6 flex gap-6 text-lg">

            <span>⭐ {meal.rating}</span>

            <span>🚚 {meal.deliveryTime}</span>

            <span>🔥 {meal.calories} Calories</span>

          </div>

          <p className="mt-8 text-lg leading-8 text-gray-600">
            {meal.description}
          </p>

          <h2 className="mt-10 text-5xl font-bold text-orange-500">
            ৳{meal.price}
          </h2>
                    {/* Quantity */}

          <div className="mt-10 flex items-center gap-5">

            <button
              onClick={decrease}
              className="h-12 w-12 rounded-full bg-gray-200 text-2xl font-bold transition hover:bg-gray-300"
            >
              -
            </button>

            <span className="text-2xl font-bold">
              {quantity}
            </span>

            <button
              onClick={increase}
              className="h-12 w-12 rounded-full bg-orange-500 text-2xl font-bold text-white transition hover:bg-orange-600"
            >
              +
            </button>

          </div>

          {/* Buttons */}

          <div className="mt-10 flex gap-5">

            <button
              onClick={handleAddToCart}
              className="rounded-xl bg-orange-500 px-10 py-4 font-semibold text-white transition hover:bg-orange-600"
            >
              🛒 Add To Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="rounded-xl border-2 border-orange-500 px-10 py-4 font-semibold text-orange-500 transition hover:bg-orange-500 hover:text-white"
            >
              Buy Now
            </button>

          </div>

        </div>

      </div>

      {/* Ingredients & Why Love It */}

      <div className="mt-20 grid gap-10 md:grid-cols-2">

        {/* Ingredients */}

        <div className="rounded-3xl bg-white p-8 shadow-xl">

          <h2 className="mb-6 text-3xl font-bold">
            🥗 Ingredients
          </h2>

          <ul className="space-y-4 text-gray-600">

            <li>✅ Fresh Vegetables</li>

            <li>✅ Premium Cheese</li>

            <li>✅ Organic Spices</li>

            <li>✅ Fresh Meat</li>

            <li>✅ Homemade Sauce</li>

          </ul>

        </div>

        {/* Why Love It */}

        <div className="rounded-3xl bg-white p-8 shadow-xl">

          <h2 className="mb-6 text-3xl font-bold">
            ❤️ Why You'll Love It
          </h2>

          <ul className="space-y-4 text-gray-600">

            <li>⭐ Top Rated by Customers</li>

            <li>🚚 Super Fast Delivery</li>

            <li>🔥 Freshly Cooked</li>

            <li>🥗 Healthy & Delicious</li>

            <li>💯 Premium Quality Ingredients</li>

          </ul>

        </div>

      </div>
            {/* Delivery Information */}

      <section className="mt-20">

        <div className="rounded-3xl bg-orange-50 p-8 shadow-lg">

          <h2 className="mb-8 text-3xl font-bold">
            🚚 Delivery Information
          </h2>

          <div className="grid gap-8 md:grid-cols-3">

            <div className="rounded-2xl bg-white p-6 shadow">

              <h3 className="text-xl font-bold">
                Delivery Time
              </h3>

              <p className="mt-2 text-gray-600">
                {meal.deliveryTime}
              </p>

            </div>

            <div className="rounded-2xl bg-white p-6 shadow">

              <h3 className="text-xl font-bold">
                Delivery Fee
              </h3>

              <p className="mt-2 text-gray-600">
                Free Delivery
              </p>

            </div>

            <div className="rounded-2xl bg-white p-6 shadow">

              <h3 className="text-xl font-bold">
                Payment
              </h3>

              <p className="mt-2 text-gray-600">
                Cash / Card / Mobile Banking
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* Related Meals */}

      <RelatedMeals meals={relatedMeals} />
          </section>
  );
};

export default MealDetails;