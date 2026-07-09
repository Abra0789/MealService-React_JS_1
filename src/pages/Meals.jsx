import { useState } from "react";

import MealCard from "../components/MealCard";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";

import meals from "../data/meals";

const Meals = () => {
  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const filteredMeals = meals.filter((meal) => {
    const matchSearch = meal.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      category === "All"
        ? true
        : meal.category === category;

    return matchSearch && matchCategory;
  });

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">

      <div className="text-center mb-10">

        <h1 className="text-5xl font-bold">

          Our Delicious Meals

        </h1>

        <p className="text-gray-500 mt-4">

          Discover delicious meals from our restaurant.

        </p>

      </div>

      <div className="flex justify-center mb-8">

        <SearchBar
          search={search}
          setSearch={setSearch}
        />

      </div>

      <CategoryFilter
        category={category}
        setCategory={setCategory}
      />

      {filteredMeals.length > 0 ? (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {filteredMeals.map((meal) => (

            <MealCard
              key={meal.id}
              meal={meal}
            />

          ))}

        </div>

      ) : (

        <div className="text-center py-20">

          <h2 className="text-4xl font-bold">

            😔 No Meals Found

          </h2>

          <p className="text-gray-500 mt-4">

            Try another search or category.

          </p>

        </div>

      )}

    </section>
  );
};

export default Meals;