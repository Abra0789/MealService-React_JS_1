# MealService - সম্পূর্ণ প্রজেক্ট ডকুমেন্টেশন

একটাই ফাইলে: প্রজেক্ট স্ট্রাকচার, pages, components, Redux slices, Firebase, React concepts, business logic, আর ইন্টারভিউ প্রিপ - সবকিছু।

## সূচিপত্র

1. প্রজেক্ট স্ট্রাকচার ও ফ্লো
2. Components - সম্পূর্ণ কোড ব্যাখ্যা
3. Business Logic Guide (Redux Slices, Pages)
4. React Concepts Skills Map
5. Interview Prep (কনসেপ্ট + Q&A)

---

# অংশ ১ - প্রজেক্ট স্ট্রাকচার ও ফ্লো


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

## Entry Point Files - How the App Boots Up

### `src/main.jsx` - The very first file that runs
This is where React actually mounts onto the page. In order, it:
1. Wraps everything in `<StrictMode>` (React's dev-mode safety checks)
2. Wraps everything in Redux's `<Provider store={store}>` - this is what makes `useSelector`/`useDispatch` work in every component
3. Wraps everything in `<BrowserRouter>` - enables all the `<Link>`/`<Route>` navigation
4. Wraps everything in a custom `<SmoothScroll>` component that initializes **Lenis** (the smooth-scrolling library) via `useEffect`
5. Finally renders `<App />` - the actual application

Think of `main.jsx` as the "outer shell" - it never contains any page logic, just the global providers everything else needs.

### `src/App.jsx` - The router + global auth listener
This is the real brain of navigation. It does two jobs:

**1. Listens for login/logout globally** - via `onAuthStateChanged` (a Firebase listener) in a `useEffect`. Every time someone logs in, signs up, or logs out anywhere in the app, this fires and:
   - Looks up their profile in Firestore's `users` collection
   - If found → `dispatch(login(...))` with their full profile
   - If Firebase says they're logged in but Firestore doesn't have the doc yet (a timing race that can happen right after signup) → falls back to basic info from Firebase Auth itself instead of wrongly logging them out
   - If not logged in at all → `dispatch(logout())`

**2. Defines every route** - via `<Routes>`/`<Route>`. All page routes are nested inside one `<Route element={<RootLayout />}>`, which means every page automatically gets the `Header` and `Footer` wrapped around it (see `RootLayout.jsx` below). Routes wrapped in `<ProtectedRoute>` require login; others don't.

Also renders the single app-wide `<ToastContainer />` here - this is why toast messages work correctly no matter which page triggered them; it's not re-mounted on every page change.

---

## Full Folder Structure

```
project/
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   └── images/           # Local Bangla meal photos (jfif/jpg)
│
├── src/
│   ├── App.jsx            # Routes + global Firebase auth listener
│   ├── main.jsx           # React mount point, Redux/Router/Lenis setup
│   ├── App.css            # Tailwind import, Toastify theme overrides
│   ├── index.css          # Base fonts, global body styles
│   │
│   ├── assets/            # hero.png, logos
│   │
│   ├── components/        # Reusable pieces used across pages
│   ├── data/
│   │   └── meals.js       # Master dataset - 45 meals (intl + Bangla)
│   │
│   ├── firebase/
│   │   └── firebase.js    # Firebase init (Auth, Firestore, Google provider)
│   │
│   ├── layouts/
│   │   └── RootLayout.jsx # Header + <Outlet/> + Footer - wraps every page
│   │
│   ├── pages/             # One component per route
│   │
│   └── redux/
│       ├── slices/
│       │   ├── authSlice.js   # login / logout / setLoading
│       │   ├── cartSlice.js   # add / increase / decrease / remove / clear
│       │   ├── mealPlanSlice.js # month, duration, lunch/dinner pools, delivery info
│       │   └── orderSlice.js    # defined but currently unused (see notes)
│       └── store/
│           └── index.js        # configureStore - combines all 4 reducers
│
├── docs/
│   └── STRUCTURE.md            # This file
│
├── .gitignore                  # node_modules, .env, dist excluded
├── vite.config.js
└── package.json
```

---

## `components/` - What Each One Does

| File | Purpose |
|---|---|
| `Header.jsx` | Sticky navbar. Nav links (Home / Meals / Meal Plan / Cart), cart item-count badge, login/signup buttons or user dropdown, mobile hamburger menu. |
| `Footer.jsx` | CTA strip ("Order Now"), brand card, contact info, Quick Links (now with a toast on click), embedded map. |
| `HeroSection.jsx` | Home page banner. "Order Now" / "Explore Menu" both link to `/meals`. |
| `Statistics.jsx` | Home page stat cards. |
| `PopularMeals.jsx` | Home page - top 3 highest-rated meals pulled live from `data/meals.js`, working Add To Cart with toast. |
| `WhyChooseUs.jsx` | Home page feature highlights. |
| `MealCard.jsx` | Grid card on the Meals page - Add To Cart (with toast) + link to details. |
| `SearchBar.jsx` / `CategoryFilter.jsx` | Meals page search + category filtering. |
| `RelatedMeals.jsx` | Shown on MealDetails - same-category meals. |
| `CartItem.jsx` | One row in the Cart page - qty +/-, remove. |
| `OrderSummary.jsx` | Price breakdown (subtotal/delivery/tax/total) - used in Cart & Checkout. |
| `CheckoutForm.jsx` | Shipping form (name/email/phone/address/city/zip/payment) → writes to Firestore `orders`, then routes to the confirmation slip. |
| `OrderCard.jsx` | One order card in MyOrders - items, total, status badge, Cancel button (if "Pending"). |
| `LoginForm.jsx` | Email/password + Google login. Redirects back to wherever the user came from. Password show/hide toggle. Logs real Firebase error codes to console. |
| `SignupForm.jsx` | Registration with full validation. Also redirects back to origin page. |
| `ForgotPasswordForm.jsx` | Firebase password reset email. |
| `ProtectedRoute.jsx` | Redirects to `/login` if not authenticated. |

---

## `pages/` - One Per Route

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

## How The Pages Connect - Order Flow

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

## How The Pages Connect - Meal Plan Flow

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
        │  a useEffect checks state.autoConfirm - if true and now logged in,
        │  automatically re-runs the save (e.g. handleConfirmPlan()) with no
        │  extra click needed
        ▼
   Confirmation page
```

---

## `redux/` - State At a Glance

| Slice | Key State | Notes |
|---|---|---|
| `authSlice` | `user`, `isLoggedIn`, `loading` | Driven by `App.jsx`'s Firebase listener |
| `cartSlice` | `cartItems`, `totalQuantity`, `totalAmount` | Used by Cart, Checkout, Header badge |
| `mealPlanSlice` | `startMonth`, `duration`, `wantsLunch/Dinner`, `lunchItems/dinnerItems`, `deliveryInfo` | Reset after a successful save; persists through the login redirect |
| `orderSlice` | `orders` | Defined in the store but **not currently used** - regular orders are written straight to Firestore from `CheckoutForm`, not through this slice |

---

## Known Notes

- `orderSlice.js` is wired into the store but no component dispatches into it - safe to remove later if you want to trim unused code, or safe to leave as-is.
- Firestore Security Rules need explicit `match` blocks for `users`, `orders`, and `mealPlans` - all three currently use `allow read, write: if request.auth != null;` (any logged-in user can read/write any document, not just their own - fine for a small project, worth tightening later if this ever goes to real users).
- `EmptyOrders.jsx` was removed - `MyOrders.jsx` handles the "no orders yet" / "no meal plans yet" empty states inline instead.

---

# অংশ ২ - Components - সম্পূর্ণ কোড ব্যাখ্যা


`src/components/` ফোল্ডারের প্রতিটা ফাইল, একটা একটা করে - কী করে, কোড কীভাবে কাজ করে, আর কোন React/Redux concept demonstrate করে।

---

## 1. `Header.jsx`

**কাজ:** সব পেজের উপরে থাকা navbar - লোগো, নেভিগেশন, cart badge, লগইন/ইউজার ড্রপডাউন, মোবাইল মেনু।

```jsx
const { user, isLoggedIn } = useSelector((state) => state.auth);
const totalQuantity = useSelector((state) => state.cart.totalQuantity);
```
দুইটা আলাদা slice থেকে দুইটা আলাদা `useSelector` কল - একটা auth-এর জন্য, একটা cart-এর জন্য। এই কারণেই Header, MealCard-এর মতো সম্পূর্ণ ভিন্ন component-এর dispatch করা state পড়তে পারে, কোনো prop drilling ছাড়াই।

```jsx
const [open, setOpen] = useState(false);        // ইউজার ড্রপডাউন খোলা/বন্ধ
const [mobileMenu, setMobileMenu] = useState(false); // মোবাইল হ্যামবার্গার মেনু
```
দুটো আলাদা boolean state - একটা component-এই দুটো ভিন্ন UI অংশের visibility নিয়ন্ত্রণ করছে।

```jsx
const handleLogout = async () => {
  await signOut(auth);      // Firebase থেকে সাইন আউট
  dispatch(logout());        // Redux state ক্লিয়ার
  setOpen(false);            // ড্রপডাউন বন্ধ
  toast.success("Logout Successful!");
  navigate("/");
};
```
৪টা কাজ ক্রমান্বয়ে - Firebase, Redux, local UI state, তারপর navigation। ক্রম গুরুত্বপূর্ণ: Firebase sign out আগে (await দিয়ে অপেক্ষা করে), তারপর Redux - নাহলে UI-তে "লগইন আছে" দেখানো অবস্থায় Firebase আসলে sign out হয়ে যেতে পারত।

```jsx
<NavLink to="/meals" className={({ isActive }) => isActive ? "text-orange-500..." : "text-gray-700"}>
```
`NavLink`-এর className prop একটা **function** নেয় (সাধারণ string না) - React Router নিজেই `isActive` বুল বসিয়ে দেয়, এই route-টাই বর্তমানে সক্রিয় কিনা তার ভিত্তিতে।

```jsx
{!isLoggedIn ? (
  <div>Login / Signup বাটন</div>
) : (
  <div>ইউজার ড্রপডাউন</div>
)}
```
Conditional rendering - লগইন অবস্থা অনুযায়ী সম্পূর্ণ ভিন্ন UI ব্লক।

**Concepts:** `useSelector` (দুইটা slice), `useState` (দুইটা), `useDispatch`, `NavLink` isActive prop, conditional rendering, Framer Motion `AnimatePresence` (ড্রপডাউন/মোবাইল মেনুর animation)

---

## 2. `Footer.jsx`

**কাজ:** সাইটের ফুটার - CTA স্ট্রিপ, ব্র্যান্ড কার্ড, যোগাযোগ তথ্য, Quick Links, ম্যাপ।

```jsx
const quickLinks = [
  ["Home", "/"],
  ["Meals", "/meals"],
  ...
];
```
Array of arrays - প্রতিটা `[name, path]` জোড়া। `.map(([name, path]) => ...)` দিয়ে destructure করে লুপ করা।

```jsx
const handleLinkClick = (name) => {
  toast.info(`Going to ${name}...`);
};
...
<Link to={path} onClick={() => handleLinkClick(name)}>
```
`Link`-এর নিজের navigation বন্ধ হয় না - `onClick` আর `to` দুটোই একসাথে কাজ করে, ক্লিকে টোস্ট দেখায় আর navigation-ও normally ঘটে।

```jsx
{[FaFacebookF, FaInstagram, FaTwitter].map((Icon, index) => (
  <div key={index}><Icon /></div>
))}
```
এখানে array-এর ভেতরের আইটেমগুলো ডেটা না, বরং **component (আইকন)** - `<Icon />` লিখে সরাসরি render করা হচ্ছে। এটা একটা advanced প্যাটার্ন: component-কে variable-এ রেখে dynamically render করা।

**Concepts:** Array destructuring in `.map()`, rendering components dynamically from an array, `Link` + custom `onClick` একসাথে

---

## 3. `HeroSection.jsx`

**কাজ:** Home পেজের ব্যানার, দুটো CTA বাটন।

```jsx
<Link to="/meals" className="bg-orange-500...">Order Now</Link>
<Link to="/meals" className="border-2...">Explore Menu</Link>
```
এই ফাইলটা আগে বাগ ছিল - `<button>` ট্যাগ ছিল, কোনো `onClick`/navigation ছিল না, শুধু দেখতে বাটনের মতো। `<Link>` দিয়ে বদলে সত্যিকারের navigation যোগ করা হয়েছে।

**Concepts:** Static component (কোনো state/props নেই), `Link` for navigation

---

## 4. `Statistics.jsx` ও `WhyChooseUs.jsx`

দুটোই সহজ, স্ট্যাটিক ডেটা render করে। `WhyChooseUs.jsx`-এ একটা লোকাল `features` array আছে (component-এর বাইরে define করা, কারণ এটা কখনো বদলায় না - re-render-এ নতুন করে বানানোর দরকার নেই):
```jsx
const features = [
  { id: 1, icon: "🚚", title: "Fast Delivery", desc: "..." },
  ...
];

const WhyChooseUs = () => (
  <div>{features.map((f) => <div key={f.id}>{f.title}</div>)}</div>
);
```
**কেন array component-এর বাইরে:** component-এর ভেতরে define করলে প্রতি render-এ নতুন array তৈরি হতো (memory-wise অপচয়, আর কোনো লাভও নেই কারণ ডেটা কখনো বদলায় না)।

**Concepts:** Static data + `.map()`, component-বহির্ভূত constant

---

## 5. `SearchBar.jsx`

**কাজ:** Meals পেজের সার্চ ইনপুট - এই কম্পোনেন্টের নিজের কোনো state নেই।

```jsx
const SearchBar = ({ search, setSearch }) => (
  <input
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
);
```
`search` আর `setSearch` - দুটোই parent (`Meals.jsx`) থেকে **prop** হিসেবে আসে। এটা "controlled input, but state lives in the parent" প্যাটার্ন - SearchBar শুধু UI, আসল state parent-এ।

**Concepts:** Props (state + setter দুটোই prop হিসেবে), controlled input

---

## 6. `CategoryFilter.jsx`

**কাজ:** ক্যাটাগরি অনুযায়ী ফিল্টার বাটন।

```jsx
const categories = ["All", "Fast Food", "Bangla Meals", ...]; // component-এর বাইরে, static

const CategoryFilter = ({ category, setCategory }) => (
  <div>
    {categories.map((item) => (
      <button
        key={item}
        onClick={() => setCategory(item)}
        className={category === item ? "bg-orange-500..." : "bg-white..."}
      >
        {item}
      </button>
    ))}
  </div>
);
```
**`key={item}` কেন string দিয়ে, id দিয়ে না:** এখানে ডেটা শুধু string-এর array (object না), তাই string-টাই unique key - প্রতিটা category name আলাদা।

**Concepts:** Props, `.map()` + conditional className (বর্তমান সিলেক্টেড ক্যাটাগরি হাইলাইট করতে)

---

## 7. `MealCard.jsx`

**কাজ:** Meals গ্রিডের একটা কার্ড - ছবি, নাম, দাম, Add To Cart।

```jsx
const MealCard = ({ meal }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(meal));
    toast.success(`${meal.name} added to cart!`);
  };

  return (
    <div>
      <Link to={`/meals/${meal.id}`}>
        <img src={meal.image} alt={meal.name} />
      </Link>
      <button onClick={handleAddToCart}>Add To Cart</button>
    </div>
  );
};
```
একই কার্ডে দুই ধরনের ক্লিকযোগ্য অংশ - ছবি/নাম ক্লিক করলে **navigation** (`Link`), বাটন ক্লিক করলে **action** (`dispatch`)। দুটো সম্পূর্ণ আলাদা কাজ, একটা কার্ডে মিশ্রিত।

**Concepts:** Props (`meal`), `useDispatch`, template literal ব্যবহার করে dynamic route (`/meals/${meal.id}`)

---

## 8. `PopularMeals.jsx`

**কাজ:** Home পেজে টপ-রেটেড ৩টা মিল।

```jsx
const popularMeals = [...meals]
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 3);
```
**`[...meals]` কেন spread করে কপি করা:** `.sort()` মূল array-টাকেই mutate করে (in-place sort)। মূল `meals` (যেটা `data/meals.js`-এ import করা, পুরো অ্যাপ শেয়ার করে) বদলে ফেললে অন্য পেজেও ক্রম বদলে যেত। তাই আগে কপি বানিয়ে সেটার উপর sort করা হয়েছে।

**Concepts:** Array spread (`...`), non-mutating pattern, `.sort()` + `.slice()` চেইন

---

## 9. `RelatedMeals.jsx`

**কাজ:** MealDetails পেজে "একই category-র অন্য মিল" দেখানো।

```jsx
const RelatedMeals = ({ meals }) => {
  if (meals.length === 0) {
    return null; // কিছুই render করে না
  }
  return (...)
};
```
**`return null` কেন:** কোনো related meal না থাকলে section-টাই দেখানোর মানে নেই - খালি heading + কিছু না, সেটা দেখতে খারাপ লাগত। `null` রিটার্ন করলে React কিছুই render করে না, সেকশনটা পুরোপুরি অদৃশ্য।

**Concepts:** Props, early return guard, conditional rendering (component-level, না শুধু element-level)

---

## 10. `CartItem.jsx`

**কাজ:** Cart পেজের একটা row - কোয়ান্টিটি বাড়ানো/কমানো, রিমুভ।

```jsx
<button onClick={() => dispatch(decreaseQuantity(item.id))}>−</button>
<span>{item.quantity}</span>
<button onClick={() => dispatch(increaseQuantity(item.id))}>+</button>
```
প্রতিটা বাটন সরাসরি Redux action dispatch করছে, নিজের কোনো local state নেই - সব state (quantity, price) Redux store-এ, এই component শুধু সেটা দেখায় আর action পাঠায়।

**Concepts:** Props (`item`), `useDispatch`, "dumb component" প্যাটার্ন (নিজের state নেই, সব external)

---

## 11. `OrderSummary.jsx`

**কাজ:** সাবটোটাল, ডেলিভারি ফি, ট্যাক্স, গ্র্যান্ড টোটাল হিসাব করে দেখানো - Cart ও Checkout দুই পেজেই ব্যবহৃত।

```jsx
const { cartItems, totalAmount } = useSelector((state) => state.cart);

