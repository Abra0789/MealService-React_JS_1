# React Skills Map

React সাধারণত যে অর্ডারে শেখানো হয়, ঠিক সেই অর্ডারে — প্রতিটা concept-এর পাশে এই প্রজেক্টে ঠিক কোথায় ব্যবহার করা হয়েছে, আর ছোট কোড দিয়ে কীভাবে কাজ করে সেটাও।

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
- **ব্যবহার:** `MealCard`, `Header`, `Footer`, `CartItem` — প্রতিটা component-ই এরকম

## 3. Props (Parent → Child ডেটা পাঠানো)
Parent একটা value বানায়, child সেটা প্যারামিটার হিসেবে পায় — child নিজে থেকে এটা বদলাতে পারে না।

`Meals.jsx` (parent) — লুপ করে প্রতিটা meal পাঠায়:
```jsx
{filteredMeals.map((meal) => (
  <MealCard key={meal.id} meal={meal} />
))}
```
`MealCard.jsx` (child) — সেটা রিসিভ করে:
```jsx
const MealCard = ({ meal }) => {
  return <h3>{meal.name}</h3>; // meal.price, meal.image ইত্যাদিও এভাবে পায়
};
```

**Lifting state up** — child থেকে parent-এর state বদলাতে হলে parent নিজের setter ফাংশনটাই prop হিসেবে পাঠায়:
```jsx
// Meals.jsx (parent)
<CategoryFilter category={category} setCategory={setCategory} />

// CategoryFilter.jsx (child) — parent-এর state বদলে দিচ্ছে prop দিয়ে পাওয়া ফাংশন কল করে
<button onClick={() => setCategory("Rice")}>Rice</button>
```
- **আরও ব্যবহার:** `Cart.jsx` → `CartItem`-এ `item`, `MyOrders.jsx` → `OrderCard`-এ `order`

## 4. Rendering Lists (`.map()` + `key`)
Array-কে UI-তে রূপান্তর করতে `.map()`, আর React-কে বলে দিতে কোনটা কোনটা (re-render-এ ঠিকভাবে ট্র্যাক করতে) `key` লাগে — `id`-র মতো unique কিছু, index না।
```jsx
{cartItems.map((item) => (
  <CartItem key={item.id} item={item} />
))}
```
- **ব্যবহার:** `Meals.jsx`, `Cart.jsx`, `MyOrders.jsx`, `Footer.jsx` (Quick Links), `PopularMeals.jsx`

## 5. Conditional Rendering
```jsx
// Ternary — দুটোর একটা দেখাও
{isLoggedIn ? <UserMenu /> : <LoginButton />}

// && — শর্ত সত্যি হলেই দেখাও, নাহলে কিছুই না
{errors.email && <p className="text-red-500">{errors.email}</p>}

// Early return — MealDetails.jsx পুরো component-ই আগেভাগে থামিয়ে দেয়
if (!meal) {
  return <h1>Meal Not Found 😢</h1>;
}
```

## 6. Handling Events
Event handler ফাংশন যা `onClick`/`onChange`/`onSubmit`-এ পাস করা হয়।
```jsx
// ক্লিক — সরাসরি অ্যাকশন ডিসপ্যাচ
<button onClick={() => dispatch(increaseQuantity(item.id))}>+</button>

// Input চেঞ্জ — event object থেকে value বের করে state আপডেট
<input onChange={(e) => setSearch(e.target.value)} />

// ফর্ম সাবমিট — e.preventDefault() না দিলে পেজ রিলোড হয়ে যাবে
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

// Object state — একসাথে অনেকগুলো field ট্র্যাক করতে (CheckoutForm.jsx)
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
**কেন `(prev) => ({...prev, ...})` লিখি:** নতুন state পুরনো state-এর উপর নির্ভর করলে সরাসরি `formData` ভ্যারিয়েবল না পড়ে `prev` ব্যবহার করি — stale state bug এড়াতে।

## 8. Controlled Forms
Input-এর ভ্যালু DOM না, React state ঠিক করে — `value` state থেকে আসে, `onChange` সেই state আপডেট করে।
```jsx
<input
  type="email"
  value={formData.email}      // state থেকে ভ্যালু দেখাচ্ছে
  onChange={handleChange}     // টাইপ করলেই state আপডেট হয়, তাই re-render হয়ে নতুন ভ্যালু দেখায়
/>
```
এই প্যাটার্ন ছাড়া (`value` না দিলে) — আগে `CheckoutForm.jsx`-এ এটাই bug ছিল: ইনপুট ফিল্ডে `value`/`onChange` কিছুই ছিল না, তাই ইউজার যা টাইপ করত সেটা কোথাও সেভ হতোই না।

## 9. `useEffect`
Render শেষ হওয়ার পর side effect চালায়। Dependency array (`[...]`) ঠিক করে কখন আবার চলবে।

```jsx
// একবারই চলে (mount-এ) — main.jsx, Lenis সেটআপ
useEffect(() => {
  const lenis = new Lenis({ duration: 1.2 });
  return () => lenis.destroy(); // cleanup — component সরে গেলে destroy হয়
}, []);

// একটা ভ্যালুর উপর নির্ভরশীল — OrderConfirmation.jsx
useEffect(() => {
  const fetchOrder = async () => {
    const docSnap = await getDoc(doc(db, "orders", orderId));
    setOrder(docSnap.data());
  };
  fetchOrder();
}, [orderId]); // orderId বদলালে আবার fetch করবে

