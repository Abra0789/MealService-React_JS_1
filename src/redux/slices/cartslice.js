//cart brain
//state(store) - order menu
//actions-order slip
// dispatch send action to the redux store, so that reducer can change the state basis on this(dispatch used under components)
//-handover order slip to the waiter

//reducers-kitchen, work on order

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  totalQuantity: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    // Add To Cart
    addToCart: (state, action) => {
      const newItem = action.payload;

      const existingItem = state.cartItems.find(
        (item) => item.id === newItem.id
      );

      state.totalQuantity++;
      state.totalAmount += newItem.price;

      if (existingItem) {
        existingItem.quantity++;
        existingItem.totalPrice += existingItem.price;
      } else {
        state.cartItems.push({
          ...newItem,
          quantity: 1,
          totalPrice: newItem.price,
        });
      }
    },

    // Increase Quantity
    increaseQuantity: (state, action) => {
      const item = state.cartItems.find(
        (item) => item.id === action.payload
      );

      if (!item) return;

      item.quantity++;
      item.totalPrice += item.price;

      state.totalQuantity++;
      state.totalAmount += item.price;
    },

    // Decrease Quantity
    decreaseQuantity: (state, action) => {
      const item = state.cartItems.find(
        (item) => item.id === action.payload
      );

      if (!item) return;

      item.quantity--;
      item.totalPrice -= item.price;

      state.totalQuantity--;
      state.totalAmount -= item.price;

      if (item.quantity === 0) {
        state.cartItems = state.cartItems.filter(
          (cartItem) => cartItem.id !== action.payload
        );
      }
    },

    // Remove Item Completely
    removeFromCart: (state, action) => {
      const item = state.cartItems.find(
        (item) => item.id === action.payload
      );

      if (!item) return;

      state.totalQuantity -= item.quantity;
      state.totalAmount -= item.totalPrice;

      state.cartItems = state.cartItems.filter(
        (cartItem) => cartItem.id !== action.payload
      );
    },

    // Clear Cart
    clearCart: (state) => {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;