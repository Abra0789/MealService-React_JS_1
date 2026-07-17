import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { addToCart } from "../redux/slices/cartSlice";

import meals from "../data/meals";

const PopularMeals = () => {
  const dispatch = useDispatch();

  // Show top rated meals from the real dataset (first 3 by rating)
  const popularMeals = [...meals]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  const handleAddToCart = (meal) => {
    dispatch(addToCart(meal));
  };

  return (
    <section className="max-w-7xl mx-auto py-20 px-6">

      <div className="text-center mb-12">

        <h2 className="text-5xl font-bold">

           Popular Meals

        </h2>

        <p className="text-gray-500 mt-4">

          Choose your favorite meal

        </p>

      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">

        {popularMeals.map((meal) => (

          <div
            key={meal.id}
            className="bg-white rounded-3xl shadow-xl overflow-hidden hover:-translate-y-3 hover:shadow-2xl duration-300"
          >

            <Link to={`/meals/${meal.id}`}>
              <img
                src={meal.image}
                alt={meal.name}
                className="w-full h-60 object-cover"
              />
            </Link>

            <div className="p-6">

              <Link to={`/meals/${meal.id}`}>
                <h3 className="text-2xl font-bold hover:text-orange-500 transition">

                  {meal.name}

                </h3>
              </Link>

              <p className="text-gray-500 mt-2">

                {meal.category}

              </p>

              <div className="flex justify-between mt-5">

                <span className="font-bold text-orange-500">

                  ${meal.price}

                </span>

                <span>

                  ⭐ {meal.rating}

                </span>

              </div>

              <button
                onClick={() => handleAddToCart(meal)}
                className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl transition"
              >

                Add To Cart

              </button>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
};

export default PopularMeals;