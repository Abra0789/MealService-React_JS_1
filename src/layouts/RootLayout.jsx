import React from "react";
import { Outlet } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";

const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">

        <Outlet />

      </main>

      <Footer />

    </div>
  );
};

export default RootLayout;