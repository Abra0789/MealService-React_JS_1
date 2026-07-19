import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

import { useSelector } from "react-redux";

import { toast } from "react-toastify";

import OrderCard from "../components/OrderCard";

const MyOrders = () => {
  const { user } = useSelector(
    (state) => state.auth
  );

  const [orders, setOrders] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [expandedPlans, setExpandedPlans] = useState({});

  const toggleSchedule = (planId) => {
    setExpandedPlans((prev) => ({
      ...prev,
      [planId]: !prev[planId],
    }));
  };

  const handleCancelPlan = async (planId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this meal plan?"
    );

    if (!confirmCancel) return;

    try {
      await updateDoc(doc(db, "mealPlans", planId), {
        status: "Cancelled",
      });

      toast.success("Meal Plan Cancelled Successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed To Cancel Meal Plan");
    }
  };

  // Food Orders
  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const orderList = snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        );

        setOrders(orderList);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Monthly Meal Plans
  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "mealPlans"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const planList = snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        );

        setMealPlans(planList);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return (
    <section className="min-h-screen bg-orange-50 py-16">
      <div className="mx-auto max-w-6xl px-5">

        {/* ===================== */}
        {/* My Meal Plans */}
        {/* ===================== */}

        <h1 className="mb-10 text-center text-5xl font-bold">
          My Meal Plans
        </h1>

        {mealPlans.length === 0 ? (

          <div className="mb-16 rounded-3xl bg-white p-10 text-center shadow-lg">

            <h2 className="text-2xl font-bold">
              No Meal Plans Yet
            </h2>

            <p className="mt-3 text-gray-500">
              Build a monthly meal plan to see it here.
            </p>

          </div>

        ) : (

          <div className="mb-16 grid gap-6 md:grid-cols-2">

            {mealPlans.map((plan) => (

              <div
                key={plan.id}
                className="rounded-3xl bg-white p-6 shadow-lg"
              >

                <div className="flex items-start justify-between">

                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      Plan #{plan.id.slice(0, 8)}
                    </p>

                    <h3 className="text-xl font-bold">
                      {plan.startMonthLabel}
                      {plan.duration > 1 && ` → ${plan.endMonthLabel}`}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {plan.duration}{" "}
                      {plan.duration === 1 ? "month" : "months"} ·{" "}
                      {plan.mealType || "Lunch & Dinner"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-4 py-1 text-sm font-semibold ${
                      plan.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {plan.status}
                  </span>

                </div>

                {plan.address && (
                  <p className="mt-3 text-sm text-gray-500">
                    📍 {plan.address}, {plan.city} {plan.zip} · 📞 {plan.phone}
                  </p>
                )}

                <hr className="my-4" />

                <div className="space-y-1 text-sm text-gray-600">

                  {plan.lunchItems?.length > 0 && (
                    <p>
                      🍽 Lunch: {plan.lunchItems.map((i) => i.name).join(", ")}
                    </p>
                  )}

                  {plan.dinnerItems?.length > 0 && (
                    <p>
                      🌙 Dinner: {plan.dinnerItems.map((i) => i.name).join(", ")}
                    </p>
                  )}

                </div>

                {(plan.lunchRotation?.length > 0 ||
                  plan.dinnerRotation?.length > 0) && (
                  <>
                    <button
                      onClick={() => toggleSchedule(plan.id)}
                      className="mt-3 w-full rounded-xl border-2 border-orange-200 py-2 text-xs font-semibold text-orange-500 transition hover:bg-orange-50"
                    >
                      {expandedPlans[plan.id] ? "Hide" : "📅 View"} Daily
                      Rotation
                    </button>

                    {expandedPlans[plan.id] && (
                      <div className="mt-3 max-h-48 overflow-y-auto rounded-xl border border-gray-200 p-3 text-xs">
                        {Array.from({ length: 30 }, (_, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between gap-2 border-b py-1 last:border-0"
                          >
                            <span className="font-medium text-gray-400">
                              Day {i + 1}
                            </span>

                            <span className="text-right text-gray-700">
                              {plan.lunchRotation?.[i] &&
                                `🍽 ${plan.lunchRotation[i]}`}
                              {plan.lunchRotation?.[i] &&
                                plan.dinnerRotation?.[i] &&
                                "  ·  "}
                              {plan.dinnerRotation?.[i] &&
                                `🌙 ${plan.dinnerRotation[i]}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                <hr className="my-4" />

                <div className="flex items-center justify-between">

                  <span className="text-sm text-gray-500">
                    Total Cost
                  </span>

                  <span className="text-xl font-bold text-orange-500">
                    ৳{plan.estimatedTotalCost?.toFixed(0)}
                  </span>

                </div>

                {plan.status === "Active" && (
                  <button
                    onClick={() => handleCancelPlan(plan.id)}
                    className="mt-5 w-full rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
                  >
                    Cancel Plan
                  </button>
                )}

              </div>

            ))}

          </div>

        )}

        {/* ===================== */}
        {/* My Food Orders */}
        {/* ===================== */}

        <h1 className="mb-10 text-center text-5xl font-bold">
          My Orders
        </h1>

        {orders.length === 0 ? (

          <div className="rounded-3xl bg-white p-12 text-center shadow-lg">

            <h2 className="text-3xl font-bold">
              No Orders Yet
            </h2>

            <p className="mt-3 text-gray-500">
              Your orders will appear here after checkout.
            </p>

          </div>

        ) : (

          <div className="grid gap-8">

            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
              />
            ))}

          </div>

        )}

      </div>
    </section>
  );
};

export default MyOrders;