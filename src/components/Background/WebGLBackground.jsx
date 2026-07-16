import { useEffect, useRef } from "react";

import {
  Renderer,
  Camera,
  Transform,
  Plane,
  Mesh,
  Program,
} from "ogl";


import vertex from "./shaders/vertex.glsl";
import fragment from "./shaders/fragment.glsl";


const WebGLBackground = () => {


  const containerRef = useRef(null);



  useEffect(() => {


    if (!containerRef.current) return;



    const isMobile = window.innerWidth < 768;



    const renderer = new Renderer({

      alpha: true,

      antialias: true,

      dpr: Math.min(
        window.devicePixelRatio,
        isMobile ? 1 : 1.5
      ),

    });



    const gl = renderer.gl;



    if (!gl) {

      console.log(
        "WebGL not supported"
      );

      return;

    }




    /* Canvas Style */

    gl.canvas.style.position = "absolute";

    gl.canvas.style.top = "0";

    gl.canvas.style.left = "0";

    gl.canvas.style.width = "100%";

    gl.canvas.style.height = "100%";

    gl.canvas.style.display = "block";




    containerRef.current.appendChild(
      gl.canvas
    );





    renderer.setSize(

      window.innerWidth,

      window.innerHeight

    );




    const camera = new Camera(gl);


    camera.position.z = 1;





    const scene = new Transform();





    const geometry = new Plane(gl, {

      width: 2,

      height: 2,

    });







    // Smooth Cursor

    let mouse = [

      0.5,

      0.5

    ];



    let targetMouse = [

      0.5,

      0.5

    ];







    const uniforms = {


      uTime:{

        value:0,

      },



      uResolution:{

        value:[

          window.innerWidth,

          window.innerHeight

        ],

      },



      uMouse:{

        value:[

          0.5,

          0.5

        ],

      },



      // Current Color

      uScrollColor:{

        value:[

          1.0,

          0.43,

          0.10

        ],

      },



      // Target Color

      uTargetColor:{

        value:[

          1.0,

          0.43,

          0.10

        ],

      },


    };








    const program = new Program(gl,{

      vertex,

      fragment,

      uniforms,

    });







    const mesh = new Mesh(gl,{

      geometry,

      program,

    });




    mesh.setParent(scene);








    // Mouse Move

    const handleMouseMove = (e)=>{


      targetMouse = [


        e.clientX /

        window.innerWidth,


        1 -

        e.clientY /

        window.innerHeight


      ];


    };







    // Touch Move (Mobile)

    const handleTouchMove = (e)=>{


      if(!e.touches[0]) return;



      targetMouse=[


        e.touches[0].clientX /

        window.innerWidth,



        1 -

        e.touches[0].clientY /

        window.innerHeight


      ];


    };








    // Resize

    const handleResize = ()=>{


      renderer.setSize(

        window.innerWidth,

        window.innerHeight

      );



      uniforms.uResolution.value=[


        window.innerWidth,


        window.innerHeight


      ];


    };









// Scroll Color
const handleScroll = () => {

  const maxScroll =
    document.body.scrollHeight -
    window.innerHeight;

  if (maxScroll <= 0) return;

  const scroll =
    window.scrollY /
    maxScroll;

  // Warm Orange
  if (scroll < 0.33) {

    uniforms.uTargetColor.value = [
      1.00,
      0.55,
      0.22
    ];

  }

  // Soft Lavender
  else if (scroll < 0.66) {

    uniforms.uTargetColor.value = [
      0.72,
      0.60,
      1.00
    ];

  }

  // Cyan Blue
  else {

    uniforms.uTargetColor.value = [
      0.35,
      0.85,
      1.00
    ];

  }

};








    window.addEventListener(

      "mousemove",

      handleMouseMove

    );



    window.addEventListener(

      "touchmove",

      handleTouchMove,

      {

        passive:true

      }

    );



    window.addEventListener(

      "resize",

      handleResize

    );



    window.addEventListener(

      "scroll",

      handleScroll

    );









    let animationId;





    const animate = (time)=>{


      animationId =

      requestAnimationFrame(

        animate

      );




      uniforms.uTime.value =

      time * 0.001;








      // Cursor Smooth Trail

      mouse[0] +=

      (

        targetMouse[0]

        -

        mouse[0]

      ) * 0.05;



      mouse[1] +=

      (

        targetMouse[1]

        -

        mouse[1]

      ) * 0.05;





      uniforms.uMouse.value = mouse;









      // Smooth Color Morph


      for(let i = 0; i < 3; i++){


        uniforms.uScrollColor.value[i] +=


        (

          uniforms.uTargetColor.value[i]

          -

          uniforms.uScrollColor.value[i]

        ) * 0.015;



      }







      renderer.render({

        scene,

        camera,

      });



    };






    animate(0);









    return ()=>{


      cancelAnimationFrame(

        animationId

      );



      window.removeEventListener(

        "mousemove",

        handleMouseMove

      );



      window.removeEventListener(

        "touchmove",

        handleTouchMove

      );



      window.removeEventListener(

        "resize",

        handleResize

      );



      window.removeEventListener(

        "scroll",

        handleScroll

      );




      if(

        containerRef.current &&

        gl.canvas.parentNode ===

        containerRef.current

      ){


        containerRef.current.removeChild(

          gl.canvas

        );


      }


    };



  },[]);






  return (

    <div

      ref={containerRef}

      className="webgl-canvas"

    />

  );

};


export default WebGLBackground;