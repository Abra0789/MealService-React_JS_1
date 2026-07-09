const features = [
  {
    id: 1,
    icon: "🚚",
    title: "Fast Delivery",
    desc: "Get your favorite food within 30 minutes.",
  },
  {
    id: 2,
    icon: "👨‍🍳",
    title: "Expert Chefs",
    desc: "Prepared by highly skilled professional chefs.",
  },
  {
    id: 3,
    icon: "🥗",
    title: "Fresh Ingredients",
    desc: "Healthy and fresh ingredients every day.",
  },
  {
    id: 4,
    icon: "💳",
    title: "Secure Payment",
    desc: "Safe and secure online payment system.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="bg-orange-50 py-24">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">

          <h2 className="text-5xl font-bold">

            Why Choose MealService?

          </h2>

          <p className="text-gray-500 mt-4">

            We always deliver quality food with excellent service.

          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">

          {features.map((feature) => (

            <div
              key={feature.id}
              className="bg-white rounded-3xl p-8 shadow-lg hover:-translate-y-3 hover:shadow-2xl duration-300"
            >

              <div className="text-6xl">

                {feature.icon}

              </div>

              <h3 className="text-2xl font-bold mt-5">

                {feature.title}

              </h3>

              <p className="text-gray-500 mt-4">

                {feature.desc}

              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default WhyChooseUs;