import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

import { toast } from "react-toastify";

import {
  setStartMonth,
  setDuration,
  setDeliveryField,
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
    wantsLunch,
    wantsDinner,
    lunchItems,
    dinnerItems,
    deliveryInfo,
  } = useSelector((state) => state.mealPlan);

  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const monthOptions = getMonthOptions();

  const [activeSlot, setActiveSlot] = useState("lunch");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [saving, setSaving] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  const filteredMeals = meals.filter((meal) => {
    const matchSearch = meal.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      category === "All" ? true : meal.category === category;

    return matchSearch && matchCategory;
  });

  // Keep the active tab valid if a meal type gets unchecked — but only
  // switch to the other one if it's actually still selected, otherwise
  // (e.g. both off, or on initial load) this would ping-pong forever.
  useEffect(() => {
    if (activeSlot === "lunch" && !wantsLunch && wantsDinner) {
      setActiveSlot("dinner");
    } else if (activeSlot === "dinner" && !wantsDinner && wantsLunch) {
      setActiveSlot("lunch");
    }
  }, [wantsLunch, wantsDinner, activeSlot]);

  const handleAdd = (meal) => {
    dispatch(addPlanItem({ meal, slot: activeSlot }));
  };

  const handleRemove = (id, slot) => {
    dispatch(removePlanItem({ id, slot }));
  };

  // Single handler for the merged Lunch/Dinner buttons:
  // - Not included yet          -> include it AND switch to it
  // - Included but not active   -> just switch the active tab to it
  // - Included and already active -> try to turn it off (the reducer
  //   itself blocks turning off the last remaining one)
  const handleMealTypeClick = (type) => {
    const isIncluded = type === "lunch" ? wantsLunch : wantsDinner;
    const isActive = activeSlot === type;

    if (!isIncluded) {
      dispatch(toggleMealType(type));
      setActiveSlot(type);
    } else if (!isActive) {
      setActiveSlot(type);
    } else {
      dispatch(toggleMealType(type));
    }
  };

  // Items already in the currently active slot (for showing "Added" state)
  const activeList = activeSlot === "lunch" ? lunchItems : dinnerItems;

  const handleDeliveryChange = (field, value) => {
    dispatch(setDeliveryField({ field, value }));
  };

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

  // Builds a 30-day round-robin rotation so the user can see exactly
  // which selected item lands on which day (this same pattern repeats
  // every month for the plan's duration).
  const generateRotation = (items) => {
    const rotatingItems = items.filter((item) => !item.isFixed);

    if (rotatingItems.length === 0) return [];

    return Array.from(
      { length: 30 },
      (_, i) => rotatingItems[i % rotatingItems.length]
    );
  };

  const lunchRotation = wantsLunch ? generateRotation(lunchItems) : [];
  const dinnerRotation = wantsDinner ? generateRotation(dinnerItems) : [];

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

    if (!wantsLunch && !wantsDinner) {
      toast.warning("Please select Lunch, Dinner, or both.");
      return;
    }

    const hasExtraItems =
      (wantsLunch && lunchItems.some((item) => !item.isFixed)) ||
      (wantsDinner && dinnerItems.some((item) => !item.isFixed));

    if (!hasExtraItems) {
      toast.warning("Add at least one item besides rice.");
      return;
    }

    if (
      !deliveryInfo.phone ||
      !deliveryInfo.address ||
      !deliveryInfo.city ||
      !deliveryInfo.zip
    ) {
      toast.warning("Please fill in your delivery details.");
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
        phone: deliveryInfo.phone,
        address: deliveryInfo.address,
        city: deliveryInfo.city,
        zip: deliveryInfo.zip,
        startMonth,
        startMonthLabel: monthOptions.find(
          (opt) => opt.value === startMonth
        )?.label,
        endMonthLabel: getEndMonthLabel(),
        duration,
        mealType,
        lunchItems: wantsLunch ? lunchItems : [],
        dinnerItems: wantsDinner ? dinnerItems : [],
        lunchRotation: lunchRotation.map((item) => item.name),
        dinnerRotation: dinnerRotation.map((item) => item.name),
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

      {/* Meal Type Selection — one button does both jobs: toggles
          whether this meal time is part of the plan, AND switches
          which pool the item picker below is showing */}
      <div className="mb-10 flex gap-4">

        {["lunch", "dinner"].map((type) => {

          const isIncluded = type === "lunch" ? wantsLunch : wantsDinner;
          const isActive = activeSlot === type;
          const label = type === "lunch" ? "🍽 Lunch" : "🌙 Dinner";

          return (
            <button
              key={type}
              onClick={() => handleMealTypeClick(type)}
              className={`flex items-center gap-2 rounded-full border px-6 py-3 font-semibold transition ${
                isIncluded && isActive
                  ? "border-orange-500 bg-orange-500 text-white"
                  : isIncluded
                  ? "border-orange-300 bg-orange-50 text-orange-600"
                  : "border-gray-300 bg-white text-gray-500"
              }`}
            >
              {isIncluded && <span>✓</span>}
              {label}
            </button>
          );

        })}

      </div>

      <div className="grid gap-10 lg:grid-cols-3">

        {/* Left: Item Picker */}
        <div className="lg:col-span-2">

          {wantsLunch || wantsDinner ? (
            <>
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
            </>
          ) : (
            <div className="rounded-2xl bg-white p-10 text-center text-gray-400 shadow">
              👆 Select Lunch, Dinner, or both above to start adding items.
            </div>
          )}

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

          {(lunchRotation.length > 0 || dinnerRotation.length > 0) && (
            <>
              <button
                onClick={() => setShowSchedule(!showSchedule)}
                className="mb-4 w-full rounded-xl border-2 border-orange-300 py-3 text-sm font-semibold text-orange-500 transition hover:bg-orange-50"
              >
                {showSchedule ? "Hide" : "📅 Preview"} Daily Rotation
              </button>

              {showSchedule && (
                <div className="mb-6 max-h-64 overflow-y-auto rounded-xl border border-gray-200 p-3 text-sm">
                  {Array.from({ length: 30 }, (_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-2 border-b py-1.5 last:border-0"
                    >
                      <span className="font-medium text-gray-400">
                        Day {i + 1}
                      </span>

                      <span className="text-right text-gray-700">
                        {lunchRotation[i] && `🍽 ${lunchRotation[i].name}`}
                        {lunchRotation[i] && dinnerRotation[i] && "  ·  "}
                        {dinnerRotation[i] && `🌙 ${dinnerRotation[i].name}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

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

          <hr className="my-6" />

          <h3 className="mb-4 font-bold text-gray-700">
            Delivery Details
          </h3>

          <div className="space-y-3">

            <input
              type="text"
              placeholder="Phone Number"
              value={deliveryInfo.phone}
              onChange={(e) => handleDeliveryChange("phone", e.target.value)}
              className="w-full rounded-xl border p-3 text-sm outline-none focus:border-orange-500"
            />

            <textarea
              rows="2"
              placeholder="Delivery Address"
              value={deliveryInfo.address}
              onChange={(e) => handleDeliveryChange("address", e.target.value)}
              className="w-full rounded-xl border p-3 text-sm outline-none focus:border-orange-500"
            />

            <div className="grid grid-cols-2 gap-3">

              <input
                type="text"
                placeholder="City"
                value={deliveryInfo.city}
                onChange={(e) => handleDeliveryChange("city", e.target.value)}
                className="w-full rounded-xl border p-3 text-sm outline-none focus:border-orange-500"
              />

              <input
                type="text"
                placeholder="ZIP Code"
                value={deliveryInfo.zip}
                onChange={(e) => handleDeliveryChange("zip", e.target.value)}
                className="w-full rounded-xl border p-3 text-sm outline-none focus:border-orange-500"
              />

            </div>

          </div>

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