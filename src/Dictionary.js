// import React, { useRef, useState, useEffect } from "react";
// import { Canvas } from "@react-three/fiber";
// import { useGLTF, Environment, OrbitControls } from "@react-three/drei";
// import { Suspense } from "react";
// import * as THREE from "three";
// import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
// import './Dictioary.css'

// const Dictionary = () => {
//   const [hdrPath, setHdrPath] = useState("/models/small_harbour_sunset_4k.hdr"); // Replace with your HDR file path
//   const { scene } = useGLTF("/models/free_stylized_hand_lowpoly.glb"); // Replace with your .glb model path

//   const modelRef = useRef();
//   const [mouse, setMouse] = useState({ x: 0, y: 0 });

//   // Update mouse position on mouse move
//   useEffect(() => {
//     const onMouseMove = (event) => {
//       setMouse({
//         x: (event.clientX / window.innerWidth) * 2 - 1,
//         y: -(event.clientY / window.innerHeight) * 2 + 1,
//       });
//     };

//     window.addEventListener("mousemove", onMouseMove);

//     return () => {
//       window.removeEventListener("mousemove", onMouseMove);
//     };
//   }, []);

//   useEffect(() => {
//     // If HDR file is loaded, adjust the lighting
//     const loader = new RGBELoader();
//     loader.load(hdrPath, (hdrTexture) => {
//       hdrTexture.mapping = THREE.EquirectangularReflectionMapping;
//       scene.background = hdrTexture;
//       scene.environment = hdrTexture;
//     });
//   }, [hdrPath]);

//   useEffect(() => {
//     // Rotate the model based on mouse position (horizontal only)
//     if (modelRef.current) {
//       // modelRef.current.rotation.y = mouse.x * Math.PI; // Rotate horizontally
//       const rotationX = 180; // Rotate 45 degrees around the x-axis
//       // const rotationY = 0; // Rotate 30 degrees around the y-axis 
//       const rotationZ = 90; // Rotate 60 degrees around the z-axis

//       // Convert degrees to radians and set rotation
//       modelRef.current.rotation.y = THREE.MathUtils.degToRad(rotationX);
//       modelRef.current.rotation.z = mouse.x ; // Rotate horizontally

//       // modelRef.current.rotation.y = THREE.MathUtils.degToRad(rotationY);
//       modelRef.current.rotation.x = THREE.MathUtils.degToRad(rotationZ);
//     }
//   }, [mouse]);

//   return (
    
//     <div className="container">
//       <div className="left">
//         <div className="title">Indian Sign Language</div>
//       </div>
//       <div className="right">
//     <Canvas
//       shadows
//       camera={{ position: [0, 5, 5], fov: 50 }}
//       style={{ height: "100vh", width: "100%" }}
//     >
//       <Suspense fallback={null}>
//         {/* Set up HDR environment lighting */}
//         <Environment files={hdrPath} />
        
//         {/* Model */}
//         <primitive
//           ref={modelRef}
//           object={scene}
//           scale={8}
//           position={[.1, 0, 0]} // Model in the center
//         />

//         {/* Lighting */}
//         <ambientLight intensity={0.5} />
//         <directionalLight
//           castShadow
//           position={[5, 5, 5]}
//           intensity={0.8}
//           shadow-mapSize-width={2048}
//           shadow-mapSize-height={2048}
//         />
        
//         {/* Orbit Controls for interactivity */}
//         <OrbitControls enablePan={false} enableRotate={false} />
//       </Suspense>
//     </Canvas>
//     </div>
//     </div>
//   );
  
// };

// export default Dictionary;


import React, { useEffect, useRef } from 'react';
import './Dictionary.css';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import LocomotiveScroll from 'locomotive-scroll';

gsap.registerPlugin(ScrollTrigger);

const Dictionary = () => {
  const mainRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const locoScroll = new LocomotiveScroll({
      el: mainRef.current,
      smooth: true,
    });

    locoScroll.on('scroll', ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(mainRef.current, {
      scrollTop(value) {
        return arguments.length
          ? locoScroll.scrollTo(value, 0, 0)
          : locoScroll.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: mainRef.current.style.transform ? 'transform' : 'fixed',
    });

    ScrollTrigger.addEventListener('refresh', () => locoScroll.update());
    ScrollTrigger.refresh();

    const context = canvasRef.current.getContext('2d');
    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;

    const frameCount = 300;
    const images = Array.from({ length: frameCount }, (_, i) => {
      const img = new Image();
      img.src = `./male${String(i + 1).padStart(4, '0')}.png`;
      return img;
    });

    const imageSeq = { frame: 1 };

    gsap.to(imageSeq, {
      frame: frameCount - 1,
      snap: 'frame',
      ease: 'none',
      scrollTrigger: {
        scrub: 0.15,
        trigger: canvasRef.current,
        start: 'top top',
        end: '600% top',
        scroller: mainRef.current,
      },
      onUpdate: () => {
        render(images[imageSeq.frame], context);
      },
    });

    images[1].onload = () => render(images[1], context);

    function render(img, ctx) {
      const { width, height } = ctx.canvas;
      const hRatio = width / img.width;
      const vRatio = height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShift_x = (width - img.width * ratio) / 2;
      const centerShift_y = (height - img.height * ratio) / 2;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        centerShift_x,
        centerShift_y,
        img.width * ratio,
        img.height * ratio
      );
    }

    ScrollTrigger.create({
      trigger: canvasRef.current,
      pin: true,
      scroller: mainRef.current,
      start: 'top top',
      end: '600% top',
    });
  }, []);

  return (
    <div ref={mainRef} id="main">
      <div id="nav">
        <h3>
          <b>CYBER</b>FICTION*
        </h3>
        <button>APRIL, 2023</button>
      </div>
      <div id="page">
        <div id="loop">
          <h1>
            <b>CYBER</b>FICTION IS THE <b><i>REAL</i></b> <span>STORY</span> IN
            THE <span><i>METAVERSE</i></span>.
          </h1>
        </div>
        <h3>
          CYBERFICTION AIMS TO BE A DECENTRALIZED COMMUNITY THAT CAN CREATE NEW
          VALUES...
        </h3>
        <h4>...SCROLL TO READ</h4>
        <canvas ref={canvasRef}></canvas>
      </div>
      {/* Add the other sections like #page1, #page2, and #page3 similarly */}
    </div>
  );
};

export default Dictionary;
