import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const MealPlanConfirmation = () => {
  const { planId } = useParams();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const docSnap = await getDoc(doc(db, "mealPlans", planId));

        if (docSnap.exists()) {
          setPlan({ id: docSnap.id, ...docSnap.data() });
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error(error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [planId]);

  if (loading) {
    return (
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="text-gray-500">Loading your meal plan...</p>
      </section>
    );
  }

  if (notFound || !plan) {
    return (
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl font-bold">Meal Plan Not Found</h1>
        <p className="mt-4 text-gray-500">
          We couldn't find that meal plan.
        </p>
        <Link
          to="/my-orders"
          className="mt-8 inline-block rounded-xl bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600"
        >
          View My Orders
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">

      {/* Success Header */}
      <div className="mb-10 text-center">

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
          ✅
        </div>

        <h1 className="text-4xl font-bold">
          Meal Plan Confirmed!
        </h1>

        <p className="mt-3 text-gray-500">
          Thanks {plan.userName?.split(" ")[0]}, your monthly plan has been saved.
        </p>

      </div>

      {/* Receipt Slip */}
      <div className="rounded-3xl bg-white p-8 shadow-xl">

        {/* Plan Meta */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed pb-6">

          <div>
            <p className="text-sm text-gray-500">Plan ID</p>
            <p className="text-lg font-bold">
              #{plan.id.slice(0, 8).toUpperCase()}
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500">Duration</p>
            <p className="font-semibold">
              {plan.startMonthLabel}
              {plan.duration > 1 && ` → ${plan.endMonthLabel}`}
            </p>
          </div>

          <span className="rounded-full bg-orange-100 px-4 py-1 text-sm font-semibold text-orange-700">
            {plan.status}
          </span>

        </div>

        {/* Customer & Delivery Info */}
        <div className="grid gap-6 border-b border-dashed py-6 sm:grid-cols-2">

          <div>
            <p className="text-sm text-gray-500">Customer</p>
            <p className="font-semibold">{plan.userName}</p>
            <p className="text-sm text-gray-600">{plan.email}</p>
            {plan.phone && (
              <p className="text-sm text-gray-600">{plan.phone}</p>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500">Delivery Address</p>
            <p className="font-semibold">
              {plan.address || "—"}
            </p>
            <p className="text-sm text-gray-600">
              {plan.city} {plan.zip}
            </p>
          </div>

        </div>

        {/* Meal Type & Items */}
        <div className="border-b border-dashed py-6">

          <p className="mb-4 text-sm font-semibold text-gray-500">
            {plan.mealType || "Lunch & Dinner"} · {plan.duration}{" "}
            {plan.duration === 1 ? "month" : "months"}
          </p>

          <div className="space-y-3 text-sm text-gray-700">

            {plan.lunchItems?.length > 0 && (
              <p>
                🍽 <span className="font-semibold">Lunch pool:</span>{" "}
                {plan.lunchItems.map((i) => i.name).join(", ")}
              </p>
            )}

            {plan.dinnerItems?.length > 0 && (
              <p>
                🌙 <span className="font-semibold">Dinner pool:</span>{" "}
                {plan.dinnerItems.map((i) => i.name).join(", ")}
              </p>
            )}

          </div>

          {(plan.lunchRotation?.length > 0 ||
            plan.dinnerRotation?.length > 0) && (
            <>
              <button
                onClick={() => setShowSchedule(!showSchedule)}
                className="mt-4 rounded-xl border-2 border-orange-200 px-4 py-2 text-xs font-semibold text-orange-500 transition hover:bg-orange-50"
              >
                {showSchedule ? "Hide" : "📅 View"} Daily Rotation
              </button>

              {showSchedule && (
                <div className="mt-4 max-h-56 overflow-y-auto rounded-xl border border-gray-200 p-3 text-xs">
                  {Array.from({ length: 30 }, (_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-2 border-b py-1 last:border-0"
                    >
                      <span className="font-medium text-gray-400">
                        Day {i + 1}
                      </span>
                      <span className="text-right text-gray-700">
                        {plan.lunchRotation?.[i] && `🍽 ${plan.lunchRotation[i]}`}
                        {plan.lunchRotation?.[i] && plan.dinnerRotation?.[i] && "  ·  "}
                        {plan.dinnerRotation?.[i] && `🌙 ${plan.dinnerRotation[i]}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

        </div>

        {/* Total */}
        <div className="flex items-center justify-between pt-6">

          <div>
            <p className="text-sm text-gray-500">Est. Monthly Cost</p>
            <p className="font-semibold">
              ৳{plan.estimatedMonthlyCost?.toFixed(0)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500">
              Total ({plan.duration} {plan.duration === 1 ? "month" : "months"})
            </p>
            <p className="text-3xl font-bold text-orange-500">
              ৳{plan.estimatedTotalCost?.toFixed(0)}
            </p>
          </div>

        </div>

      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">

        <Link
          to="/my-orders"
          className="flex-1 rounded-xl border-2 border-orange-500 py-4 text-center font-semibold text-orange-500 transition hover:bg-orange-500 hover:text-white"
        >
          View My Orders
        </Link>

        <Link
          to="/meals"
          className="flex-1 rounded-xl bg-orange-500 py-4 text-center font-semibold text-white transition hover:bg-orange-600"
        >
          Continue Shopping
        </Link>

      </div>

    </section>
  );
};

export default MealPlanConfirmation;