const deliveryFee = cartItems.length > 0 ? 5 : 0;
const tax = totalAmount * 0.05;
const grandTotal = totalAmount + deliveryFee + tax;
```
এই তিনটা লাইন প্রতিবার render-এ নতুন করে হিসাব হয় (কোনো `useMemo` না) - কারণ হিসাবটা সহজ (গুণ-ভাগ), performance-এর জন্য memoize করার দরকার নেই।

**কেন `cartItems.length > 0 ? 5 : 0`:** cart খালি থাকলে delivery fee-ও ০ হওয়া উচিত - নাহলে খালি cart-এও ৫ টাকা ডেলিভারি ফি দেখাত, যেটা অর্থহীন।

**Concepts:** `useSelector`, derived/calculated values (state না, প্রতি render-এ হিসাব করা), conditional (ternary) calculation

---

## 12. `CheckoutForm.jsx`

**কাজ:** শিপিং ফর্ম + Firestore-এ অর্ডার সেভ করা। এটাই এই প্রজেক্টের প্রথম বড় বাগ ফিক্স ছিল।

```jsx
const [formData, setFormData] = useState({
  fullName: user?.fullName || "",
  email: user?.email || "",
  phone: "", address: "", city: "", zip: "",
  paymentMethod: "Cash On Delivery",
});
```
**`user?.fullName || ""`:** logged-in ইউজারের নাম/ইমেইল দিয়ে ফর্ম প্রি-ফিল করা, কিন্তু ইউজার null/undefined হলে (যেমন পেজ প্রথম লোড হওয়ার সময়) crash না করে খালি string ফলব্যাক।

```jsx
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};
```
একটাই ফাংশন **সব ইনপুট ফিল্ডের জন্য** - `e.target.name` দিয়ে বুঝে নেয় কোন ফিল্ড বদলাচ্ছে (`<input name="phone" .../>` ইত্যাদি)। এভাবেই ৭টা আলাদা `handleChange` না লিখে একটাই কাজ করে।

```jsx
const orderRef = await addDoc(collection(db, "orders"), { ...formData, items: cartItems, totalAmount, status: "Pending", createdAt: serverTimestamp() });
dispatch(clearCart());
navigate(`/order-confirmation/${orderRef.id}`);
```
তিনটা কাজ ক্রমান্বয়ে - সেভ (await দিয়ে অপেক্ষা), তারপর cart খালি করা, তারপর নতুন doc-এর id দিয়ে navigate। ক্রম উল্টালে (যেমন আগে clearCart) সমস্যা হতো না এখানে, কিন্তু addDoc শেষ না হওয়া পর্যন্ত navigate করা ঠিক না - অর্ডার সেভ ব্যর্থ হলে ভুল পেজে চলে যেত।

**Concepts:** Object `useState`, single change-handler প্যাটার্ন, `async/await`, Firestore `addDoc`, controlled form validation

---

## 13. `LoginForm.jsx`

**কাজ:** ইমেইল/পাসওয়ার্ড + Google লগইন, redirect-back লজিক।

```jsx
const location = useLocation();
const redirectTo = location.state?.from || "/";
```
`location.state?.from` - optional chaining (`?.`), কারণ `location.state` নিজেই `undefined` হতে পারে (কেউ সরাসরি `/login`-এ গেলে, কোথাও থেকে redirect না হয়ে)। `|| "/"` দিয়ে ফলব্যাক।

```jsx
const docSnap = await getDoc(docRef);
if (!docSnap.exists()) {
  toast.error("User data not found.");
  return; // এখানেই থেমে যায়, dispatch(login()) পর্যন্ত পৌঁছায় না
}
```
Firebase Auth সঠিক হলেও (পাসওয়ার্ড ঠিক), Firestore-এ প্রোফাইল না থাকলে লগইন সম্পন্ন হতে দেয় না - early return দিয়ে।

```jsx
} catch (error) {
  console.error("Email login error:", error.code, error.message);
  if (error.code === "auth/invalid-credential") { ... }
  ...
}
```
প্রথমে `console.error` দিয়ে ডেভেলপার (আপনি) দেখতে পারেন আসল কারণ, তারপর ইউজারের জন্য user-friendly toast।

**Concepts:** `useLocation`, optional chaining, early return guard, error-code branching, `console.error` for debugging

---

## 14. `SignupForm.jsx`

**কাজ:** রেজিস্ট্রেশন ফর্ম, ফুল ভ্যালিডেশন।

```jsx
const validateForm = () => {
  const newErrors = {};
  if (formData.fullName.trim().length < 3) {
    newErrors.fullName = "Full Name must be at least 3 characters.";
  }
  ...
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0; // কোনো এরর নেই মানে valid
};
```
**`Object.keys(newErrors).length === 0`:** এটাই বলে দেয় ফর্ম valid কিনা - যদি `newErrors` অবজেক্টে কোনো key-ই না থাকে (কোনো এরর যোগ হয়নি), তাহলে length ০, মানে সব ঠিক আছে।

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return; // invalid হলে এখানেই থেমে যায়, Firebase call-ই হয় না
  ...
};
```
**Concepts:** Object-based error state, `.trim().length` validation, regex validation, `Object.keys()` ট্রিক

