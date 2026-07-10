import { configureStore } from "@reduxjs/toolkit";

import cartReducer from "../slices/cartSlice";
import authReducer from "../slices/authSlice";
import orderReducer from "../slices/orderSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    order: orderReducer,
  },
});