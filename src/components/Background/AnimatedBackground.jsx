import "./background.css";

import WebGLBackground from "./WebGLBackground";
import Overlay from "./Overlay";

const AnimatedBackground = () => {
  return (
    <div className="background-root">
      <WebGLBackground />
      <Overlay />
    </div>
  );
};

export default AnimatedBackground;