---

## 15. `ForgotPasswordForm.jsx`

**কাজ:** Firebase-এর পাসওয়ার্ড রিসেট ইমেইল পাঠানো।

```jsx
await sendPasswordResetEmail(auth, email);
alert("Password reset email sent successfully...");
setEmail(""); // সফল হলে ফিল্ড খালি করে দেয়
```
সবচেয়ে সহজ ফর্ম - একটাই ইনপুট, একটাই Firebase কল। সফল হলে ইনপুট খালি করে দেয় যাতে ইউজার বুঝতে পারে কাজ হয়ে গেছে (visual feedback)।

**Concepts:** সিংগেল `useState`, Firebase Auth utility function

---

## 16. `OrderCard.jsx`

**কাজ:** MyOrders পেজে একটা অর্ডারের কার্ড, status অনুযায়ী রঙ, Cancel বাটন।

```jsx
const orderDate = order.createdAt?.seconds
  ? new Date(order.createdAt.seconds * 1000)
  : new Date();
```
**কেন `?.seconds` আর `* 1000`:** Firestore-এর `serverTimestamp()` একটা বিশেষ অবজেক্ট রিটার্ন করে (`{seconds, nanoseconds}`), সরাসরি JS `Date` না। `seconds` কে `1000` দিয়ে গুণ করে মিলিসেকেন্ডে বদলে তারপর `new Date()`-এ দিতে হয়। `?.` ব্যবহার করা হয়েছে কারণ ডেটা এখনো সার্ভার থেকে না এলে (`createdAt` সাময়িকভাবে `null`) crash না করে fallback করে বর্তমান তারিখ দেখাক।

```jsx
<span className={`... ${
  order.status === "Delivered" ? "bg-green-100 text-green-700"
  : order.status === "Preparing" ? "bg-blue-100 text-blue-700"
  : order.status === "Pending" ? "bg-orange-100 text-orange-700"
  : order.status === "Cancelled" ? "bg-red-100 text-red-700"
  : "bg-gray-100 text-gray-700"
}`}>
```
Chained ternary - একের পর এক status চেক করে সঠিক রঙ বেছে নেয়, কোনোটাই না মিললে শেষে একটা default (gray)।

**Concepts:** Firestore timestamp conversion, optional chaining, chained ternary, props (`order`)

---

## 17. `ProtectedRoute.jsx`

**কাজ:** পুরো প্রজেক্টের সবচেয়ে ছোট কিন্তু গুরুত্বপূর্ণ component - route-লেভেল অথেন্টিকেশন গার্ড।

```jsx
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
```
**`children` prop:** এটা special React prop - কম্পোনেন্ট ট্যাগের ভেতরে যা লেখা হয় সেটাই `children` হিসেবে আসে:
```jsx
<ProtectedRoute>
  <Checkout />
</ProtectedRoute>
```
এখানে `<Checkout />`-টাই `children`। শর্ত সত্যি হলে সেটাই render হয়, নাহলে `<Navigate>` দিয়ে redirect।

**`replace` প্রপ কেন:** ব্রাউজার হিস্টোরিতে নতুন entry যোগ না করে বর্তমান entry-টাই বদলে দেয় - তাই ইউজার "Back" বাটনে চাপলে protected page-টাতেই আবার ফিরে আসবে না, লুপ হবে না।

**Concepts:** `children` prop প্যাটার্ন, `useSelector`, `<Navigate>` (declarative redirect), wrapper/HOC-এর মতো প্যাটার্ন

---

## Skills Map ক্রস-রেফারেন্স (কোন Component কোন Concept বেশি দেখায়)

| Component | সবচেয়ে ভালো demonstrate করে |
|---|---|
| `Header.jsx` | Multiple `useSelector`, conditional rendering |
| `CheckoutForm.jsx` | Object `useState`, single change-handler, async Firestore write |
| `MealPlan.jsx` (pages-এ) | সবকিছু একসাথে - দেখুন `LOGIC_GUIDE.md` |
| `LoginForm.jsx` | `useLocation`, error-code branching |
| `ProtectedRoute.jsx` | `children` prop, declarative redirect |
| `SearchBar.jsx` / `CategoryFilter.jsx` | Pure "controlled by parent" প্যাটার্ন |
| `PopularMeals.jsx` | Non-mutating array ops (`.sort()`, `.slice()`) |
| `OrderCard.jsx` | Firestore timestamp handling, chained ternary |

