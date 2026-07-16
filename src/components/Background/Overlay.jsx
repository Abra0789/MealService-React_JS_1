const Overlay = () => {
  return (
    <div className="background-overlay">

      {/* Noise */}

      <div className="background-noise" />

      {/* Grid */}

      <div className="background-grid" />

      {/* Top Glow */}

      <div
        className="
          absolute
          left-1/2
          -top-95
          h-225
          w-225
          -translate-x-1/2
          rounded-full
          bg-orange-400/10
          blur-[180px]
        "
      />

      {/* Left Glow */}

      <div
        className="
          absolute
          -left-62.5
          top-1/3
          h-175
          w-175
          rounded-full
          bg-orange-300/8
          blur-[170px]
        "
      />

      {/* Right Glow */}

      <div
        className="
          absolute
          -right-62.5
          bottom-1/4
          h-175
          w-175
          rounded-full
          bg-orange-500/8
          blur-[170px]
        "
      />

      {/* Bottom Glow */}

      <div
        className="
          absolute
          -bottom-105
          left-1/2
          h-237.5
          w-237.5
          -translate-x-1/2
          rounded-full
          bg-orange-500/8
          blur-[220px]
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