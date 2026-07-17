import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";


import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "./firebase/firebase";

import {
  login,
  logout,
  setLoading,
} from "./redux/slices/authSlice";

import { ToastContainer } from "react-toastify";

// Layout
import RootLayout from "./layouts/RootLayout";

// Protected Route
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Meals from "./pages/Meals";
import MealDetails from "./pages/MealDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import MealPlan from "./pages/MealPlan";
import NotFound from "./pages/NotFound";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        if (currentUser) {
          try {
            const docRef = doc(
              db,
              "users",
              currentUser.uid
            );

            const docSnap =
              await getDoc(docRef);

            if (docSnap.exists()) {
  dispatch(
    login({
      uid: currentUser.uid,
      ...docSnap.data(),
    })
  );
} else {
  dispatch(logout());
}
          } catch (error) {
            console.log(error);

            dispatch(logout());
          }
        } else {
          dispatch(logout());
        }

        dispatch(setLoading(false));
      }
    );

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route element={<RootLayout />}>
      
          <Route
            index
            element={<Home />}
          />

          <Route
            path="meals"
            element={<Meals />}
          />

          <Route
            path="meals/:id"
            element={<MealDetails />}
          />

          <Route
            path="cart"
            element={<Cart />}
          />

          <Route
            path="meal-plan"
            element={<MealPlan />}
          />

          <Route
            path="checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="my-orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="login"
            element={<Login />}
          />

          <Route
            path="signup"
            element={<Signup />}
          />

          <Route
            path="forgot-password"
            element={<ForgotPassword />}
          />
        </Route>

        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>

      <ToastContainer
          position="top-right"
  autoClose={2500}
  newestOnTop
  closeOnClick
  pauseOnHover
  draggable
  theme="dark"
  stacked
  limit={3}
  toastStyle={{
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "18px",
    color: "#fff",
    boxShadow: "0 10px 40px rgba(0,0,0,.25)",
          
        }}
      />
    </>
  );
}

export default App;