*(এই ফাইলটা `SKILLS_MAP.md`-এর concept-লিস্ট আর `LOGIC_GUIDE.md`-এর business-logic ব্যাখ্যার মাঝামাঝি - এখানে ফোকাস প্রতিটা component ফাইলের **সম্পূর্ণ কোড**-টা বোঝা।)*

---

# অংশ ৩ - Business Logic Guide


এই ফাইলে শুধু "কোন hook ব্যবহার হয়েছে" না, বরং **আসল business logic** - কোন condition-এ কী ঘটে, কেন সেই condition দরকার, সংখ্যাগুলো কীভাবে হিসাব হয় - সেটা প্রতিটা গুরুত্বপূর্ণ ফাইল ধরে ধরে।

---

## `cartSlice.js` - Cart-এর সব হিসাব এখানে

**`addToCart`** - একই আইটেম দুইবার যোগ করলে duplicate row না বানিয়ে quantity বাড়ায়:
```js
const existingItem = state.cartItems.find((item) => item.id === newItem.id);

if (existingItem) {
  existingItem.quantity += quantity;
  existingItem.totalPrice += newItem.price * quantity;
} else {
  state.cartItems.push({ ...newItem, quantity, totalPrice: newItem.price * quantity });
}
```
**কেন এই চেক:** ধরুন Pizza আগে থেকে cart-এ আছে, আবার Add To Cart চাপলে - চেক না থাকলে cart-এ "Pizza" দুইটা আলাদা row হয়ে যেত। `find()` দিয়ে আগে দেখে নিই আছে কিনা, থাকলে শুধু quantity বাড়াই।

**`decreaseQuantity`** - quantity ০-তে গেলে item পুরোপুরি সরিয়ে দেয়:
```js
item.quantity--;
item.totalPrice -= item.price;
state.totalQuantity--;
state.totalAmount -= item.price;

if (item.quantity === 0) {
  state.cartItems = state.cartItems.filter((cartItem) => cartItem.id !== action.payload);
}
```
**কেন:** ০ quantity নিয়ে item cart-এ পড়ে থাকলে UI-তে "0x Pizza - ৳0" দেখাবে, যেটা অর্থহীন। তাই ০-তে নামলেই automatically remove করে দিই।

**`removeFromCart`** - global total থেকে বিয়োগ করার পরই item সরায়, উল্টো করলে ভুল সংখ্যা হবে:
```js
const item = state.cartItems.find((item) => item.id === action.payload);
state.totalQuantity -= item.quantity;   // আগে item-এর বর্তমান quantity/totalPrice দিয়ে বিয়োগ
state.totalAmount -= item.totalPrice;
state.cartItems = state.cartItems.filter((cartItem) => cartItem.id !== action.payload); // তারপর সরাই
```
**কেন এই ক্রম গুরুত্বপূর্ণ:** আগে filter করে item সরিয়ে ফেললে, তারপর আর তার quantity/totalPrice জানা যেত না - total থেকে বিয়োগ করতে পারতাম না। তাই আগে ডেটা পড়ে নিই, পরে সরাই।

---

## `MealDetails.jsx` - একটা মিলের ডিটেইল পেজ

**Related Meals বের করার শর্ত:**
```js
const relatedMeals = meals
  .filter((item) => item.category === meal.category && item.id !== meal.id)
  .slice(0, 3);
```
**দুইটা শর্ত একসাথে:** (১) একই category হতে হবে, (২) কিন্তু নিজেকে (যেটা এখন দেখছি) বাদ দিতে হবে - নাহলে "Related Meals"-এ নিজের মিলটাই দেখাত। `.slice(0, 3)` দিয়ে সর্বোচ্চ ৩টা।

**Quantity কমানোর গার্ড:**
```js
const decrease = () => {
  if (quantity > 1) {
    setQuantity(quantity - 1);
  }
};
```
**কেন `if (quantity > 1)`:** এই গার্ড না থাকলে quantity ০ বা নেগেটিভ হয়ে যেতে পারত, যেটা বাস্তবে অর্থহীন (০টা আইটেম অর্ডার করা যায় না)।

**Buy Now vs Add To Cart - লগইন চেকের পার্থক্য:**
```js
const handleBuyNow = () => {
  if (!isLoggedIn) {
    navigate("/login");
    return;                     // এখানেই থেমে যায়, cart-এ কিছু যোগ হয় না
  }
  dispatch(addToCart({ ...meal, quantity }));
  navigate("/checkout");
};
```
"Add To Cart" বাটনে এই চেক নেই - সরাসরি cart-এ যোগ হয়ে যায়, লগইন ছাড়াই। **এটা ইচ্ছাকৃত ইনকনসিস্টেন্সি হিসেবে থেকে গেছে** - ব্রাউজ করতে/cart বানাতে লগইন লাগে না, কিন্তু "Buy Now" (সরাসরি checkout-এ যাওয়া) করতে গেলেই লগইন বাধ্যতামূলক, কারণ Checkout রুটটাই `ProtectedRoute` দিয়ে wrap করা।

---

## `MealPlan.jsx` - সবচেয়ে বেশি লজিক এখানে

**Lunch/Dinner টগলের গার্ড (`mealPlanSlice.js`-এ):**
```js
if (state.wantsLunch && !state.wantsDinner) return; // Lunch-ই একমাত্র সিলেক্টেড, বন্ধ করতে দেব না
state.wantsLunch = !state.wantsLunch;
```
**কেন:** দুটোই বন্ধ থাকলে প্ল্যানের কোনো মানে থাকে না (কী রান্না হবে?)। তাই শেষ বাকি থাকা একটাকে বন্ধ করার চেষ্টা করলে reducer চুপচাপ কিছুই করে না।

**Rice কখন যোগ হয়:**
```js
if (state.wantsLunch && !state.lunchItems.some((i) => i.isFixed)) {
  state.lunchItems.push(RICE_ITEM);
}
```
**শর্ত দুটো:** (১) Lunch এখন ON হচ্ছে, (২) আগে থেকে rice নেই (ডাবল যোগ ঠেকাতে)। এই দুটো সত্যি হলেই rice যোগ হয় - Lunch select করার আগে rice কখনো দেখা যাবে না।

**দৈনিক খরচ - sum না, average (rotation মডেল):**
```js
const getSlotDailyCost = (items) => {
  const riceCost = items.find((item) => item.isFixed)?.price || 0;
  const rotatingItems = items.filter((item) => !item.isFixed);
  const avgRotatingCost = rotatingItems.length > 0
    ? rotatingItems.reduce((sum, item) => sum + item.price, 0) / rotatingItems.length
    : 0;
  return riceCost + avgRotatingCost;
};
```
**কেন average, sum না:** ধরুন ৫টা তরকারি সিলেক্ট করলেন। বাস্তবে প্রতিদিন ৫টাই খাবেন না - একটা করে ঘুরিয়ে-ফিরিয়ে (rotate) খাবেন। তাই দৈনিক খরচ = ভাত + সেই দিন যেই তরকারিটা পড়ল তার দাম, আর গড়ে সেটা হলো সবগুলোর average। Sum করলে ৫ গুণ বেশি (ভুল) খরচ দেখাত।

**৩০-দিনের rotation বানানো:**
```js
const generateRotation = (items) => {
  const rotatingItems = items.filter((item) => !item.isFixed);
  if (rotatingItems.length === 0) return [];
  return Array.from({ length: 30 }, (_, i) => rotatingItems[i % rotatingItems.length]);
};
```
**`i % rotatingItems.length` কেন:** এটাই round-robin-এর মূল ট্রিক। ৩টা আইটেম থাকলে - Day 1 → index 0, Day 2 → index 1, Day 3 → index 2, Day 4 → `3 % 3 = 0` (আবার প্রথমটায় ফিরে যায়)। এভাবেই ঘুরতে থাকে।

**Confirm করার আগে validation chain (৫টা শর্ত, একটার পর একটা):**
```js
if (!isLoggedIn) { ... }                          // ১. লগইন আছে?
if (!startMonth) { ... }                          // ২. মাস বাছা হয়েছে?
if (!duration || duration < 1) { ... }             // ৩. অন্তত ১ মাস?
if (!wantsLunch && !wantsDinner) { ... }           // ৪. Lunch/Dinner কোনো একটা অন্তত?
const hasExtraItems = (wantsLunch && lunchItems.some(i => !i.isFixed))
                    || (wantsDinner && dinnerItems.some(i => !i.isFixed));
if (!hasExtraItems) { ... }                        // ৫. ভাত ছাড়া অন্তত একটা আইটেম?
if (!phone || !address || !city || !zip) { ... }   // ৬. ডেলিভারি তথ্য পূর্ণ?
```
প্রতিটা `return` করে দেয় যদি শর্ত না মেলে - মানে প্রথমটা fail করলে বাকিগুলো চেকই হয় না (early exit)।

**Auto-confirm - লগইন থেকে ফিরে এসে নিজে থেকেই সেভ:**
```js
useEffect(() => {
  if (location.state?.autoConfirm && isLoggedIn && !autoConfirmedRef.current) {
    autoConfirmedRef.current = true;
    handleConfirmPlan();
  }
}, [isLoggedIn]);
```
**তিনটা শর্ত একসাথে লাগবে:** (১) লগইন পেজ থেকে ফেরত পাঠানো হয়েছিল এই flag নিয়ে, (২) এখন সত্যিই লগইন আছে, (৩) আগে কখনো auto-confirm হয়নি (ref দিয়ে চেক)। তিনটাই সত্যি হলে তবেই আবার সেভ ট্রিগার হয় - নাহলে প্রতিবার `isLoggedIn` বদলালেই বারবার সেভ হয়ে যেত।

