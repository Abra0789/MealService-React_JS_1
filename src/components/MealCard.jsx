import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";

const MealCard = ({ meal }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(meal));
  };

  return (
    <div className="group overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl">

      {/* Clickable Image */}
      <Link to={`/meals/${meal.id}`}>
        <div className="overflow-hidden cursor-pointer">
          <img
            src={meal.image}
            alt={meal.name}
            className="h-60 w-full object-cover transition duration-500 group-hover:scale-110"
          />
        </div>
      </Link>

      {/* Body */}
      <div className="p-6">

        {/* Top */}
        <div className="flex items-center justify-between">

          <Link to={`/meals/${meal.id}`}>
            <h2 className="cursor-pointer text-2xl font-bold text-gray-800 transition hover:text-orange-500">
              {meal.name}
            </h2>
          </Link>

          <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
            ⭐ {meal.rating}
          </span>

        </div>

        {/* Description */}
        <p className="mt-3 text-gray-500">
          {meal.description}
        </p>

        {/* Delivery */}
        <div className="mt-5 flex justify-between text-sm text-gray-500">

          <span>🚚 {meal.deliveryTime}</span>

          <span>🔥 {meal.calories} cal</span>

        </div>

        {/* Bottom */}
        <div className="mt-6 flex items-center justify-between">

          <h3 className="text-3xl font-bold text-orange-500">
            ${meal.price}
          </h3>

          <button
            onClick={handleAddToCart}
            className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-orange-600 active:scale-95"
          >
            Add To Cart
          </button>

        </div>

      </div>

    </div>
  );
};

export default MealCard;