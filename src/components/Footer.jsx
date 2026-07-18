import React from "react";

import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaArrowRight,
} from "react-icons/fa";

import { Link } from "react-router-dom";


const Footer = () => {

  const quickLinks = [
    ["Home", "/"],
    ["Meals", "/meals"],
    ["Meal Plan", "/meal-plan"],
    ["Cart", "/cart"],
    ["My Profile", "/profile"],
    ["My Orders", "/my-orders"],
  ];

  return (

    <footer className="
      relative
      mt-20
      overflow-hidden
      bg-linear-to-br
      from-[#09090B]
      via-[#111827]
      to-[#020617]
      text-white
    ">


      {/* Glow Line */}

      <div className="
        absolute
        top-0
        left-1/2
        -translate-x-1/2
        w-[60%]
        h-0.5
        bg-orange-500
        shadow-[0_0_30px_#f97316]
      " />


      {/* Subtle grain texture — signature detail, kept quiet on purpose */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />


      <div className="relative">


        {/* CTA Strip */}

        <div className="border-b border-white/10 bg-white/3">

          <div className="
            max-w-7xl
            mx-auto
            px-6
            py-8
            flex
            flex-col
            sm:flex-row
            items-center
            justify-between
            gap-5
            text-center
            sm:text-left
          ">

            <div>
              <p className="text-2xl font-bold">
                Craving something delicious?
              </p>
              <p className="mt-1 text-gray-400">
                Fresh meals, delivered to your door in minutes.
              </p>
            </div>

            <Link
              to="/meals"
              className="
                group
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-orange-500
                px-7
                py-3.5
                font-semibold
                text-white
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-orange-600
                hover:shadow-xl
                hover:shadow-orange-500/30
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-orange-400
                focus-visible:ring-offset-2
                focus-visible:ring-offset-[#09090B]
              "
            >
              Order Now
              <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

          </div>

        </div>


        <div className="
          max-w-7xl
          mx-auto
          px-6
          py-16
        ">


          <div className="
            grid
            sm:grid-cols-2
            lg:grid-cols-4
            gap-10
          ">




            {/* Brand */}

            <div className="
              bg-white/5
              backdrop-blur-xl
              border
              border-white/10
              rounded-2xl
              p-6
            ">


              <h2 className="
                text-3xl
                font-black
                tracking-tight
                mb-4
              ">


                <span className="text-orange-400">
                  Meal
                </span>

                Service


              </h2>



              <p className="
                text-gray-400
                leading-relaxed
              ">

                Fresh, healthy and delicious meals
                delivered to your doorstep with
                fast and reliable service.

              </p>




              <div className="
                flex
                gap-3
                mt-6
              ">


                {
                  [
                    FaFacebookF,
                    FaInstagram,
                    FaTwitter
                  ].map((Icon,index)=>(

                    <div

                      key={index}

                      className="
                        w-10
                        h-10
                        flex
                        items-center
                        justify-center
                        rounded-full
                        bg-white/10
                        border
                        border-white/10
                        hover:bg-orange-500
                        hover:border-orange-500
                        hover:scale-110
                        transition-all
                        duration-300
                        cursor-pointer
                      "

                    >

                      <Icon className="text-sm" />

                    </div>

                  ))
                }


              </div>


            </div>






            {/* Contact */}

            <div>


              <h3 className="
                text-xl
                font-semibold
                mb-6
                text-orange-400
              ">

                Contact Us

              </h3>




              <div className="
                space-y-5
                text-gray-300
              ">



                <p className="
                  flex
                  items-center
                  gap-3
                ">

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5">
                    <FaPhoneAlt className="text-orange-400 text-sm" />
                  </span>

                  +880 1XXX-XXXXXX

                </p>





                <p className="
                  flex
                  items-center
                  gap-3
                ">

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5">
                    <FaEnvelope className="text-orange-400 text-sm" />
                  </span>

                  support@mealservice.com

                </p>





                <p className="
                  flex
                  gap-3
                ">

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5">
                    <FaMapMarkerAlt className="text-orange-400 text-sm" />
                  </span>

                  <span>
                    Khilgaon Taltola Market,
                    <br />
                    Dhaka, Bangladesh
                  </span>

                </p>




                <p className="
                  text-sm
                  text-gray-500
                  pl-12
                ">

                  Opening Hours:
                  <br/>
                  10:00 AM – 11:00 PM

                </p>




              </div>


            </div>







            {/* Links */}

            <div>


              <h3 className="
                text-xl
                font-semibold
                mb-6
                text-orange-400
              ">

                Quick Links

              </h3>




              <ul className="
                space-y-4
                text-gray-300
              ">


                {
                  quickLinks
                  .map(([name,path])=>(

                    <li key={name}>


                      <Link

                        to={path}

                        className="
                          group
                          inline-flex
                          items-center
                          gap-2
                          hover:text-orange-400
                          transition
                          duration-300
                          focus-visible:outline-none
                          focus-visible:text-orange-400
                        "

                      >

                        <span className="h-px w-0 bg-orange-400 transition-all duration-300 group-hover:w-3" />

                        {name}

                      </Link>


                    </li>

                  ))

                }


              </ul>


            </div>








            {/* Map */}

            <div>


              <h3 className="
                text-xl
                font-semibold
                mb-6
                text-orange-400
              ">

                Find Us

              </h3>





              <div className="
                overflow-hidden
                rounded-2xl
                border
                border-white/10
                shadow-xl
              ">


                <iframe

                  title="MealService Location"

                  src="
                  https://www.google.com/maps?q=Khilgaon%20Taltola%20Market%20Dhaka&output=embed
                  "

                  width="100%"

                  height="230"

                  loading="lazy"

                  className="border-0"

                  style={{
                    filter: "grayscale(30%) contrast(1.05) brightness(0.9)",
                  }}

                />


              </div>



            </div>




          </div>







          {/* Bottom */}

          <div className="
            border-t
            border-white/10
            mt-14
            pt-8
            flex
            flex-col
            sm:flex-row
            items-center
            justify-between
            gap-3
            text-center
            sm:text-left
          ">


            <p className="
              text-gray-400
              text-sm
            ">


              © 2026

              <span className="
                text-orange-400
                mx-2
                font-semibold
              ">

                MealService

              </span>

              All Rights Reserved.


            </p>




            <p className="
              text-gray-500
              text-xs
            ">

              Quality meals · Fast delivery · Better experience

            </p>



          </div>



        </div>


      </div>


    </footer>

  );

};


export default Footer;