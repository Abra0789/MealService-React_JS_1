const Overlay = () => {
  return (
    <div className="background-overlay">

      {/* Noise */}
      <div className="background-noise" />


      {/* Grid */}
      <div className="background-grid" />


      {/* Top Glow - Reduced Orange */}
      <div
        className="
        absolute
        left-1/2
        -top-24
        h-60
        w-60
        -translate-x-1/2
        rounded-full
        bg-orange-400/5
        blur-[100px]
        "
      />


      {/* Left Glow */}
      <div
        className="
        absolute
        -left-24
        top-1/3
        h-55
        w-55
        rounded-full
        bg-orange-300/10
        blur-[120px]
        "
      />


      {/* Right Glow */}
      <div
        className="
        absolute
        -right-24
        bottom-1/4
        h-55
        w-55
        rounded-full
        bg-orange-500/10
        blur-[120px]
        "
      />


      {/* Bottom Glow */}
      <div
        className="
        absolute
        -bottom-28
        left-1/2
        h-75
        w-75
        -translate-x-1/2
        rounded-full
        bg-orange-500/10
        blur-[150px]
        "
      />


      {/* Vignette */}
      <div
        className="
        absolute
        inset-0
        bg-[radial-gradient(circle_at_center,transparent_55%,rgba(0,0,0,.08)_100%)]
        "
      />

    </div>
  );
};


export default Overlay;