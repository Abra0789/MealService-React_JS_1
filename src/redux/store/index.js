import { configureStore } from "@reduxjs/toolkit";

import cartReducer from "../slices/cartSlice";
import authReducer from "../slices/authSlice";
import orderReducer from "../slices/orderSlice";
import mealPlanReducer from "../slices/mealPlanSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    order: orderReducer,
    mealPlan: mealPlanReducer,
  },
});