# Project Structure — MealService

A Bangladeshi food-ordering + monthly meal-subscription web app. Built with **React 19 + Redux Toolkit + Firebase**, styled with **Tailwind CSS v4**, bundled with **Vite**.

---

## Tech Stack

| Layer | Technology | Used For |
|---|---|---|
| UI Framework | React 19 | Component rendering |
| Routing | React Router v7 | Client-side navigation |
| State Management | Redux Toolkit | Cart, auth, meal plan state |
| Backend | Firebase Auth | Email/Password + Google login |
| Database | Firebase Firestore | Orders, meal plans, user profiles |
| Styling | Tailwind CSS v4 | All UI styling (`bg-linear-to-*` syntax) |
| Animations | Framer Motion | Header dropdown, mobile menu |
| Smooth Scroll | Lenis | Page-wide scroll feel |
| Notifications | React Toastify | All toast messages |
| Build Tool | Vite | Dev server + bundling |

---

## Entry Point Files — How the App Boots Up

### `src/main.jsx` — The very first file that runs
This is where React actually mounts onto the page. In order, it:
1. Wraps everything in `<StrictMode>` (React's dev-mode safety checks)
2. Wraps everything in Redux's `<Provider store={store}>` — this is what makes `useSelector`/`useDispatch` work in every component
3. Wraps everything in `<BrowserRouter>` — enables all the `<Link>`/`<Route>` navigation
4. Wraps everything in a custom `<SmoothScroll>` component that initializes **Lenis** (the smooth-scrolling library) via `useEffect`
5. Finally renders `<App />` — the actual application

Think of `main.jsx` as the "outer shell" — it never contains any page logic, just the global providers everything else needs.

### `src/App.jsx` — The router + global auth listener
This is the real brain of navigation. It does two jobs:

**1. Listens for login/logout globally** — via `onAuthStateChanged` (a Firebase listener) in a `useEffect`. Every time someone logs in, signs up, or logs out anywhere in the app, this fires and:
   - Looks up their profile in Firestore's `users` collection
   - If found → `dispatch(login(...))` with their full profile
   - If Firebase says they're logged in but Firestore doesn't have the doc yet (a timing race that can happen right after signup) → falls back to basic info from Firebase Auth itself instead of wrongly logging them out
   - If not logged in at all → `dispatch(logout())`

**2. Defines every route** — via `<Routes>`/`<Route>`. All page routes are nested inside one `<Route element={<RootLayout />}>`, which means every page automatically gets the `Header` and `Footer` wrapped around it (see `RootLayout.jsx` below). Routes wrapped in `<ProtectedRoute>` require login; others don't.

Also renders the single app-wide `<ToastContainer />` here — this is why toast messages work correctly no matter which page triggered them; it's not re-mounted on every page change.

---

## Full Folder Structure

```
project/
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   └── images/                    # Local Bangla meal photos (jfif/jpg)
│
├── src/
│   ├── App.jsx                    # Routes + global Firebase auth listener
│   ├── main.jsx                   # React mount point, Redux/Router/Lenis setup
│   ├── App.css                    # Tailwind import, Toastify theme overrides
│   ├── index.css                  # Base fonts, global body styles
│   │
│   ├── assets/                    # hero.png, logos
│   │
│   ├── components/                # Reusable pieces used across pages
│   ├── data/
│   │   └── meals.js               # Master dataset — 45 meals (intl + Bangla)
│   │
│   ├── firebase/
│   │   └── firebase.js            # Firebase init (Auth, Firestore, Google provider)
│   │
│   ├── layouts/
│   │   └── RootLayout.jsx         # Header + <Outlet/> + Footer — wraps every page
│   │
│   ├── pages/                     # One component per route
│   │
│   └── redux/
│       ├── slices/
│       │   ├── authSlice.js       # login / logout / setLoading
│       │   ├── cartSlice.js       # add / increase / decrease / remove / clear
│       │   ├── mealPlanSlice.js   # month, duration, lunch/dinner pools, delivery info
│       │   └── orderSlice.js      # defined but currently unused (see notes)
│       └── store/
│           └── index.js           # configureStore — combines all 4 reducers
│
├── docs/
│   └── STRUCTURE.md               # This file
│
├── .gitignore                     # node_modules, .env, dist excluded
├── vite.config.js
└── package.json
```

---

## `components/` — What Each One Does

| File | Purpose |
|---|---|
| `Header.jsx` | Sticky navbar. Nav links (Home / Meals / Meal Plan / Cart), cart item-count badge, login/signup buttons or user dropdown, mobile hamburger menu. |
| `Footer.jsx` | CTA strip ("Order Now"), brand card, contact info, Quick Links (now with a toast on click), embedded map. |
| `HeroSection.jsx` | Home page banner. "Order Now" / "Explore Menu" both link to `/meals`. |
| `Statistics.jsx` | Home page stat cards. |
| `PopularMeals.jsx` | Home page — top 3 highest-rated meals pulled live from `data/meals.js`, working Add To Cart with toast. |
| `WhyChooseUs.jsx` | Home page feature highlights. |
| `MealCard.jsx` | Grid card on the Meals page — Add To Cart (with toast) + link to details. |
| `SearchBar.jsx` / `CategoryFilter.jsx` | Meals page search + category filtering. |
| `RelatedMeals.jsx` | Shown on MealDetails — same-category meals. |
| `CartItem.jsx` | One row in the Cart page — qty +/-, remove. |
| `OrderSummary.jsx` | Price breakdown (subtotal/delivery/tax/total) — used in Cart & Checkout. |
| `CheckoutForm.jsx` | Shipping form (name/email/phone/address/city/zip/payment) → writes to Firestore `orders`, then routes to the confirmation slip. |
| `OrderCard.jsx` | One order card in MyOrders — items, total, status badge, Cancel button (if "Pending"). |
| `LoginForm.jsx` | Email/password + Google login. Redirects back to wherever the user came from. Password show/hide toggle. Logs real Firebase error codes to console. |
| `SignupForm.jsx` | Registration with full validation. Also redirects back to origin page. |
| `ForgotPasswordForm.jsx` | Firebase password reset email. |
| `ProtectedRoute.jsx` | Redirects to `/login` if not authenticated. |

---

## `pages/` — One Per Route

| File | Route | Protected? | Purpose |
|---|---|---|---|
| `Home.jsx` | `/` | No | Hero + Stats + Popular Meals + Why Choose Us |
| `Meals.jsx` | `/meals` | No | Full catalog, search + category filter |
| `MealDetails.jsx` | `/meals/:id` | No | Single meal, quantity picker, Add To Cart / Buy Now |
| `Cart.jsx` | `/cart` | No | Cart items + summary + "Proceed To Checkout" |
| `Checkout.jsx` | `/checkout` | **Yes** | Wraps `CheckoutForm` + `OrderSummary` |
| `OrderConfirmation.jsx` | `/order-confirmation/:orderId` | **Yes** | Receipt-style slip shown right after placing an order |
| `MealPlan.jsx` | `/meal-plan` | No (save requires login) | Build a monthly plan: month, duration, Lunch/Dinner, item pool, delivery info, 30-day rotation preview |
| `MealPlanConfirmation.jsx` | `/meal-plan-confirmation/:planId` | **Yes** | Receipt-style slip shown right after saving a meal plan |
| `Login.jsx` / `Signup.jsx` / `ForgotPassword.jsx` | `/login` `/signup` `/forgot-password` | No | Auth pages |
| `Profile.jsx` | `/profile` | **Yes** | Logged-in user's info |
| `MyOrders.jsx` | `/my-orders` | **Yes** | Real-time (Firestore `onSnapshot`) list of **both** Meal Plans and food Orders, each cancellable |
| `NotFound.jsx` | `*` | No | 404 fallback |

---

## How The Pages Connect — Order Flow

```
Meals / Home / MealDetails
        │  click "Add To Cart" → toast shown
        ▼
   Redux cartSlice  ──►  Cart page (review items)
        │  click "Proceed To Checkout"
        ▼
   Checkout page → CheckoutForm.jsx
        │  fill shipping info → "Place Order"
        │  addDoc(orders) in Firestore, dispatch(clearCart())
        ▼
   OrderConfirmation page  (/order-confirmation/:orderId)
        │  fetches that one order back from Firestore and
        │  shows it as a receipt slip
        ▼
   MyOrders page ◄── onSnapshot (updates in real time, incl. Cancel)
```

## How The Pages Connect — Meal Plan Flow

```
MealPlan page (/meal-plan)
        │  pick start month + duration
        │  toggle Lunch / Dinner (rice auto-added the moment you do)
        │  add items to the pool → 30-day rotation auto-generated
        │  fill delivery info
        │  click "Confirm & Save Plan"
        │
        ├── not logged in? → /login (remembers to come back + auto-save)
        │
        ▼
   addDoc(mealPlans) in Firestore
        ▼
   MealPlanConfirmation page  (/meal-plan-confirmation/:planId)
        │  shows the plan, item pools, and rotation preview
        ▼
   MyOrders page ◄── same real-time list, with its own Cancel button
```

## How Login/Signup Redirect-Back Works

```
Any protected action while logged out (e.g. "Confirm & Save Plan")
        │  navigate("/login", { state: { from: currentPage, autoConfirm: true } })
        ▼
   LoginForm / SignupForm
        │  on success: navigate(location.state.from, { state: location.state })
        ▼
   Back on the original page
        │  a useEffect checks state.autoConfirm — if true and now logged in,
        │  automatically re-runs the save (e.g. handleConfirmPlan()) with no
        │  extra click needed
        ▼
   Confirmation page
```

---

## `redux/` — State At a Glance

| Slice | Key State | Notes |
|---|---|---|
| `authSlice` | `user`, `isLoggedIn`, `loading` | Driven by `App.jsx`'s Firebase listener |
| `cartSlice` | `cartItems`, `totalQuantity`, `totalAmount` | Used by Cart, Checkout, Header badge |
| `mealPlanSlice` | `startMonth`, `duration`, `wantsLunch/Dinner`, `lunchItems/dinnerItems`, `deliveryInfo` | Reset after a successful save; persists through the login redirect |
| `orderSlice` | `orders` | Defined in the store but **not currently used** — regular orders are written straight to Firestore from `CheckoutForm`, not through this slice |

---

## Known Notes

- `orderSlice.js` is wired into the store but no component dispatches into it — safe to remove later if you want to trim unused code, or safe to leave as-is.
- Firestore Security Rules need explicit `match` blocks for `users`, `orders`, and `mealPlans` — all three currently use `allow read, write: if request.auth != null;` (any logged-in user can read/write any document, not just their own — fine for a small project, worth tightening later if this ever goes to real users).
- `EmptyOrders.jsx` was removed — `MyOrders.jsx` handles the "no orders yet" / "no meal plans yet" empty states inline instead.