---

## `CheckoutForm.jsx` - অর্ডার প্লেস করার লজিক

**সব ফিল্ড খালি কিনা চেক (Firestore-এ পাঠানোর আগেই):**
```js
if (!formData.fullName || !formData.email || !formData.phone ||
    !formData.address || !formData.city || !formData.zip) {
  toast.warning("Please fill all shipping fields.");
  return;
}
```
**কেন Firestore-এ লেখার আগে:** খালি ফিল্ড নিয়ে order সেভ হয়ে গেলে ডেলিভারি করা যাবে না, কিন্তু অর্ডার তো প্লেস হয়ে যাবে। তাই সেভ করার আগেই আটকানো, পরে ঠিক করা না।

**Order ID সাথে সাথেই ব্যবহার করা:**
```js
const orderRef = await addDoc(collection(db, "orders"), { ... });
navigate(`/order-confirmation/${orderRef.id}`);
```
`addDoc` নিজেই নতুন ডকুমেন্টের ID রিটার্ন করে (`orderRef.id`) - এটা আলাদা করে আবার query করে বের করতে হয় না, সরাসরি ব্যবহার করে পরের পেজে পাঠানো যায়।

---

## `OrderCard.jsx` / `MyOrders.jsx` - Cancel বাটনের শর্ত

```jsx
{order.status === "Pending" && (
  <button onClick={handleCancelOrder}>Cancel Order</button>
)}
```
**কেন শুধু "Pending"-এ:** যে অর্ডার ইতিমধ্যে "Delivered" বা "Cancelled" হয়ে গেছে, সেটা আবার cancel করার কোনো মানে নেই। শুধু যেটা এখনো প্রসেসে আছে, সেটাই cancel করা যায়।

```js
const handleCancelOrder = async () => {
  const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
  if (!confirmCancel) return;   // "না" দিলে কিছুই হয় না
  await updateDoc(doc(db, "orders", order.id), { status: "Cancelled" });
};
```
**`window.confirm` কেন:** ভুল করে ক্লিক হয়ে গেলে যেন সাথে সাথে cancel না হয়ে যায় - একটা extra confirmation স্টেপ।

---

## `SignupForm.jsx` - ভ্যালিডেশনের রেজেক্স-গুলো

```js
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#])[A-Za-z\d@$!%*?&.#]{8,}$/;
```
এটা **৪টা শর্ত একসাথে** চেক করে (`(?=...)` মানে "lookahead" - শুধু চেক করে, ক্যারেক্টার consume করে না):
- `(?=.*[a-z])` - অন্তত একটা ছোট হাতের অক্ষর থাকতে হবে
- `(?=.*[A-Z])` - অন্তত একটা বড় হাতের অক্ষর
- `(?=.*\d)` - অন্তত একটা সংখ্যা
- `(?=.*[@$!%*?&.#])` - অন্তত একটা স্পেশাল ক্যারেক্টার
- শেষে `{8,}` - মিনিমাম ৮ ক্যারেক্টার লম্বা

```js
if (formData.password !== formData.confirmPassword) {
  newErrors.confirmPassword = "Passwords do not match.";
}
```
সহজ string comparison - দুটো field মিলছে কিনা।

---

## `LoginForm.jsx` - এরর কোড অনুযায়ী আলাদা মেসেজ

```js
if (error.code === "auth/invalid-credential") {
  toast.error("Invalid email or password.");
} else if (error.code === "auth/user-not-found") {
  toast.error("User not found.");
} else if (error.code === "auth/wrong-password") {
  toast.error("Wrong password.");
} else {
  toast.error("An error occurred.");
}
```
**কেন এতগুলো আলাদা `if`:** Firebase নিজেই আলাদা আলাদা error code পাঠায় ভিন্ন ভিন্ন কারণের জন্য। আমরা সেই কোড দেখে ইউজারকে নির্দিষ্ট, বোধগম্য মেসেজ দেখাই - সবসময় "An error occurred" দেখালে ইউজার বুঝত না ভুল ইমেইল না পাসওয়ার্ড।

---

## `App.jsx` - Auth Listener-এর Race Condition ফিক্স

```js
if (docSnap.exists()) {
  dispatch(login({ uid: currentUser.uid, ...docSnap.data() }));
} else {
  // Firestore-এ প্রোফাইল এখনো লেখা শেষ হয়নি (signup-এর ঠিক পরপরই এমন হতে পারে)
  dispatch(login({
    uid: currentUser.uid,
    fullName: currentUser.displayName || "",
    email: currentUser.email || "",
  }));
}
```
**সমস্যাটা ছিল:** আগে `else` ব্লকে `dispatch(logout())` করত। কিন্তু Signup করার সাথে সাথেই Firebase Auth ইউজারকে লগইন করিয়ে দেয়, আর সেই মুহূর্তে এই listener-ও ফায়ার করে - যদি Firestore-এ প্রোফাইল ডকুমেন্ট (যেটা Signup ফর্ম আলাদাভাবে লিখছিল) তখনো সেভ শেষ না হয়ে থাকে, `docSnap.exists()` false হতো, আর এই listener সাথে সাথে ইউজারকে **logout করে দিত** - যদিও অ্যাকাউন্ট আসলে ঠিকই তৈরি হয়েছিল। ফিক্স: প্রোফাইল না পেলে জোর করে logout না করে, Firebase Auth নিজেই যা জানে (email, নাম) সেটা দিয়ে সাময়িকভাবে লগইন রাখা।

---

**কীভাবে ব্যবহার করবেন:** ইন্টারভিউতে কোনো একটা পেজ নিয়ে জিজ্ঞেস করলে ("cart-এ quantity কমালে কী হয়?"), উপরের সংশ্লিষ্ট অংশটা দেখে সরাসরি condition + reasoning বলে দিতে পারবেন।

---

# অংশ ৪ - React Concepts Skills Map


React সাধারণত যে অর্ডারে শেখানো হয়, ঠিক সেই অর্ডারে - প্রতিটা concept-এর পাশে এই প্রজেক্টে ঠিক কোথায় ব্যবহার করা হয়েছে, আর ছোট কোড দিয়ে কীভাবে কাজ করে সেটাও।

---

## 1. JSX
HTML-এর মতো syntax লেখা সরাসরি JavaScript-এর ভেতরে। `{ }`-এর ভেতরে যেকোনো JS এক্সপ্রেশন বসানো যায়।
```jsx
<h3 className="text-2xl font-bold">{meal.name}</h3>
```
- **ব্যবহার:** প্রতিটা `.jsx` ফাইলে (৩০+ কম্পোনেন্ট/পেজ)

## 2. Function Components
UI রিটার্ন করা একটা সাধারণ JS function।
```jsx
const MealCard = ({ meal }) => {
  return <div>{meal.name}</div>;
};
```
- **ব্যবহার:** `MealCard`, `Header`, `Footer`, `CartItem` - প্রতিটা component-ই এরকম

## 3. Props (Parent → Child ডেটা পাঠানো)
Parent একটা value বানায়, child সেটা প্যারামিটার হিসেবে পায় - child নিজে থেকে এটা বদলাতে পারে না।

`Meals.jsx` (parent) - লুপ করে প্রতিটা meal পাঠায়:
```jsx
{filteredMeals.map((meal) => (
  <MealCard key={meal.id} meal={meal} />
))}
```
`MealCard.jsx` (child) - সেটা রিসিভ করে:
```jsx
const MealCard = ({ meal }) => {
  return <h3>{meal.name}</h3>; // meal.price, meal.image ইত্যাদিও এভাবে পায়
};
```

**Lifting state up** - child থেকে parent-এর state বদলাতে হলে parent নিজের setter ফাংশনটাই prop হিসেবে পাঠায়:
```jsx
// Meals.jsx (parent)
<CategoryFilter category={category} setCategory={setCategory} />

// CategoryFilter.jsx (child) - parent-এর state বদলে দিচ্ছে prop দিয়ে পাওয়া ফাংশন কল করে
<button onClick={() => setCategory("Rice")}>Rice</button>
```
- **আরও ব্যবহার:** `Cart.jsx` → `CartItem`-এ `item`, `MyOrders.jsx` → `OrderCard`-এ `order`

## 4. Rendering Lists (`.map()` + `key`)
Array-কে UI-তে রূপান্তর করতে `.map()`, আর React-কে বলে দিতে কোনটা কোনটা (re-render-এ ঠিকভাবে ট্র্যাক করতে) `key` লাগে - `id`-র মতো unique কিছু, index না।
```jsx
{cartItems.map((item) => (
  <CartItem key={item.id} item={item} />
))}
```
- **ব্যবহার:** `Meals.jsx`, `Cart.jsx`, `MyOrders.jsx`, `Footer.jsx` (Quick Links), `PopularMeals.jsx`

## 5. Conditional Rendering
```jsx
// Ternary - দুটোর একটা দেখাও
{isLoggedIn ? <UserMenu /> : <LoginButton />}

// && - শর্ত সত্যি হলেই দেখাও, নাহলে কিছুই না
{errors.email && <p className="text-red-500">{errors.email}</p>}

// Early return - MealDetails.jsx পুরো component-ই আগেভাগে থামিয়ে দেয়
if (!meal) {
  return <h1>Meal Not Found 😢</h1>;
}
```

