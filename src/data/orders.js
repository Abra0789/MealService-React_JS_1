const orders = [
  {
    id: 1001,

    date: "11 July 2026",

    status: "Delivered",

    total: 52,

    items: [
      {
        id: 1,
        name: "Cheese Burger",
        quantity: 2,
        totalPrice: 24,
      },

      {
        id: 2,
        name: "French Fries",
        quantity: 1,
        totalPrice: 8,
      },

      {
        id: 3,
        name: "Cold Drink",
        quantity: 2,
        totalPrice: 20,
      },
    ],
  },

  {
    id: 1002,

    date: "12 July 2026",

    status: "Preparing",

    total: 35,

    items: [
      {
        id: 4,
        name: "Chicken Pizza",
        quantity: 1,
        totalPrice: 35,
      },
    ],
  },
];

export default orders;