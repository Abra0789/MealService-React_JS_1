import CheckoutForm from "../components/CheckoutForm";
import OrderSummary from "../components/OrderSummary";

const Checkout = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">

      <h1 className="mb-10 text-5xl font-bold">
        Checkout
      </h1>

      <div className="grid gap-10 lg:grid-cols-3">

        <div className="lg:col-span-2">
          <CheckoutForm />
        </div>

        <div>
          <OrderSummary />
        </div>

      </div>

    </section>
  );
};

export default Checkout;