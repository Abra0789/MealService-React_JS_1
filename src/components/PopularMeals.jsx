const meals = [
  {
    id: 1,
    name: "Pizza",
    price: "$12",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600",
  },
  {
    id: 2,
    name: "Burger",
    price: "$10",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
  },
  {
    id: 3,
    name: "Salad",
    price: "$8",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600",
  },
];

const PopularMeals = () => {
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

        {meals.map((meal) => (

          <div
            key={meal.id}
            className="bg-white rounded-3xl shadow-xl overflow-hidden hover:-translate-y-3 hover:shadow-2xl duration-300"
          >

            <img
              src={meal.image}
              alt={meal.name}
              className="w-full h-60 object-cover"
            />

            <div className="p-6">

              <h3 className="text-2xl font-bold">

                {meal.name}

              </h3>

              <p className="text-gray-500 mt-2">

                Premium Quality Food

              </p>

              <div className="flex justify-between mt-5">

                <span className="font-bold text-orange-500">

                  {meal.price}

                </span>

                <span>

                  ⭐⭐⭐⭐⭐

                </span>

              </div>

              <button className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl">

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