## 6. Handling Events
Event handler ফাংশন যা `onClick`/`onChange`/`onSubmit`-এ পাস করা হয়।
```jsx
// ক্লিক - সরাসরি অ্যাকশন ডিসপ্যাচ
<button onClick={() => dispatch(increaseQuantity(item.id))}>+</button>

// Input চেঞ্জ - event object থেকে value বের করে state আপডেট
<input onChange={(e) => setSearch(e.target.value)} />

// ফর্ম সাবমিট - e.preventDefault() না দিলে পেজ রিলোড হয়ে যাবে
const handleSubmit = (e) => {
  e.preventDefault();
  // ...
};
```

## 7. `useState`
কম্পোনেন্ট মনে রাখে একটা ভ্যালু, বদলালে re-render হয়। `useState`-এর return করা array-টা `[currentValue, setterFunction]`।

```jsx
// সাধারণ primitive
const [search, setSearch] = useState("");

// Object state - একসাথে অনেকগুলো field ট্র্যাক করতে (CheckoutForm.jsx)
const [formData, setFormData] = useState({
  fullName: "", email: "", phone: "", address: "",
});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value })); // পুরনো state স্প্রেড করে শুধু একটা field বদলাচ্ছি
};

// Boolean toggle (LoginForm.jsx)
const [showPassword, setShowPassword] = useState(false);
<button onClick={() => setShowPassword(!showPassword)}>
  {showPassword ? "Hide" : "Show"}
</button>
```
**কেন `(prev) => ({...prev, ...})` লিখি:** নতুন state পুরনো state-এর উপর নির্ভর করলে সরাসরি `formData` ভ্যারিয়েবল না পড়ে `prev` ব্যবহার করি - stale state bug এড়াতে।

## 8. Controlled Forms
Input-এর ভ্যালু DOM না, React state ঠিক করে - `value` state থেকে আসে, `onChange` সেই state আপডেট করে।
```jsx
<input
  type="email"
  value={formData.email}      // state থেকে ভ্যালু দেখাচ্ছে
  onChange={handleChange}     // টাইপ করলেই state আপডেট হয়, তাই re-render হয়ে নতুন ভ্যালু দেখায়
/>
```
এই প্যাটার্ন ছাড়া (`value` না দিলে) - আগে `CheckoutForm.jsx`-এ এটাই bug ছিল: ইনপুট ফিল্ডে `value`/`onChange` কিছুই ছিল না, তাই ইউজার যা টাইপ করত সেটা কোথাও সেভ হতোই না।

## 9. `useEffect`
Render শেষ হওয়ার পর side effect চালায়। Dependency array (`[...]`) ঠিক করে কখন আবার চলবে।

```jsx
// একবারই চলে (mount-এ) - main.jsx, Lenis সেটআপ
useEffect(() => {
  const lenis = new Lenis({ duration: 1.2 });
  return () => lenis.destroy(); // cleanup - component সরে গেলে destroy হয়
}, []);

// একটা ভ্যালুর উপর নির্ভরশীল - OrderConfirmation.jsx
useEffect(() => {
  const fetchOrder = async () => {
    const docSnap = await getDoc(doc(db, "orders", orderId));
    setOrder(docSnap.data());
  };
  fetchOrder();
}, [orderId]); // orderId বদলালে আবার fetch করবে

// Subscription + cleanup - App.jsx, Firebase auth listener
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    dispatch(currentUser ? login(...) : logout());
  });
  return () => unsubscribe(); // listener বন্ধ করে memory leak এড়ায়
}, [dispatch]);
```
**গুরুত্বপূর্ণ:** `MyOrders.jsx`-এ `onSnapshot` ব্যবহার করেছি (`getDoc` না) কারণ এটা **real-time** - অন্য কেউ/অন্য ট্যাব থেকে ডেটা বদলালে অটোমেটিক আপডেট হয়, ম্যানুয়াল রিফ্রেশ লাগে না।

## 10. `useRef`
Re-render না ঘটিয়ে একটা ভ্যালু মনে রাখে - `useState`-এর উল্টো, ভ্যালু বদলালে component re-render হয় না।
```jsx
// MealPlan.jsx - auto-save যেন শুধু একবারই ট্রিগার হয়
const autoConfirmedRef = useRef(false);

useEffect(() => {
  if (location.state?.autoConfirm && isLoggedIn && !autoConfirmedRef.current) {
    autoConfirmedRef.current = true; // এটা বদলালেও re-render হবে না
    handleConfirmPlan();
  }
}, [isLoggedIn]);
```
`useState` দিয়ে এটা করলে flag বদলানোর সাথে সাথেই একটা অতিরিক্ত re-render হতো - এখানে সেটার দরকার নেই, শুধু মনে রাখাটাই দরকার।

## 11. Context API
- **ব্যবহার হয়নি** - এর বদলে পুরো প্রজেক্টে **Redux Toolkit** ব্যবহার করা হয়েছে global state-এর জন্য

---

## 12. React Router

| Feature | কোথায় |
|---|---|
| `<Routes>` / `<Route>` | `App.jsx` |
| `<Outlet />` | `RootLayout.jsx` |
| `<Link>` | `Footer.jsx` |
| `<NavLink>` | `Header.jsx` |
| `useParams()` | `MealDetails`, `OrderConfirmation`, `MealPlanConfirmation` |
| `useNavigate()` | ফর্ম সাবমিটের পর রিডাইরেক্ট করতে |
| `useLocation()` | Redirect-back state পড়তে |
| Protected Routes | `ProtectedRoute.jsx` |

**কীভাবে কাজ করে:**
```jsx
// App.jsx - রুট ডিফাইনেশন, nested route সব RootLayout-এর ভেতরে
<Route element={<RootLayout />}>
  <Route path="meals" element={<Meals />} />
  <Route path="meals/:id" element={<MealDetails />} />
</Route>

// MealDetails.jsx - URL-এর :id অংশটা ধরা
const { id } = useParams();
const meal = meals.find((item) => item.id === Number(id));

// NavLink - বর্তমান পেজ হলে আলাদা স্টাইল (isActive এটা নিজেই বলে দেয়)
<NavLink to="/meals" className={({ isActive }) => isActive ? "text-orange-500" : "text-gray-700"}>
  Meals
</NavLink>

// ProtectedRoute.jsx - লগইন না থাকলে পাঠিয়ে দেয়
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
};
```

**Redirect-back প্যাটার্ন (useLocation + useNavigate একসাথে):**
```jsx
// MealPlan.jsx - লগইন পেজে পাঠানোর সময় "কোথা থেকে এলাম" সাথে পাঠাই
navigate("/login", { state: { from: "/meal-plan", autoConfirm: true } });

// LoginForm.jsx - সেই state ফিরে পড়ি, সফল হলে সেখানেই ফেরত পাঠাই
const location = useLocation();
const redirectTo = location.state?.from || "/";
navigate(redirectTo, { state: location.state });
```

---

## 13. Redux Toolkit (Global State)

| Concept | সংজ্ঞা | কোথায় |
|---|---|---|
| **Store** | পুরো অ্যাপের state-এর একটাই object | `redux/store/index.js` |
| **Slice** | State-এর একটা অংশ + reducers | `cartSlice`, `authSlice`, `mealPlanSlice`, `orderSlice` |
| **Reducer** | `(state, action) => newState` | `cartSlice.js` |
| **Action** | কী ঘটল তার বর্ণনা | `createSlice` অটো বানায় |
| **`useSelector`** | Store থেকে পড়া | `Header.jsx` |
| **`useDispatch`** | Action পাঠানো | `CartItem.jsx` |

**পুরো ফ্লো, কোড দিয়ে (Add To Cart):**
```jsx
// 1. store/index.js - সব slice যোগ করা, "cart" নামটাই key
export const store = configureStore({
  reducer: { cart: cartReducer, auth: authReducer, ... },
});

// 2. MealCard.jsx - ক্লিক করলে action dispatch হয়
const dispatch = useDispatch();
dispatch(addToCart(meal));

// 3. cartSlice.js - reducer state আপডেট করে
addToCart: (state, action) => {
  const newItem = action.payload; // এখানে পুরো meal অবজেক্টটা পাই
  state.totalQuantity += 1;        // Immer-এর জন্য direct "mutation"-এর মতো লেখা যায়
  state.cartItems.push({ ...newItem, quantity: 1 });
},

// 4. Header.jsx - যে কেউ এই state পড়ছে সে অটো re-render হয়
const totalQuantity = useSelector((state) => state.cart.totalQuantity);
```
`MealCard` আর `Header` একে অপরের parent-child না, তাও ডেটা শেয়ার হচ্ছে - এটাই Redux-এর মূল সুবিধা, props দিয়ে অনেক লেয়ার ঘুরিয়ে আনতে হচ্ছে না।

---

## 14. Async ডেটা / Firebase ইন্টিগ্রেশন

| কাজ | মেথড | কোথায় |
|---|---|---|
| একবার পড়া | `getDoc()` | `OrderConfirmation`, `LoginForm` |
| রিয়েল-টাইম শোনা | `onSnapshot()` | `MyOrders.jsx` |
| নতুন লেখা | `addDoc()` | `CheckoutForm`, `MealPlan`, `SignupForm` |
| আপডেট করা | `updateDoc()` | Cancel বাটন |
| Auth শোনা | `onAuthStateChanged` | `App.jsx` |

