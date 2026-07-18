import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="bg-linear-to-r from-orange-50 to-orange-100 min-h-[90vh] flex items-center rounded-lg">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

        <div>

          <span className="bg-orange-200 text-orange-600 px-5 py-2 rounded-full font-semibold">
            #1 Meal Delivery Service
          </span>

          <h1 className="text-6xl font-extrabold mt-8 leading-tight">
            Fresh Food
            <br />
            Delivered
            <span className="text-orange-500"> To Your Door</span>
          </h1>

          <p className="text-gray-600 mt-8 text-lg leading-8">
            Enjoy healthy, delicious and freshly prepared meals
            delivered within minutes.
          </p>

          <div className="flex gap-5 mt-10">

            <Link
              to="/meals"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl"
            >
              Order Now
            </Link>

            <Link
              to="/meals"
              className="border-2 border-orange-500 text-orange-500 px-8 py-4 rounded-xl hover:bg-orange-500 hover:text-white"
            >
              Explore Menu
            </Link>

          </div>

        </div>

        <div>

          <img
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900"
            alt="Pizza"
            className="rounded-3xl shadow-2xl"
          />

        </div>

      </div>
    </section>
  );
};

export default HeroSection;