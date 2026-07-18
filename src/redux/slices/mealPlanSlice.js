import { createSlice } from "@reduxjs/toolkit";

import meals from "../../data/meals";

// Rice is always included as the common/mandatory item every month.
// Pulled dynamically from the real dataset so price/name/image always
// stay in sync with data/meals.js — no separate hardcoded copy to drift.
const riceFromData = meals.find((m) => m.name === "Rice");

const RICE_ITEM = {
  ...(riceFromData || {
    id: 45,
    name: "Rice",
    price: 90,
    category: "Bangla Meals",
  }),
  isFixed: true, // cannot be removed by the user
};

const initialState = {
  startMonth: "", // e.g. "2026-08" (YYYY-MM)
  duration: 1,     // number of months, minimum 1
  wantsLunch: false,
  wantsDinner: false,
  lunchItems: [],
  dinnerItems: [],
};

const mealPlanSlice = createSlice({
  name: "mealPlan",

  initialState,

  reducers: {
    setStartMonth: (state, action) => {
      state.startMonth = action.payload;
    },

    setDuration: (state, action) => {
      // Allow 0 while the user is mid-typing (so the field can be
      // cleared without snapping back). The real minimum of 1 is
      // enforced as a validation check when the plan is confirmed.
      state.duration = Math.max(0, action.payload);
    },

    // Toggle lunch/dinner selection — never allow turning both off.
    // Rice is added to that slot's list the moment it's switched ON
    // (not before), and simply stays if switched off again.
    toggleMealType: (state, action) => {
      const type = action.payload; // "lunch" | "dinner"

      if (type === "lunch") {
        if (state.wantsLunch && !state.wantsDinner) return; // last one on, block
        state.wantsLunch = !state.wantsLunch;

        if (state.wantsLunch && !state.lunchItems.some((i) => i.isFixed)) {
          state.lunchItems.push(RICE_ITEM);
        }
      } else {
        if (state.wantsDinner && !state.wantsLunch) return; // last one on, block
        state.wantsDinner = !state.wantsDinner;

        if (state.wantsDinner && !state.dinnerItems.some((i) => i.isFixed)) {
          state.dinnerItems.push(RICE_ITEM);
        }
      }
    },

    // Add an item to lunch or dinner list (avoids duplicates)
    addPlanItem: (state, action) => {
      const { meal, slot } = action.payload; // slot: "lunch" | "dinner"

      const list =
        slot === "lunch" ? state.lunchItems : state.dinnerItems;

      const alreadyAdded = list.find((item) => item.id === meal.id);

      if (!alreadyAdded) {
        list.push(meal);
      }
    },

    // Remove an item (fixed items like Rice cannot be removed)
    removePlanItem: (state, action) => {
      const { id, slot } = action.payload;

      if (slot === "lunch") {
        state.lunchItems = state.lunchItems.filter(
          (item) => item.isFixed || item.id !== id
        );
      } else {
        state.dinnerItems = state.dinnerItems.filter(
          (item) => item.isFixed || item.id !== id
        );
      }
    },

    resetPlan: (state) => {
      state.startMonth = "";
      state.duration = 1;
      state.wantsLunch = false;
      state.wantsDinner = false;
      state.lunchItems = [];
      state.dinnerItems = [];
    },
  },
});

export const {
  setStartMonth,
  setDuration,
  toggleMealType,
  addPlanItem,
  removePlanItem,
  resetPlan,
} = mealPlanSlice.actions;

export default mealPlanSlice.reducer;