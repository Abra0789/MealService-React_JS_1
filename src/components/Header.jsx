import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";

import { FaUserCircle } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";

import { logout } from "../redux/slices/authSlice";

import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const totalQuantity = useSelector(
    (state) => state.cart.totalQuantity
  );

  const { user, isLoggedIn } = useSelector(
    (state) => state.auth
  );

const handleLogout = async () => {
  try {
    await signOut(auth);

    dispatch(logout());

    alert("Logout Successful");

    navigate("/");

  } catch (error) {
    alert(error.message);
  }
};

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}

        <NavLink
          to="/"
          className="text-3xl font-bold text-orange-500"
        >
          MealService
        </NavLink>

        {/* Menu */}

        <nav className="flex items-center gap-8">

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "font-bold text-orange-500"
                : "text-gray-700 hover:text-orange-500"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/meals"
            className={({ isActive }) =>
              isActive
                ? "font-bold text-orange-500"
                : "text-gray-700 hover:text-orange-500"
            }
          >
            Meals
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive
                ? "font-bold text-orange-500"
                : "text-gray-700 hover:text-orange-500"
            }
          >
            Cart

            <span className="ml-2 rounded-full bg-orange-500 px-2 py-1 text-xs text-white">
              {totalQuantity}
            </span>

          </NavLink>

        </nav>

        {/* Right Side */}

        {!isLoggedIn ? (
          <div className="flex items-center gap-4">

            <NavLink
              to="/login"
              className="font-medium text-gray-700 hover:text-orange-500"
            >
              Login
            </NavLink>

            <NavLink
              to="/signup"
              className="rounded-lg bg-orange-500 px-5 py-2 text-white transition hover:bg-orange-600"
            >
              Signup
            </NavLink>

          </div>
        ) : (

          <div className="relative">

            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-100"
            >
              <FaUserCircle
                size={24}
                className="text-orange-500"
              />

              <span className="font-semibold">
                {user?.username}
              </span>

              <IoChevronDown />
            </button>

            {open && (

              <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-xl border bg-white shadow-xl">

                <div className="border-b px-4 py-3">

                  <p className="font-semibold">
                    {user?.fullName}
                  </p>

                  <p className="text-sm text-gray-500">
                    {user?.email}
                  </p>

                </div>

                <NavLink
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 hover:bg-orange-50"
                >
                  My Profile
                </NavLink>

                <NavLink
                  to="/orders"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 hover:bg-orange-50"
                >
                  My Orders
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left text-red-500 hover:bg-red-50"
                >
                  Logout
                </button>

              </div>

            )}

          </div>

        )}

      </div>
    </header>
  );
};

export default Header;