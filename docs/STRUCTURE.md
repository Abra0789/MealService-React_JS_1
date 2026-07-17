# Project Structure — MealService

A full-stack style food ordering web app built with **React + Redux Toolkit + Firebase**, styled with **Tailwind CSS**, bundled with **Vite**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 |
| Routing | React Router v7 |
| State Management | Redux Toolkit (`@reduxjs/toolkit`) |
| Backend / Auth / DB | Firebase (Authentication + Firestore) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion, GSAP |
| Smooth Scroll | Lenis |
| Notifications | React Toastify |
| Build Tool | Vite |
| 3D (available, optional) | Three.js, @react-three/fiber, @react-three/drei |

---

## Folder Structure

```
project/
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   └── images/                    # Local Bangla meal images (jfif/jpg)
│
├── src/
│   ├── App.jsx                    # Route definitions + Firebase auth state listener
│   ├── main.jsx                   # Entry point: Redux Provider, Router, Lenis smooth scroll
│   ├── App.css                    # Tailwind import, global styles, Toastify theme overrides
│   ├── index.css                  # Base HTML/body styles, font import
│   │
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   │
│   ├── components/                # Reusable UI building blocks
│   ├── data/
│   │   └── meals.js               # Master meals dataset (45 items: international + Bangla meals)
│   │
│   ├── firebase/
│   │   └── firebase.js            # Firebase app init — Auth, Firestore, Google provider
│   │
│   ├── layouts/
│   │   └── RootLayout.jsx         # Header + <Outlet /> + Footer wrapper for all routes
│   │
│   ├── pages/                     # Route-level components (mapped in App.jsx)
│   │
│   └── redux/
│       ├── slices/
│       │   ├── authSlice.js       # login / logout / setLoading
│       │   ├── cartSlice.js       # addToCart / increase / decrease / remove / clear
│       │   └── orderSlice.js      # addOrder / clearOrders (currently unused — see notes)
│       └── store/
│           └── index.js           # configureStore combining auth, cart, order reducers
│
├── docs/
│   └── STRUCTURE.md               # This file
│
├── .gitignore                     # node_modules, .env, dist excluded
├── vite.config.js                 # Vite + React + Tailwind + GLSL plugins
└── package.json
```

---

## `components/` — Detailed

| File | Purpose |
|---|---|
| `Header.jsx` | Sticky navbar. Shows nav links, cart item count badge, login/signup buttons or user dropdown (profile/orders/logout), mobile hamburger menu. |
| `Footer.jsx` | Site footer — brand blurb, social icons, contact info, quick links, embedded Google Map. |
| `HeroSection.jsx` | Home page hero banner with CTA buttons. |
| `Statistics.jsx` | Home page stat cards (meals count, customers, delivery time, support). |
| `PopularMeals.jsx` | Home page — shows top 3 highest-rated meals pulled from `data/meals.js`, with working "Add To Cart". |
| `WhyChooseUs.jsx` | Home page feature highlights (delivery, chefs, ingredients, payment). |
| `MealCard.jsx` | Grid card used on the Meals page — image, name, rating, price, Add To Cart. |
| `SearchBar.jsx` | Controlled search input for the Meals page. |
| `CategoryFilter.jsx` | Category pill buttons for filtering meals. |
| `RelatedMeals.jsx` | Shown on MealDetails page — meals sharing the same category. |
| `CartItem.jsx` | Single row in the Cart page — quantity +/- controls, remove button, line total. |
| `OrderSummary.jsx` | Price breakdown (subtotal, delivery fee, 5% tax, total) — used in Cart and Checkout pages. |
| `CheckoutForm.jsx` | Shipping info form (name, email, phone, address, city, ZIP, payment method) + places order in Firestore `orders` collection. |
| `OrderCard.jsx` | Order card on MyOrders page — shows items, total, status badge, cancel button (if status is "Pending"). |
| `LoginForm.jsx` | Email/password login + Google sign-in via Firebase Auth. |
| `SignupForm.jsx` | Registration form with full validation (name, username, email, password strength, confirm password). |
| `ForgotPasswordForm.jsx` | Sends Firebase password reset email. |
| `ProtectedRoute.jsx` | Wrapper — redirects to `/login` if `isLoggedIn` is false in Redux. |

---

## `pages/` — Detailed

| File | Route | Purpose |
|---|---|---|
| `Home.jsx` | `/` | Hero + Statistics + PopularMeals + WhyChooseUs |
| `Meals.jsx` | `/meals` | Full meal catalog with search + category filter |
| `MealDetails.jsx` | `/meals/:id` | Single meal detail, quantity selector, Add To Cart / Buy Now, related meals |
| `Cart.jsx` | `/cart` | Cart items list + order summary + checkout link |
| `Checkout.jsx` | `/checkout` (protected) | CheckoutForm + OrderSummary side by side |
| `Login.jsx` | `/login` | Wraps LoginForm |
| `Signup.jsx` | `/signup` | Wraps SignupForm |
| `ForgotPassword.jsx` | `/forgot-password` | Wraps ForgotPasswordForm |
| `Profile.jsx` | `/profile` (protected) | Shows logged-in user's name, username, email |
| `MyOrders.jsx` | `/my-orders` (protected) | Real-time order list via Firestore `onSnapshot` |
| `NotFound.jsx` | `*` | 404 fallback |

---

## Data Flow (Order Placement)

```
Meals page / MealDetails page
        │  dispatch(addToCart(meal))
        ▼
   Redux cartSlice  ──►  Cart page (review items)
        │
        ▼
   Checkout page → CheckoutForm.jsx
        │  addDoc(collection(db, "orders"), {...})
        ▼
   Firestore "orders" collection
        │  dispatch(clearCart())
        ▼
   MyOrders page ◄── onSnapshot (real-time listener)
```

## Data Flow (Authentication)

```
LoginForm / SignupForm
        │  Firebase Auth (signIn / createUser)
        ▼
   Firestore "users" collection (profile data)
        │
        ▼
   App.jsx → onAuthStateChanged listener
        │  dispatch(login(userData)) / dispatch(logout())
        ▼
   Redux authSlice → used by Header, ProtectedRoute, Profile, Checkout
```

---

## Known Notes / Non-Blocking Observations

- `redux/slices/orderSlice.js` is defined and wired into the store, but no component currently dispatches `addOrder` — orders are written directly to Firestore from `CheckoutForm.jsx` instead. Safe to keep or remove.
- `MealDetails.jsx`'s "Add To Cart" button does not check `isLoggedIn` (unlike "Buy Now", which redirects to `/login`). Not a bug, but inconsistent behavior worth deciding on intentionally.
- `SignupForm.jsx` does not check for duplicate usernames in Firestore — two users could register with the same username.