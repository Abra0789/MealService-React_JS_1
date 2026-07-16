import { Outlet } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import AnimatedBackground from "../components/Background/AnimatedBackground";

const RootLayout = () => {
  return (
    <>
      <AnimatedBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />

        <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
          <Outlet />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default RootLayout;