**উদাহরণ:**
```jsx
// একবার fetch (OrderConfirmation.jsx)
const docSnap = await getDoc(doc(db, "orders", orderId));
if (docSnap.exists()) setOrder({ id: docSnap.id, ...docSnap.data() });

// রিয়েল-টাইম listen (MyOrders.jsx)
const q = query(collection(db, "orders"), where("userId", "==", user.uid));
onSnapshot(q, (snapshot) => {
  setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
});

// নতুন ডকুমেন্ট লেখা, নিজের ID ফেরত পাই (CheckoutForm.jsx)
const orderRef = await addDoc(collection(db, "orders"), { userId, items, totalAmount });
navigate(`/order-confirmation/${orderRef.id}`); // সেই ID দিয়েই পরের পেজে যাই

// আপডেট (Cancel)
await updateDoc(doc(db, "orders", orderId), { status: "Cancelled" });
```

---

## 15. Component Composition / ফোল্ডার স্ট্রাকচার

```jsx
// Checkout.jsx - নিজের কোনো লজিক নেই, শুধু দুটো component সাজানো
const Checkout = () => (
  <section>
    <CheckoutForm />   {/* ফর্ম + Firestore write */}
    <OrderSummary />   {/* শুধু cart state দেখায়, presentational */}
  </section>
);
```
- **`pages/`** - একটা route = একটা page component
- **`components/`** - ছোট, একাধিক পেজে reused (যেমন `MealCard` তিন জায়গায়: Meals, PopularMeals, RelatedMeals)
- **Layout প্যাটার্ন** - `RootLayout.jsx` একবার লিখে সব পেজে Header/Footer বসানো এড়ানো (দেখুন সেকশন ১২, `<Outlet/>`)

---

## সারসংক্ষেপ চেকলিস্ট

- [x] JSX
- [x] Function Components
- [x] Props (+ lifting state up)
- [x] Lists & Keys
- [x] Conditional Rendering
- [x] Event Handling
- [x] useState (primitive, object, boolean)
- [x] Controlled Forms
- [x] useEffect (cleanup সহ, একাধিক প্যাটার্নে)
- [x] useRef
- [ ] Context API (ব্যবহার করা হয়নি - Redux দিয়ে করা হয়েছে)
- [x] React Router (Routes, Link, NavLink, useParams, useNavigate, useLocation, Outlet, Protected Routes)
- [x] Redux Toolkit (store, slice, reducer, action, dispatch, selector)
- [x] Firebase Auth + Firestore (CRUD + real-time)
- [x] Component Composition

---

# অংশ ৫ - Interview Prep


This doc maps every React / React Router / Redux concept used in this project to the **actual code you wrote**, with plain-language explanations you can say out loud in an interview. Each section: what the concept is → where you used it → why it was needed there.

---

## 1. Components & Props

**What it is:** A component is a reusable function that returns UI. Props are how a parent component passes data DOWN into a child component - read-only, one-directional.

**Where you used it:**

`MealCard.jsx` receives a whole `meal` object as a prop from whoever renders it (`Meals.jsx`, `RelatedMeals.jsx`):
```jsx
const MealCard = ({ meal }) => {
  return <h3>{meal.name}</h3>;
};
```
`Meals.jsx` is the parent - it loops over the filtered list and passes one `meal` at a time:
```jsx
{filteredMeals.map((meal) => (
  <MealCard key={meal.id} meal={meal} />
))}
```

