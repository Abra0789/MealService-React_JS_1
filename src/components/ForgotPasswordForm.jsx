import { useState } from "react";
import { Link } from "react-router-dom";

import { sendPasswordResetEmail } from "firebase/auth";

import { auth } from "../firebase/firebase";

const ForgotPasswordForm = () => {
  // ============================
  // States
  // ============================

  const [email, setEmail] = useState("");

  const [loading, setLoading] =
    useState(false);

  // ============================
  // Reset Password
  // ============================

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      await sendPasswordResetEmail(
        auth,
        email
      );

      alert(
        "Password reset email sent successfully. Please check your inbox."
      );

      setEmail("");
    } catch (error) {
      if (
        error.code ===
        "auth/user-not-found"
      ) {
        alert("No account found with this email.");
      } else if (
        error.code ===
        "auth/invalid-email"
      ) {
        alert("Invalid email address.");
      } else {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">

      <h2 className="mb-3 text-center text-4xl font-bold">
        Forgot Password
      </h2>

      <p className="mb-8 text-center text-gray-500">
        Enter your email to receive a password reset link.
      </p>

      <form
        onSubmit={handleResetPassword}
        className="space-y-6"
      >

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full rounded-xl border p-4 outline-none transition focus:border-orange-500"
        />
                <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-orange-500 py-4 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Sending..."
            : "Send Reset Link"}
        </button>

      </form>

      <p className="mt-8 text-center text-gray-600">

        Remember your password?

        <Link
          to="/login"
          className="ml-2 font-semibold text-orange-500 hover:underline"
        >
          Back to Login
        </Link>

      </p>

    </div>
  );
};

export default ForgotPasswordForm;