import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

import { toast } from "react-toastify";

import {
  setStartMonth,
  setDuration,
  setMinBudget,
  toggleMealType,
  addPlanItem,
  removePlanItem,
  resetPlan,
} from "../redux/slices/mealPlanSlice";

import meals from "../data/meals";

import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";

// Generates the current month + next 5 months as options (YYYY-MM + label)
const getMonthOptions = () => {
  const options = [];

  const now = new Date();

  for (let i = 0; i < 6; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1);

    const value = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    const label = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    options.push({ value, label });
  }

  return options;
};

const MealPlan = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const autoConfirmedRef = useRef(false);

  const {
    startMonth,
    duration,
    minBudget,
    wantsLunch,
    wantsDinner,
    lunchItems,
    dinnerItems,
  } = useSelector((state) => state.mealPlan);

  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const monthOptions = getMonthOptions();

  const [activeSlot, setActiveSlot] = useState("lunch");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [saving, setSaving] = useState(false);

  const filteredMeals = meals.filter((meal) => {
    const matchSearch = meal.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      category === "All" ? true : meal.category === category;

    return matchSearch && matchCategory;
  });

  // Keep the active tab valid if a meal type gets unchecked
  useEffect(() => {
    if (!wantsLunch && activeSlot === "lunch") setActiveSlot("dinner");
    if (!wantsDinner && activeSlot === "dinner") setActiveSlot("lunch");
  }, [wantsLunch, wantsDinner, activeSlot]);

  const handleAdd = (meal) => {
    dispatch(addPlanItem({ meal, slot: activeSlot }));
  };

  const handleRemove = (id, slot) => {
    dispatch(removePlanItem({ id, slot }));
  };

  // Items already in the currently active slot (for showing "Added" state)
  const activeList = activeSlot === "lunch" ? lunchItems : dinnerItems;

  // Rotation model: Rice is eaten every day (fixed cost). The other
  // selected items are a variety pool that gets rotated/shuffled across
  // the days of the month — one item per day, not all of them at once.
  // So the daily cost is Rice + the AVERAGE price of the selected
  // items, not the sum of all of them. Adding more variety to choose
  // from should not multiply the cost.
  const getSlotDailyCost = (items) => {
    const riceCost = items.find((item) => item.isFixed)?.price || 0;

    const rotatingItems = items.filter((item) => !item.isFixed);

    const avgRotatingCost =
      rotatingItems.length > 0
        ? rotatingItems.reduce((sum, item) => sum + item.price, 0) /
          rotatingItems.length
        : 0;

    return riceCost + avgRotatingCost;
  };

  const dailyLunchCost = wantsLunch ? getSlotDailyCost(lunchItems) : 0;
  const dailyDinnerCost = wantsDinner ? getSlotDailyCost(dinnerItems) : 0;

  const estimatedMonthlyCost = (dailyLunchCost + dailyDinnerCost) * 30;

  const estimatedTotalCost = estimatedMonthlyCost * duration;

  // minBudget is the amount the user wants to stay WITHIN (a cap),
  // not a floor — so we flag it when the estimate goes over.
  const isOverBudget = minBudget > 0 && estimatedMonthlyCost > minBudget;

  // Label for the end month based on startMonth + duration
  const getEndMonthLabel = () => {
    if (!startMonth) return "";

    const [year, monthNum] = startMonth.split("-").map(Number);

    const endDate = new Date(year, monthNum - 1 + (duration - 1), 1);

    return endDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const handleConfirmPlan = async () => {
    if (!isLoggedIn) {
      toast.warning("Please login to save your meal plan.");
      navigate("/login", {
        state: { from: "/meal-plan", autoConfirm: true },
      });
      return;
    }

    if (!startMonth) {
      toast.warning("Please select a start month.");
      return;
    }

    if (!duration || duration < 1) {
      toast.warning("Duration must be at least 1 month.");
      return;
    }

    const hasExtraItems =
      (wantsLunch && lunchItems.some((item) => !item.isFixed)) ||
      (wantsDinner && dinnerItems.some((item) => !item.isFixed));

    if (!hasExtraItems) {
      toast.warning("Add at least one item besides rice.");
      return;
    }

    const mealType =
      wantsLunch && wantsDinner
        ? "Lunch & Dinner"
        : wantsLunch
        ? "Lunch Only"
        : "Dinner Only";

    try {
      setSaving(true);

      await addDoc(collection(db, "mealPlans"), {
        userId: auth.currentUser.uid,
        userName: user?.fullName || "",
        email: user?.email || "",
        startMonth,
        startMonthLabel: monthOptions.find(
          (opt) => opt.value === startMonth
        )?.label,
        endMonthLabel: getEndMonthLabel(),
        duration,
        minBudget,
        mealType,
        lunchItems: wantsLunch ? lunchItems : [],
        dinnerItems: wantsDinner ? dinnerItems : [],
        estimatedMonthlyCost,
        estimatedTotalCost,
        status: "Active",
        createdAt: serverTimestamp(),
      });

      toast.success("Meal Plan Saved!");

      dispatch(resetPlan());

      navigate("/my-orders");
    } catch (error) {
      console.log(error);
      toast.error("Failed to save meal plan.");
    } finally {
      setSaving(false);
    }
  };

  // If we were redirected here after a forced login (user tried to
  // confirm the plan while logged out), automatically continue the
  // save once they're back and logged in — no extra click needed.
  useEffect(() => {
    if (
      location.state?.autoConfirm &&
      isLoggedIn &&
      !autoConfirmedRef.current
    ) {
      autoConfirmedRef.current = true;
      handleConfirmPlan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">

      <h1 className="mb-3 text-5xl font-bold">
        Monthly Meal Plan
      </h1>

      <p className="mb-6 text-gray-500">
        Pick your daily lunch & dinner items. Rice is always included.
      </p>

      {/* Start Month + Duration */}
      <div className="mb-10 grid max-w-xl gap-6 sm:grid-cols-2">

        <div>
          <label className="mb-2 block font-medium">
            Start Month
          </label>

          <select
            value={startMonth}
            onChange={(e) => dispatch(setStartMonth(e.target.value))}
            className="w-full rounded-xl border p-3 outline-none focus:border-orange-500"
          >
            <option value="">-- Choose a month --</option>

            {monthOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Duration (months)
          </label>

          <input
            type="number"
            min={1}
            value={duration === 0 ? "" : duration}
            onChange={(e) => {
              const val = e.target.value;
              dispatch(setDuration(val === "" ? 0 : Number(val)));
            }}
            className="w-full rounded-xl border p-3 outline-none focus:border-orange-500"
          />

          <p className="mt-1 text-xs text-gray-400">
            Minimum 1 month
          </p>
        </div>

      </div>

      {/* Meal Type Selection */}
      <div className="mb-10 flex gap-8">

        <label className="flex items-center gap-2 font-medium">
          <input
            type="checkbox"
            checked={wantsLunch}
            onChange={() => dispatch(toggleMealType("lunch"))}
            className="h-5 w-5 accent-orange-500"
          />
          🍽 Lunch
        </label>

        <label className="flex items-center gap-2 font-medium">
          <input
            type="checkbox"
            checked={wantsDinner}
            onChange={() => dispatch(toggleMealType("dinner"))}
            className="h-5 w-5 accent-orange-500"
          />
          🌙 Dinner
        </label>

      </div>

      <div className="grid gap-10 lg:grid-cols-3">

        {/* Left: Item Picker */}
        <div className="lg:col-span-2">

          {/* Slot Switch */}
          {wantsLunch && wantsDinner && (
            <div className="mb-6 flex gap-4">

              <button
                onClick={() => setActiveSlot("lunch")}
                className={`rounded-full px-6 py-3 font-semibold transition ${
                  activeSlot === "lunch"
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-700 border border-gray-300"
                }`}
              >
                🍽 Lunch
              </button>

              <button
                onClick={() => setActiveSlot("dinner")}
                className={`rounded-full px-6 py-3 font-semibold transition ${
                  activeSlot === "dinner"
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-700 border border-gray-300"
                }`}
              >
                🌙 Dinner
              </button>

            </div>
          )}

          {!(wantsLunch && wantsDinner) && (
            <p className="mb-6 font-semibold text-orange-500">
              Adding items for: {wantsLunch ? "🍽 Lunch" : "🌙 Dinner"}
            </p>
          )}

          <div className="mb-6 flex flex-wrap items-center gap-4">
            <SearchBar search={search} setSearch={setSearch} />
          </div>

          <CategoryFilter
            category={category}
            setCategory={setCategory}
          />

          <div className="grid gap-6 sm:grid-cols-2">

            {filteredMeals.map((meal) => {

              const isAdded = activeList.some(
                (item) => item.id === meal.id
              );

              return (

                <div
                  key={meal.id}
                  className="flex items-center justify-between rounded-2xl bg-white p-4 shadow"
                >

                  <div className="flex items-center gap-4">

                    <img
                      src={meal.image}
                      alt={meal.name}
                      className="h-16 w-16 rounded-xl object-cover"
                    />

                    <div>
                      <h3 className="font-bold">{meal.name}</h3>
                      <p className="text-sm text-gray-500">
                        ৳{meal.price}
                      </p>
                    </div>

                  </div>

                  <button
                    onClick={() => !isAdded && handleAdd(meal)}
                    disabled={isAdded}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                      isAdded
                        ? "cursor-not-allowed bg-green-100 text-green-700"
                        : "bg-orange-500 text-white hover:bg-orange-600"
                    }`}
                  >
                    {isAdded ? "Added ✓" : "+ Add"}
                  </button>

                </div>

              );

            })}

          </div>

        </div>

        {/* Right: Summary */}
        <div className="sticky top-24 h-fit rounded-3xl bg-white p-8 shadow-2xl">

          <h2 className="mb-1 text-2xl font-bold">
            Your Plan
          </h2>

          {startMonth && (
            <p className="mb-6 text-sm font-medium text-orange-500">
              {monthOptions.find((opt) => opt.value === startMonth)?.label}
              {duration > 1 && ` → ${getEndMonthLabel()}`}
              {" "}({duration} {duration === 1 ? "month" : "months"})
            </p>
          )}

          <label className="mb-2 block font-medium">
            Your Monthly Budget (৳)
          </label>

          <input
            type="number"
            value={minBudget === 0 ? "" : minBudget}
            onChange={(e) => {
              const val = e.target.value;
              dispatch(setMinBudget(val === "" ? 0 : Number(val)));
            }}
            placeholder="e.g. 3000"
            className="mb-6 w-full rounded-xl border p-3 outline-none focus:border-orange-500"
          />

          {/* Lunch List */}
          {wantsLunch && (
            <>
              <h3 className="mb-3 font-bold text-orange-500">
                🍽 Lunch
              </h3>

              <ul className="mb-6 space-y-2">
                {lunchItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>
                      {item.name} {item.isFixed && "(always included)"}
                    </span>

                    {!item.isFixed && (
                      <button
                        onClick={() => handleRemove(item.id, "lunch")}
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Dinner List */}
          {wantsDinner && (
            <>
              <h3 className="mb-3 font-bold text-orange-500">
                🌙 Dinner
              </h3>

              <ul className="mb-6 space-y-2">
                {dinnerItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>
                      {item.name} {item.isFixed && "(always included)"}
                    </span>

                    {!item.isFixed && (
                      <button
                        onClick={() => handleRemove(item.id, "dinner")}
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}

          <hr className="my-6" />

          <p className="mb-2 text-xs text-gray-400">
            Rice every day + the average price of your selected items
            (rotated/shuffled daily), over 30 days.
          </p>

          <div className="flex justify-between text-sm text-gray-500">
            <span>Est. Monthly Cost</span>
            <span>৳{estimatedMonthlyCost.toFixed(0)}</span>
          </div>

          <div className="mt-2 flex justify-between text-lg font-bold">
            <span>Total ({duration} {duration === 1 ? "month" : "months"})</span>
            <span className="text-orange-500">
              ৳{estimatedTotalCost.toFixed(0)}
            </span>
          </div>

          {minBudget > 0 && (
            <p
              className={`mt-4 text-sm font-medium ${
                isOverBudget ? "text-red-500" : "text-green-600"
              }`}
            >
              {isOverBudget
                ? "⚠️ This exceeds your monthly budget — add more affordable items to lower the daily average, or remove pricier ones."
                : "✅ Fits within your monthly budget."}
            </p>
          )}

          <button
            onClick={handleConfirmPlan}
            disabled={saving}
            className="mt-6 w-full rounded-xl bg-orange-500 py-4 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Confirm & Save Plan"}
          </button>

          <button
            onClick={() => dispatch(resetPlan())}
            className="mt-3 w-full rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-500 transition hover:bg-gray-100"
          >
            Clear Plan
          </button>

        </div>

      </div>

    </section>
  );
};

export default MealPlan;