**Other real examples:** `CartItem` receives `item`, `OrderCard` receives `order`, `RelatedMeals` receives a `meals` array, `CategoryFilter` receives `category` + `setCategory` (a function passed down as a prop so the child can update the parent's state - this pattern is called **"lifting state up"**).

**Interview line:** *"Props flow one way, parent to child. When I need the child to change something in the parent, like the category filter, I pass the setter function itself down as a prop."*

---

## 2. useState

**What it is:** Lets a component remember a value across re-renders and re-render itself when that value changes. Returns `[currentValue, setterFunction]`.

**Where you used it (a few different flavors):**

**Simple text input state** - `SearchBar` via `Meals.jsx`:
```jsx
const [search, setSearch] = useState("");
```

**Object state (multiple fields at once)** - `CheckoutForm.jsx`, this is the fix you made when the shipping form wasn't saving data:
```jsx
const [formData, setFormData] = useState({
  fullName: user?.fullName || "",
  email: user?.email || "",
  phone: "",
  address: "",
  city: "",
  zip: "",
  paymentMethod: "Cash On Delivery",
});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};
```
Notice the `(prev) => ({...prev, [name]: value})` pattern - this is the **functional updater** form. You use the previous state to build the next one instead of referencing `formData` directly, which avoids stale-state bugs.

**Boolean toggle state** - `SignupForm.jsx` / `LoginForm.jsx` show/hide password:
```jsx
const [showPassword, setShowPassword] = useState(false);
...
<input type={showPassword ? "text" : "password"} ... />
```

**Interview line:** *"I use the functional updater form - `setFormData(prev => ...)` - whenever the new state depends on the old state, so I'm not reading a possibly-stale closure value."*

---

## 3. useEffect

**What it is:** Runs a side effect (something outside of rendering - API calls, subscriptions, timers, DOM stuff) *after* the component renders. The dependency array (`[...]`) controls when it re-runs: empty `[]` = only once on mount, `[x]` = whenever `x` changes, no array = every render (rare, usually a bug if unintentional).

**Where you used it:**

**Firebase auth listener, runs once for the whole app** - `App.jsx`:
```jsx
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      // look up their Firestore profile, dispatch(login(...))
    } else {
      dispatch(logout());
    }
  });
  return () => unsubscribe(); // cleanup - unsubscribes when App unmounts
}, [dispatch]);
```
This is the **cleanup function** pattern - the `return () => unsubscribe()` prevents a memory leak / duplicate listeners if the component ever unmounts.

**Real-time Firestore listener** - `MyOrders.jsx`, one for orders, one for meal plans:
```jsx
useEffect(() => {
  if (!user?.uid) return; // guard clause - don't run until we have a user

  const q = query(collection(db, "orders"), where("userId", "==", user.uid));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  });

  return () => unsubscribe();
}, [user]);
```

**Fixing a real bug with the dependency array** - `MealPlan.jsx`. Originally this effect could infinite-loop because both dependencies could become invalid at once:
```jsx
useEffect(() => {
  if (activeSlot === "lunch" && !wantsLunch && wantsDinner) {
    setActiveSlot("dinner");
  } else if (activeSlot === "dinner" && !wantsDinner && wantsLunch) {
    setActiveSlot("lunch");
  }
}, [wantsLunch, wantsDinner, activeSlot]);
```

**Third-party library setup** - `main.jsx`, initializing Lenis smooth scroll:
```jsx
useEffect(() => {
  const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  return () => lenis.destroy();
}, []);
```

**Interview line:** *"Any time I'm subscribing to something external - Firebase auth, a Firestore snapshot, a JS library - I set it up in useEffect and always return a cleanup function so it unsubscribes properly."*

---

## 4. useRef

**What it is:** Holds a mutable value that persists across renders **without** causing a re-render when it changes (unlike useState). Commonly used for: DOM element references, or a "flag" you need to remember without triggering a render.

**Where you used it:**

`MealPlan.jsx` - preventing the "auto-confirm after login redirect" feature from firing more than once:
```jsx
const autoConfirmedRef = useRef(false);

useEffect(() => {
  if (location.state?.autoConfirm && isLoggedIn && !autoConfirmedRef.current) {
    autoConfirmedRef.current = true; // mark as done, doesn't cause a re-render
    handleConfirmPlan();
  }
}, [isLoggedIn]);
```

**Interview line:** *"I needed a flag that survives re-renders but changing it shouldn't itself trigger a re-render - that's exactly what useRef is for, versus useState which always re-renders."*

---

## 5. useSelector & useDispatch (Redux)

**What they are:** `useSelector` **reads** a slice of the Redux store into a component. `useDispatch` gives you the `dispatch` function to **send an action** that changes the store.

**Where you used `useSelector`:**

`Header.jsx` - reading two different slices of state to show the cart badge and decide what to show in the nav:
```jsx
const { user, isLoggedIn } = useSelector((state) => state.auth);
const totalQuantity = useSelector((state) => state.cart.totalQuantity);
```

**Where you used `useDispatch`:**

`CartItem.jsx` - every quantity button dispatches an action:
```jsx
const dispatch = useDispatch();

<button onClick={() => dispatch(decreaseQuantity(item.id))}>−</button>
<button onClick={() => dispatch(increaseQuantity(item.id))}>+</button>
```

**Interview line:** *"useSelector subscribes the component to a piece of state - if that piece changes, only components reading it re-render, not the whole app. useDispatch is how components tell Redux 'something happened, update the state.'"*

---

## 6. Redux Toolkit: Store, Slice, Reducer, Action

This is the part most interviewers dig into, so here's the full chain using your actual `cartSlice.js`.

**Terminology, in order of the data flow:**

| Term | What it means | Example in your project |
|---|---|---|
| **Store** | The single object holding all your app's state | `redux/store/index.js` |
| **Slice** | One "chunk" of the store, plus the reducers/actions for it | `cartSlice`, `authSlice`, `mealPlanSlice`, `orderSlice` |
| **Reducer** | A function that takes `(state, action)` and returns new state | `addToCart: (state, action) => {...}` inside `cartSlice.js` |
| **Action** | An object describing *what happened*, e.g. `{ type: 'cart/addToCart', payload: meal }` - `createSlice` generates these for you automatically | `dispatch(addToCart(meal))` creates and sends this action |
| **Dispatch** | Sending an action to the store | `dispatch(addToCart(meal))` |

**The full round trip, step by step (using Add To Cart):**

```
1. User clicks "Add To Cart" in MealCard.jsx
2. dispatch(addToCart(meal)) is called
3. Redux Toolkit auto-creates an action: { type: "cart/addToCart", payload: meal }
4. The store runs cartSlice's addToCart reducer with the current state + this action
5. The reducer (using Immer under the hood, so you can "mutate" state directly)
   updates cartItems, totalQuantity, totalAmount
6. The store's cart slice now has new data
7. Every component using useSelector(state => state.cart...) re-renders
   automatically - e.g. Header's badge number updates
```

Your actual reducer for step 5:
```js
addToCart: (state, action) => {
  const newItem = action.payload;
  const quantity = newItem.quantity || 1;
  const existingItem = state.cartItems.find((item) => item.id === newItem.id);

  state.totalQuantity += quantity;
  state.totalAmount += newItem.price * quantity;

  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.totalPrice += newItem.price * quantity;
  } else {
    state.cartItems.push({ ...newItem, quantity, totalPrice: newItem.price * quantity });
  }
},
```

**Interview line:** *"Redux Toolkit's createSlice generates the action creators for me - I don't hand-write `{type: '...'}` objects. Under the hood it uses Immer, so inside a reducer I can write `state.totalQuantity += 1` and it looks like a mutation, but Immer actually produces a new immutable state object - that's why Redux's 'never mutate state directly' rule still holds even though the code doesn't look like it."*

**How the store combines all 4 slices** - `redux/store/index.js`:
```js
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    order: orderReducer,
    mealPlan: mealPlanReducer,
  },
});
```
This is *why* `useSelector(state => state.cart...)` works - `state.cart` maps directly to the key you gave `cartReducer` here.

---

## 7. React Router

**`<Routes>` / `<Route>`** - `App.jsx` defines every page's URL:
```jsx
<Routes>
  <Route element={<RootLayout />}>
    <Route index element={<Home />} />
    <Route path="meals" element={<Meals />} />
    <Route path="meals/:id" element={<MealDetails />} />
    ...
  </Route>
  <Route path="*" element={<NotFound />} />
</Routes>
```

**Nested routes + `<Outlet />`** - `RootLayout.jsx`. Every route nested inside `<Route element={<RootLayout />}>` automatically gets the Header/Footer wrapped around it, and renders in place of `<Outlet />`:
```jsx
const RootLayout = () => (
  <div>
    <Header />
    <main><Outlet /></main>
    <Footer />
  </div>
);
```

**`<Link>` vs `<NavLink>`** - both navigate without a full page reload, but `NavLink` knows whether it's the currently active route and lets you style it differently. `Header.jsx` uses `NavLink` for exactly that:
```jsx
<NavLink
  to="/meals"
  className={({ isActive }) => isActive ? "text-orange-500" : "text-gray-700"}
>
  Meals
</NavLink>
```
`Footer.jsx` uses plain `<Link>` instead, because footer links don't need "active page" highlighting.

**`useParams()`** - reads dynamic segments from the URL. `MealDetails.jsx`:
```jsx
const { id } = useParams(); // from route path="meals/:id"
const meal = meals.find((item) => item.id === Number(id));
```
Same pattern in `OrderConfirmation.jsx` (`:orderId`) and `MealPlanConfirmation.jsx` (`:planId`).

**`useNavigate()`** - navigate programmatically (not from a click on a `<Link>`), e.g. after a form submits successfully. `LoginForm.jsx`:
```jsx
const navigate = useNavigate();
...
navigate(redirectTo, { state: location.state });
```

**`useLocation()`** - the more advanced pattern in this project: reading state passed along during navigation, used for the "redirect back after login" feature:
```jsx
// MealPlan.jsx sends the user to login, remembering where they came from
navigate("/login", { state: { from: "/meal-plan", autoConfirm: true } });

// LoginForm.jsx reads it back
const location = useLocation();
const redirectTo = location.state?.from || "/";
```

**Interview line:** *"`useParams` reads the URL, `useNavigate` changes the URL from code instead of a click, and `useLocation` lets me pass extra data along with a navigation - I used that last one to build a 'come back to what I was doing after you log in' flow."*

---

## 8. Conditional Rendering & Rendering Lists

**Conditional rendering** - showing different UI based on a condition, several patterns you used:

```jsx
// Ternary - pick one of two things
{isLoggedIn ? <UserMenu /> : <LoginButton />}

// && short-circuit - show something or nothing
{errors.email && <p className="text-red-500">{errors.email}</p>}

// Early return - MealDetails.jsx bails out of the whole render early
if (!meal) {
  return <h1>Meal Not Found</h1>;
}
```

**Rendering lists with `.map()`** - always needs a unique `key` prop so React can track which item is which across re-renders:
```jsx
{cartItems.map((item) => (
  <CartItem key={item.id} item={item} />
))}
```

**Interview line:** *"The key prop isn't just to silence a console warning - React uses it to match up list items between renders, so if I don't use a stable unique key like the item's id, React can mis-track items and cause bugs when the list reorders."*

---

## 9. How Components Are Composed (Parent → Child Trees)

A few real trees from this project, useful for explaining "how is your app structured":

```
Home.jsx
 ├── HeroSection
 ├── Statistics
 ├── PopularMeals        (dispatches addToCart, reads data/meals.js)
 └── WhyChooseUs

RootLayout.jsx  (wraps every page)
 ├── Header              (useSelector: auth + cart state)
 ├── <Outlet />           ← whichever page matched the route renders here
 └── Footer

Checkout.jsx
 ├── CheckoutForm         (owns the shipping form state, writes to Firestore)
 └── OrderSummary         (reads cart state, purely presentational)

MyOrders.jsx
 ├── (meal plan cards, rendered inline)
 └── OrderCard × N         (one per order, receives `order` as a prop)
```

**Interview line:** *"Pages are compositions of smaller, focused components. `Checkout.jsx` itself has almost no logic - it just lays out `CheckoutForm` and `OrderSummary` side by side. That keeps each piece testable and reusable on its own."*

---

## 10. Quick Terminology Glossary

| Term | One-line definition |
|---|---|
| **Component** | A function that returns JSX (UI) |
| **Props** | Data passed from parent to child, read-only |
| **State** | Data a component owns and can change, triggers a re-render when updated |
| **Hook** | A function starting with `use` that lets you "hook into" React features (state, effects, context, etc.) from a function component |
| **JSX** | HTML-like syntax inside JS that compiles to `React.createElement` calls |
| **Controlled input** | An `<input>` whose value is driven by React state (`value={state}` + `onChange`), not the DOM |
| **Store** | The single object tree holding all Redux state |
| **Slice** | A named section of the store + its reducers/actions (via `createSlice`) |
| **Reducer** | `(state, action) => newState` - the only place state is allowed to change |
| **Action** | A plain object describing what happened, e.g. `{ type, payload }` |
| **Dispatch** | The function used to send an action to the store |
| **Selector** | A function that reads/derives a piece of state, e.g. what you pass into `useSelector` |
| **Middleware / Thunk** | Not used in this project - everything here is synchronous Redux state, async work (Firebase calls) happens in components before dispatching |
| **Protected route** | A route that checks auth state and redirects to `/login` if you're not logged in |
| **Real-time listener** | Firestore's `onSnapshot` - keeps data in sync live, vs `getDoc`/`getDocs` which fetch once |

---

## 11. Likely Interview Questions & How to Answer From This Project

**"Walk me through what happens when a user adds something to their cart."**
→ Click fires `handleAddToCart` → `dispatch(addToCart(meal))` → Redux Toolkit builds the action → `cartSlice`'s reducer updates `cartItems`/`totalQuantity`/`totalAmount` → every component subscribed via `useSelector` (Header's badge, Cart page) re-renders automatically → a toast confirms it.

**"Why Redux instead of just useState/props?"**
→ Cart and auth state are needed in many unrelated components (Header, Cart page, Checkout, MealCard) that aren't parent/child of each other. Passing it all through props would mean drilling it through many layers. Redux gives any component direct access via `useSelector` without that.

**"How do you protect routes that require login?"**
→ A `ProtectedRoute` wrapper component checks `useSelector(state => state.auth.isLoggedIn)`; if false, `<Navigate to="/login" replace />`. Routes like `/checkout`, `/profile`, `/my-orders` are wrapped in it in `App.jsx`.

**"Tell me about a bug you found and fixed."**
→ The Meal Plan feature had a `useEffect` that could infinite-loop: it tried to keep the "active tab" valid whenever Lunch/Dinner got deselected, but if *both* were off (the initial state), the effect kept flipping the active tab back and forth forever. Fixed by only switching if the *other* tab was actually still selected.

**"How does data get from Firestore into your UI?"**
→ Either a one-time fetch (`getDoc`, used in `OrderConfirmation`/`MealPlanConfirmation` to load one specific document by ID from the URL param), or a live subscription (`onSnapshot`, used in `MyOrders` so the order list updates in real time without a manual refresh, e.g. when you cancel an order).