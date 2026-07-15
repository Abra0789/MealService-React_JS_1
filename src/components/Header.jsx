import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { motion, AnimatePresence } from "framer-motion";

import {
  FaUserCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import { IoChevronDown } from "react-icons/io5";

import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

import { logout } from "../redux/slices/authSlice";

import { toast } from "react-toastify";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const { user, isLoggedIn } = useSelector(
    (state) => state.auth
  );

  const totalQuantity = useSelector(
    (state) => state.cart.totalQuantity
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);

      dispatch(logout());

      setOpen(false);

      toast.success("Logout Successful!");

      navigate("/");
    } catch (error) {
      toast.error("Error occurred while logging out.");
    }
  };

    return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-2xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">

        {/* Logo */}

        <NavLink
          to="/"
          className="text-3xl font-black tracking-tight text-orange-500 transition-all duration-300 hover:scale-105 hover:text-orange-600"
        >
          MealService
        </NavLink>

        {/* Desktop Menu */}

        <nav className="hidden items-center gap-10 md:flex">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `relative font-medium transition-all duration-300 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-orange-500 after:transition-all after:duration-300 hover:text-orange-500 hover:after:w-full ${
                isActive
                  ? "text-orange-500 after:w-full"
                  : "text-gray-700"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/meals"
            className={({ isActive }) =>
              `relative font-medium transition-all duration-300 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-orange-500 after:transition-all after:duration-300 hover:text-orange-500 hover:after:w-full ${
                isActive
                  ? "text-orange-500 after:w-full"
                  : "text-gray-700"
              }`
            }
          >
            Meals
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `relative flex items-center font-medium transition-all duration-300 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-orange-500 after:transition-all after:duration-300 hover:text-orange-500 hover:after:w-full ${
                isActive
                  ? "text-orange-500 after:w-full"
                  : "text-gray-700"
              }`
            }
          >
            Cart

            <span className="ml-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-orange-500 px-2 text-xs font-semibold text-white shadow-lg shadow-orange-500/30">
              {totalQuantity}
            </span>

          </NavLink>

        </nav>
                {/* Right Side */}

        <div className="flex items-center gap-4">

          {!isLoggedIn ? (
            <div className="hidden items-center gap-4 md:flex">

              <NavLink
                to="/login"
                className="font-medium text-gray-700 transition-all duration-300 hover:text-orange-500"
              >
                Login
              </NavLink>

              <NavLink
                to="/signup"
                className="rounded-full bg-orange-500 px-6 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-500/30"
              >
                Signup
              </NavLink>

            </div>
          ) : (
            <div className="relative hidden md:block">

              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-3 rounded-full border border-white/30 bg-white/70 px-5 py-3 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/10"
              >
                <FaUserCircle
                  size={24}
                  className="text-orange-500"
                />

                <span className="font-semibold text-gray-700">
                  {user?.username}
                </span>

                <IoChevronDown
                  className={`transition-transform duration-300 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>
                            <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -15,
                      scale: 0.95,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: -15,
                      scale: 0.95,
                    }}
                    transition={{
                      duration: 0.25,
                    }}
                    className="absolute right-0 mt-4 w-64 overflow-hidden rounded-2xl border border-white/20 bg-white/80 backdrop-blur-2xl shadow-2xl shadow-black/10"
                  >
                    <div className="border-b border-gray-200 px-5 py-4">
                      <p className="font-semibold text-gray-800">
                        {user?.fullName}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {user?.email}
                      </p>
                    </div>

                    <NavLink
                      to="/profile"
                      onClick={() => {
                        setOpen(false);
                      }}
                      className="block px-5 py-3 font-medium text-gray-700 transition-all duration-300 hover:bg-orange-50 hover:pl-7 hover:text-orange-500"
                    >
                      My Profile
                    </NavLink>

                    <NavLink
                      to="/my-orders"
                      onClick={() => {
                        setOpen(false);
                      }}
                      className="block px-5 py-3 font-medium text-gray-700 transition-all duration-300 hover:bg-orange-50 hover:pl-7 hover:text-orange-500"
                    >
                      My Orders
                    </NavLink>

                    <button
                      onClick={handleLogout}
                      className="block w-full px-5 py-3 text-left font-medium text-red-500 transition-all duration-300 hover:bg-red-50 hover:pl-7 hover:text-red-600"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          )}

          {/* Mobile Menu Button */}

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="rounded-xl p-2 transition hover:bg-gray-100 md:hidden"
          >
            {mobileMenu ? (
              <FaTimes size={22} />
            ) : (
              <FaBars size={22} />
            )}
          </button>

        </div>
      </div>
            <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/20 bg-white/90 backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col px-6 py-6">

              <NavLink
                to="/"
                onClick={() => setMobileMenu(false)}
                className="rounded-xl px-4 py-3 font-medium text-gray-700 transition-all duration-300 hover:bg-orange-50 hover:text-orange-500"
              >
                Home
              </NavLink>

              <NavLink
                to="/meals"
                onClick={() => setMobileMenu(false)}
                className="mt-2 rounded-xl px-4 py-3 font-medium text-gray-700 transition-all duration-300 hover:bg-orange-50 hover:text-orange-500"
              >
                Meals
              </NavLink>

              <NavLink
                to="/cart"
                onClick={() => setMobileMenu(false)}
                className="mt-2 flex items-center justify-between rounded-xl px-4 py-3 font-medium text-gray-700 transition-all duration-300 hover:bg-orange-50 hover:text-orange-500"
              >
                <span>Cart</span>

                <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
                  {totalQuantity}
                </span>
              </NavLink>

              {!isLoggedIn ? (
                <>
                  <NavLink
                    to="/login"
                    onClick={() => setMobileMenu(false)}
                    className="mt-2 rounded-xl px-4 py-3 font-medium text-gray-700 transition-all duration-300 hover:bg-orange-50 hover:text-orange-500"
                  >
                    Login
                  </NavLink>

                  <NavLink
                    to="/signup"
                    onClick={() => setMobileMenu(false)}
                    className="mt-3 rounded-xl bg-orange-500 px-4 py-3 text-center font-semibold text-white transition-all duration-300 hover:bg-orange-600"
                  >
                    Signup
                  </NavLink>
                </>
              ) : (
                <>
                  <div className="mt-4 border-t border-gray-200 pt-4">

                    <p className="font-semibold text-gray-800">
                      {user?.fullName}
                    </p>

                    <p className="mb-4 text-sm text-gray-500">
                      {user?.email}
                    </p>

                    <NavLink
                      to="/profile"
                      onClick={() => setMobileMenu(false)}
                      className="block rounded-xl px-4 py-3 font-medium text-gray-700 transition-all duration-300 hover:bg-orange-50 hover:text-orange-500"
                    >
                      My Profile
                    </NavLink>

                    <NavLink
                      to="/my-orders"
                      onClick={() => setMobileMenu(false)}
                      className="mt-2 block rounded-xl px-4 py-3 font-medium text-gray-700 transition-all duration-300 hover:bg-orange-50 hover:text-orange-500"
                    >
                      My Orders
                    </NavLink>

                    <button
                      onClick={handleLogout}
                      className="mt-2 w-full rounded-xl px-4 py-3 text-left font-medium text-red-500 transition-all duration-300 hover:bg-red-50"
                    >
                      Logout
                    </button>

                  </div>
                </>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
          </header>
  );
};

export default Header;