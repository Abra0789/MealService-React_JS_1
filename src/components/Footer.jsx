import React from "react";

import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

import { Link } from "react-router-dom";


const Footer = () => {


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




      <div className="
        max-w-7xl
        mx-auto
        px-6
        py-16
      ">


        <div className="
          grid
          md:grid-cols-4
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
              font-bold
              mb-4
            ">


              <span className="
                text-orange-400
              ">
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
              gap-4
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
                      hover:scale-110
                      transition
                      cursor-pointer
                    "

                  >

                    <Icon/>

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

                <FaPhoneAlt 
                  className="text-orange-400"
                />

                +880 1XXX-XXXXXX

              </p>





              <p className="
                flex
                items-center
                gap-3
              ">

                <FaEnvelope
                  className="text-orange-400"
                />

                support@mealservice.com

              </p>





              <p className="
                flex
                gap-3
              ">

                <FaMapMarkerAlt
                  className="
                    text-orange-400
                    mt-1
                  "
                />

                Khilgaon Taltola Market,
                Dhaka, Bangladesh

              </p>




              <p className="
                text-sm
                text-gray-500
              ">

                Opening Hours:
                <br/>
                10:00 AM - 11:00 PM

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
                [
                  ["Home","/"],
                  ["Meals","/meals"],
                  ["Cart","/cart"],
                  ["My Profile","/profile"],
                  ["My Orders","/orders"]
                ]
                .map(([name,path])=>(

                  <li key={name}>


                    <Link

                      to={path}

                      className="
                        hover:text-orange-400
                        transition
                        duration-300
                      "

                    >

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
          text-center
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
            mt-3
          ">

            Quality meals. Fast delivery. Better experience.

          </p>



        </div>



      </div>


    </footer>

  );

};


export default Footer;