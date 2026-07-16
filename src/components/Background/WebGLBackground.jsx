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



  useEffect(()=>{


    if(!containerRef.current) return;



    const renderer = new Renderer({

      alpha:true,

      antialias:true,

      dpr:Math.min(
        window.devicePixelRatio,
        window.innerWidth < 768 ? 1 : 2
      ),

    });



    const gl = renderer.gl;



    gl.canvas.style.position="fixed";
    gl.canvas.style.top="0";
    gl.canvas.style.left="0";
    gl.canvas.style.width="100%";
    gl.canvas.style.height="100%";
    gl.canvas.style.display="block";



    containerRef.current.appendChild(
      gl.canvas
    );




    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );




    gl.clearColor(
      0.98,
      0.97,
      0.95,
      1
    );





    const camera = new Camera(gl);

    camera.position.z=1;



    const scene = new Transform();




    const geometry = new Plane(gl,{
      width:2,
      height:2,
    });







    // Smooth mouse

    let mouse=[
      0.5,
      0.5
    ];


    let targetMouse=[
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



      // Current color

      uScrollColor:{
        value:[
          1.0,
          0.43,
          0.10
        ],
      },



      // Target color

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









    // Mouse move

    const handleMouseMove=(e)=>{


      targetMouse=[

        e.clientX /
        window.innerWidth,


        1 -
        e.clientY /
        window.innerHeight

      ];


    };









    // Resize

    const handleResize=()=>{


      renderer.setSize(

        window.innerWidth,

        window.innerHeight

      );



      uniforms.uResolution.value=[

        window.innerWidth,

        window.innerHeight

      ];



    };









    // Scroll color

    const handleScroll=()=>{


      const scroll =

      window.scrollY /
      (
        document.body.scrollHeight -
        window.innerHeight
      );




      if(scroll < 0.33){


        uniforms.uTargetColor.value=[

          1.0,
          0.43,
          0.10

        ];


      }


      else if(scroll < 0.66){


        uniforms.uTargetColor.value=[

          0.4,
          0.7,
          1.0

        ];


      }


      else{


        uniforms.uTargetColor.value=[

          0.6,
          1.0,
          0.8

        ];


      }


    };









    window.addEventListener(
      "mousemove",
      handleMouseMove
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





    const animate=(time)=>{


      animationId =
      requestAnimationFrame(
        animate
      );



      uniforms.uTime.value =
      time * 0.001;





      // Cursor smooth trail

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



      uniforms.uMouse.value =
      mouse;







      // Liquid color morph

      uniforms.uScrollColor.value[0] +=
      (
        uniforms.uTargetColor.value[0]
        -
        uniforms.uScrollColor.value[0]
      ) * 0.015;



      uniforms.uScrollColor.value[1] +=
      (
        uniforms.uTargetColor.value[1]
        -
        uniforms.uScrollColor.value[1]
      ) * 0.015;



      uniforms.uScrollColor.value[2] +=
      (
        uniforms.uTargetColor.value[2]
        -
        uniforms.uScrollColor.value[2]
      ) * 0.015;






      renderer.render({

        scene,

        camera,

      });



    };





    animate(0);









    return()=>{


      cancelAnimationFrame(
        animationId
      );



      window.removeEventListener(
        "mousemove",
        handleMouseMove
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
        gl.canvas.parentNode === containerRef.current
      ){

        containerRef.current.removeChild(
          gl.canvas
        );

      }


    };





  },[]);






  return(

    <div

      ref={containerRef}

      className="webgl-canvas"

    />

  );


};


export default WebGLBackground;