// Subscription + cleanup — App.jsx, Firebase auth listener
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    dispatch(currentUser ? login(...) : logout());
  });
  return () => unsubscribe(); // listener বন্ধ করে memory leak এড়ায়
}, [dispatch]);
```
**গুরুত্বপূর্ণ:** `MyOrders.jsx`-এ `onSnapshot` ব্যবহার করেছি (`getDoc` না) কারণ এটা **real-time** — অন্য কেউ/অন্য ট্যাব থেকে ডেটা বদলালে অটোমেটিক আপডেট হয়, ম্যানুয়াল রিফ্রেশ লাগে না।

## 10. `useRef`
Re-render না ঘটিয়ে একটা ভ্যালু মনে রাখে — `useState`-এর উল্টো, ভ্যালু বদলালে component re-render হয় না।
```jsx
// MealPlan.jsx — auto-save যেন শুধু একবারই ট্রিগার হয়
const autoConfirmedRef = useRef(false);

useEffect(() => {
  if (location.state?.autoConfirm && isLoggedIn && !autoConfirmedRef.current) {
    autoConfirmedRef.current = true; // এটা বদলালেও re-render হবে না
    handleConfirmPlan();
  }
}, [isLoggedIn]);
```
`useState` দিয়ে এটা করলে flag বদলানোর সাথে সাথেই একটা অতিরিক্ত re-render হতো — এখানে সেটার দরকার নেই, শুধু মনে রাখাটাই দরকার।

## 11. Context API
- **ব্যবহার হয়নি** — এর বদলে পুরো প্রজেক্টে **Redux Toolkit** ব্যবহার করা হয়েছে global state-এর জন্য

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
// App.jsx — রুট ডিফাইনেশন, nested route সব RootLayout-এর ভেতরে
<Route element={<RootLayout />}>
  <Route path="meals" element={<Meals />} />
  <Route path="meals/:id" element={<MealDetails />} />
</Route>

// MealDetails.jsx — URL-এর :id অংশটা ধরা
const { id } = useParams();
const meal = meals.find((item) => item.id === Number(id));

// NavLink — বর্তমান পেজ হলে আলাদা স্টাইল (isActive এটা নিজেই বলে দেয়)
<NavLink to="/meals" className={({ isActive }) => isActive ? "text-orange-500" : "text-gray-700"}>
  Meals
</NavLink>

// ProtectedRoute.jsx — লগইন না থাকলে পাঠিয়ে দেয়
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
};
```

**Redirect-back প্যাটার্ন (useLocation + useNavigate একসাথে):**
```jsx
// MealPlan.jsx — লগইন পেজে পাঠানোর সময় "কোথা থেকে এলাম" সাথে পাঠাই
navigate("/login", { state: { from: "/meal-plan", autoConfirm: true } });

// LoginForm.jsx — সেই state ফিরে পড়ি, সফল হলে সেখানেই ফেরত পাঠাই
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
// 1. store/index.js — সব slice যোগ করা, "cart" নামটাই key
export const store = configureStore({
  reducer: { cart: cartReducer, auth: authReducer, ... },
});

// 2. MealCard.jsx — ক্লিক করলে action dispatch হয়
const dispatch = useDispatch();
dispatch(addToCart(meal));

// 3. cartSlice.js — reducer state আপডেট করে
addToCart: (state, action) => {
  const newItem = action.payload; // এখানে পুরো meal অবজেক্টটা পাই
  state.totalQuantity += 1;        // Immer-এর জন্য direct "mutation"-এর মতো লেখা যায়
  state.cartItems.push({ ...newItem, quantity: 1 });
},

// 4. Header.jsx — যে কেউ এই state পড়ছে সে অটো re-render হয়
const totalQuantity = useSelector((state) => state.cart.totalQuantity);
```
`MealCard` আর `Header` একে অপরের parent-child না, তাও ডেটা শেয়ার হচ্ছে — এটাই Redux-এর মূল সুবিধা, props দিয়ে অনেক লেয়ার ঘুরিয়ে আনতে হচ্ছে না।

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
// Checkout.jsx — নিজের কোনো লজিক নেই, শুধু দুটো component সাজানো
const Checkout = () => (
  <section>
    <CheckoutForm />   {/* ফর্ম + Firestore write */}
    <OrderSummary />   {/* শুধু cart state দেখায়, presentational */}
  </section>
);
```
- **`pages/`** — একটা route = একটা page component
- **`components/`** — ছোট, একাধিক পেজে reused (যেমন `MealCard` তিন জায়গায়: Meals, PopularMeals, RelatedMeals)
- **Layout প্যাটার্ন** — `RootLayout.jsx` একবার লিখে সব পেজে Header/Footer বসানো এড়ানো (দেখুন সেকশন ১২, `<Outlet/>`)

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
- [ ] Context API (ব্যবহার করা হয়নি — Redux দিয়ে করা হয়েছে)
- [x] React Router (Routes, Link, NavLink, useParams, useNavigate, useLocation, Outlet, Protected Routes)
- [x] Redux Toolkit (store, slice, reducer, action, dispatch, selector)
- [x] Firebase Auth + Firestore (CRUD + real-time)
- [x] Component Composition