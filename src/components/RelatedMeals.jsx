import { Link } from "react-router-dom";

const RelatedMeals = ({ meals }) => {

  // যদি Related Meal না থাকে
  if (meals.length === 0) {
    return null;
  }

  return (
    <section className="mt-24">

      {/* Title */}

      <div className="mb-10">

        <h2 className="text-4xl font-bold">
          🍽 Related Meals
        </h2>

        <p className="mt-2 text-gray-500">
          You may also like these delicious meals.
        </p>

      </div>

      {/* Cards */}

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

        {meals.map((meal) => (

          <div
            key={meal.id}
            className="group overflow-hidden rounded-3xl bg-white shadow-lg transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
          >

            {/* Image */}

            <Link to={`/meals/${meal.id}`}>

              <div className="overflow-hidden">

                <img
                  src={meal.image}
                  alt={meal.name}
                  className="h-56 w-full object-cover transition duration-500 group-hover:scale-110"
                />

              </div>

            </Link>

            {/* Body */}

            <div className="p-6">

              <div className="flex items-center justify-between">

                <Link to={`/meals/${meal.id}`}>

                  <h3 className="text-2xl font-bold text-gray-800 hover:text-orange-500 transition">

                    {meal.name}

                  </h3>

                </Link>

                <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">

                  ⭐ {meal.rating}

                </span>

              </div>

              <p className="mt-3 line-clamp-2 text-gray-500">

                {meal.description}

              </p>

              <div className="mt-5 flex justify-between text-sm text-gray-500">

                <span>
                  🚚 {meal.deliveryTime}
                </span>

                <span>
                  🔥 {meal.calories} cal
                </span>

              </div>

              <div className="mt-6 flex items-center justify-between">

                <h3 className="text-3xl font-bold text-orange-500">

                  ${meal.price}

                </h3>

              </div>

              <Link
                to={`/meals/${meal.id}`}
                className="mt-6 block rounded-xl bg-orange-500 py-3 text-center font-semibold text-white transition hover:bg-orange-600"
              >
                View Details
              </Link>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
};

export default RelatedMeals;