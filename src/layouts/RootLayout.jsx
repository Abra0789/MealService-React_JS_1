import { Outlet } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import AnimatedBackground from "../components/Background/AnimatedBackground";


const RootLayout = () => {

  return (

    <div className="relative min-h-screen">


      {/* Animated WebGL Background */}

      <AnimatedBackground />



      {/* Website Content */}

      <div className="relative z-10 flex min-h-screen flex-col">


        <Header />



        <main className="relative flex-1 mx-auto w-full max-w-7xl px-6 py-8">

          <Outlet />

        </main>



        <Footer />


      </div>


    </div>

  );

};


export default RootLayout;