// ============================
// React
// ============================

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

// ============================
// Firebase
// ============================

import {signInWithEmailAndPassword, signInWithPopup} from "firebase/auth";

import {doc,getDoc,setDoc} from "firebase/firestore";

import {auth,db,googleProvider} from "../firebase/firebase";

// ============================
// Redux
// ============================

import { login } from "../redux/slices/authSlice";

const LoginForm = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  // Where to send the user after a successful login.
  // If they were redirected here from a protected action
  // (e.g. saving a Meal Plan), go back there. Otherwise, Home.
  const redirectTo = location.state?.from || "/";

  // ============================
  // States
  // ============================

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // ============================
  // Email Login
  //============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      const firebaseUser =
        userCredential.user;

      const docRef = doc(
        db,
        "users",
        firebaseUser.uid
      );

      const docSnap =
        await getDoc(docRef);

      if (!docSnap.exists()) {
        toast.error("User data not found.");
        return;
      }

      const userData = docSnap.data();

      dispatch(
        login({
          uid: firebaseUser.uid,
          fullName: userData.fullName,
          username: userData.username,
          email: userData.email,
          photoURL: userData.photoURL,
        })
      );

      toast.success("Login Successful!");

      navigate(redirectTo, { state: location.state });
    } catch (error) {
      if (
        error.code ===
        "auth/invalid-credential"
      ) {
        toast.error("Invalid email or password.");
      } else if (
        error.code ===
        "auth/user-not-found"
      ) {
        toast.error("User not found.");
      } else if (
        error.code ===
        "auth/wrong-password"
      ) {
        toast.error("Wrong password.");
      } else {
        toast.error("An error occurred."  );
      }
    } finally {
      setLoading(false);
    }
  };

    // ============================
  // Google Login
  // ============================

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const result = await signInWithPopup(
        auth,
        googleProvider
      );

      const user = result.user;

      const userRef = doc(
        db,
        "users",
        user.uid
      );

      const userSnap = await getDoc(userRef);

      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          fullName: user.displayName,
          username: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date(),
        });
      }

      // Firestore user data retrieval after Google login 
      const updatedUserSnap =
        await getDoc(userRef);

      const userData =
        updatedUserSnap.data();

      // Redux Update
      dispatch(
        login({
          uid: user.uid,
          fullName: userData.fullName,
          username: userData.username,
          email: userData.email,
          photoURL: userData.photoURL,
        })
      );

      toast.success("Google Login Successful!");

      navigate(redirectTo, { state: location.state });
    } catch (error) {
      console.error("Google login error:", error.code, error.message);

      if (error.code === "auth/popup-closed-by-user") {
        // User closed the popup themselves — no need for an error toast
      } else if (error.code === "auth/popup-blocked") {
        toast.error("Popup was blocked by your browser. Please allow popups and try again.");
      } else if (error.code === "auth/unauthorized-domain") {
        toast.error("This domain isn't authorized for Google Sign-In in Firebase.");
      } else {
        toast.error("Google Login Failed");
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // UI
  // ============================

  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl">

      <h2 className="mb-8 text-center text-4xl font-bold">
        Login
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full rounded-xl border p-4 outline-none focus:border-orange-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full rounded-xl border p-4 outline-none focus:border-orange-500"
        />

        <div className="flex justify-end">

          <Link
            to="/forgot-password"
            className="text-sm font-medium text-orange-500 hover:underline"
          >
            Forgot Password?
          </Link>

        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-orange-500 py-4 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>

        <div className="flex items-center">

          <div className="h-px flex-1 bg-gray-300"></div>

          <span className="mx-4 text-sm text-gray-500">
            OR
          </span>

          <div className="h-px flex-1 bg-gray-300"></div>

        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 py-4 font-semibold transition hover:bg-gray-100"
        >

          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="h-6 w-6"
          />

          Continue with Google

        </button>

              </form>

      <p className="mt-8 text-center text-gray-600">

        Don't have an account?

        <Link
          to="/signup"
          state={location.state}
          className="ml-2 font-semibold text-orange-500 hover:underline"
        >
          Signup
        </Link>

      </p>

    </div>
  );
};

export default LoginForm;