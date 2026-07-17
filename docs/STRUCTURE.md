# Project Structure — MealService

A React + Redux + Firebase food ordering web app, built with Vite and Tailwind CSS.

## Tech Stack
- **Frontend:** React 19, React Router v7
- **State:** Redux Toolkit (cart, auth, order slices)
- **Backend:** Firebase (Authentication + Firestore)
- **Styling:** Tailwind CSS v4
- **Extras:** Framer Motion, Lenis (smooth scroll), React Toastify, Three.js/R3F

## Folder Structure

```
project/
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   └── images/              # Local meal images (jfif/jpg)
│
├── src/
│   ├── App.jsx               # Routes definition + Firebase auth listener
│   ├── main.jsx               # App entry, Redux Provider, Router, Lenis smooth scroll
│   ├── App.css / index.css    # Global styles, Tailwind imports, Toastify theme
│   │
│   ├── assets/                 # Static images (hero, logos)
│   │
│   ├── components/
│   │   ├── Header.jsx           # Navbar, user dropdown, cart badge, mobile menu
│   │   ├── Footer.jsx           # Site footer, contact info, map embed
│   │   ├── HeroSection.jsx      # Home page hero banner
│   │   ├── Statistics.jsx       # Home page stats cards
│   │   ├── PopularMeals.jsx     # Home page featured meals (⚠️ uses local hardcoded data)
│   │   ├── WhyChooseUs.jsx      # Home page feature highlights
│   │   ├── MealCard.jsx         # Meal grid card (Meals page)
│   │   ├── SearchBar.jsx        # Meals page search input
│   │   ├── CategoryFilter.jsx   # Meals page category filter buttons
│   │   ├── RelatedMeals.jsx     # Related meals section (MealDetails page)
│   │   ├── CartItem.jsx         # Single cart row with qty controls
│   │   ├── OrderSummary.jsx     # Price breakdown (Cart/Checkout pages)
│   │   ├── CheckoutForm.jsx     # Checkout form
│   │   ├── OrderCard.jsx        # Order card w/ cancel button (MyOrders page)
│   │   ├── LoginForm.jsx        # Email + Google login
│   │   ├── SignupForm.jsx       # Registration form
│   │   ├── ForgotPasswordForm.jsx # Password reset via email
│   │   └── ProtectedRoute.jsx   # Redirects to /login if not authenticated
│   │
│   ├── data/
│   │   └── meals.js             # Master meals dataset (Bangla + international dishes)
│   │
│   ├── firebase/
│   │   └── firebase.js          # Firebase init (Auth, Firestore, Google provider)
│   │
│   ├── layouts/
│   │   └── RootLayout.jsx       # Header + Outlet + Footer wrapper
│   │
│   ├── pages/
│   │   ├── Home.jsx             # Hero + Stats + Popular Meals + Why Choose Us
│   │   ├── Meals.jsx            # Full meal list with search/filter
│   │   ├── MealDetails.jsx      # Single meal detail + related meals
│   │   ├── Cart.jsx             # Cart items + order summary
│   │   ├── Checkout.jsx         # Checkout form + order summary
│   │   ├── Login.jsx / Signup.jsx / ForgotPassword.jsx
│   │   ├── Profile.jsx          # Logged-in user info
│   │   ├── MyOrders.jsx         # Real-time Firestore order list (onSnapshot)
│   │   └── NotFound.jsx         # 404 page
│   │
│   └── redux/
│       ├── slices/
│       │   ├── authSlice.js     # login / logout / setLoading
│       │   ├── cartSlice.js     # add / increase / decrease / remove / clear
│       │   └── orderSlice.js    # addOrder / clearOrders
│       └── store/
│           └── index.js         # configureStore combining all slices
│
├── package.json
└── vite.config.js
```