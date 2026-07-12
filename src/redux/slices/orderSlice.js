import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
};

const orderSlice = createSlice({
  name: "order",

  initialState,

  reducers: {

    addOrder: (state, action) => {
      state.orders.unshift(action.payload);
    },

    clearOrders: (state) => {
      state.orders = [];
    },

  },
});

export const {
  addOrder,
  clearOrders,
} = orderSlice.actions;

export default orderSlice.reducer;