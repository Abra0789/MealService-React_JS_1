const categories = [
  "All",
  "Fast Food",
  "Italian",
  "Chicken",
  "Healthy",
  "Premium",
  "Rice",
  "Japanese",
  "Mexican",
  "Seafood",
  "BBQ",
  "Chinese",
  "Dessert",
];

const CategoryFilter = ({ category, setCategory }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-10">
      {categories.map((item) => (
        <button
          key={item}
          onClick={() => setCategory(item)}
          className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 border
            ${
              category === item
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-orange-100 hover:border-orange-500"
            }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;