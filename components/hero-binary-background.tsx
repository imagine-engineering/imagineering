import styles from "./HeroBinaryBackground.module.css"

const changingDigits = [
  [60, 174], [228, 342], [1068, 230], [956, 398],
  [116, 566], [340, 678], [844, 622], [1124, 734],
]

/** Geometric paths, rather than font glyphs, keep the artwork independent of typography. */
export function HeroBinaryBackground() {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      aria-hidden="true"
      style={{
        backgroundColor: "hsl(var(--hero-base))",
        // Fill the actual hero bounds so mobile cropping cannot displace the glow.
        backgroundImage: "linear-gradient(to bottom right, hsl(var(--background)) 0%, hsl(var(--hero-base)) 28%, color-mix(in srgb, hsl(var(--hero-base)) 94%, hsl(var(--primary-light)) 6%) 55%, color-mix(in srgb, hsl(var(--hero-base)) 76%, hsl(var(--primary-light)) 24%) 78%, color-mix(in srgb, hsl(var(--hero-base)) 60%, hsl(var(--primary-light)) 40%) 100%)",
      }}
    >
      <svg
        className={styles.artwork}
        width="100%"
        height="100%"
        viewBox="0 0 1220 810"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <path id="hero-bit-zero" fillRule="evenodd" d="M0 0h28v32H0z M8 8v16h12V8z" />
          <path id="hero-bit-one" d="M8 0h10v32H8V8H2V0z" />
          <g id="hero-zero">
            <use href="#hero-bit-zero" x="4" y="4" stroke="hsl(var(--secondary))" strokeWidth="2" />
            <use href="#hero-bit-zero" fill="hsl(var(--primary))" />
          </g>
          <g id="hero-one">
            <use href="#hero-bit-one" x="4" y="4" stroke="hsl(var(--secondary))" strokeWidth="2" />
            <use href="#hero-bit-one" fill="hsl(var(--primary))" />
          </g>
          <pattern id="hero-binary-grid" width="224" height="224" patternUnits="userSpaceOnUse">
            {Array.from({ length: 16 }, (_, index) => {
              const column = index % 4
              const row = Math.floor(index / 4)
              return (
                <use
                  key={index}
                  href={(column + row) % 2 ? "#hero-one" : "#hero-zero"}
                  x={4 + column * 56}
                  y={6 + row * 56}
                  opacity={(index % 3) === 0 ? 0.72 : 0.42}
                />
              )
            })}
          </pattern>
          <mask id="hero-changing-cells" maskUnits="userSpaceOnUse" x="0" y="0" width="1220" height="810">
            <rect width="1220" height="810" fill="white" />
            {changingDigits.map(([x, y], index) => (
              <rect key={index} x={x - 2} y={y - 2} width="36" height="40" fill="black" />
            ))}
          </mask>
          <radialGradient
            id="hero-content-shade"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(610 260) scale(540 400)"
            r="1"
            cx="0"
            cy="0"
          >
            <stop offset="0" stopColor="hsl(var(--background))" stopOpacity="0.97" />
            <stop offset="0.35" stopColor="hsl(var(--background))" stopOpacity="0.96" />
            <stop offset="0.65" stopColor="hsl(var(--background))" stopOpacity="0.92" />
            <stop offset="0.8" stopColor="hsl(var(--background))" stopOpacity="0.65" />
            <stop offset="0.9" stopColor="hsl(var(--background))" stopOpacity="0.25" />
            <stop offset="1" stopColor="hsl(var(--background))" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hero-navigation-shade" x1="0" y1="0" x2="0" y2="270" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="hsl(var(--background))" stopOpacity="1" />
            <stop offset="0.7" stopColor="hsl(var(--background))" stopOpacity="0.99" />
            <stop offset="1" stopColor="hsl(var(--background))" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* This fixed group opacity caps every animation state, including overlapping outlines. */}
        <g opacity="0.24">
          <rect width="1220" height="810" fill="url(#hero-binary-grid)" mask="url(#hero-changing-cells)" />
          {changingDigits.map(([x, y], index) => (
            <g key={index} transform={`translate(${x} ${y})`}>
              <g className={styles.zero} style={{ animationDelay: `${-index * 3}s` }}>
                <use href="#hero-zero" />
              </g>
              <g className={styles.one} style={{ animationDelay: `${-index * 3}s` }}>
                <use href="#hero-one" />
              </g>
            </g>
          ))}
          <rect x="24" y="24" width="1172" height="762" stroke="hsl(var(--secondary))" strokeWidth="3" opacity="0.45" />
          <rect x="18" y="18" width="1172" height="762" stroke="hsl(var(--primary))" strokeWidth="3" opacity="0.55" />
        </g>
        <rect width="1220" height="810" fill="hsl(var(--background))" opacity="0.18" />
        <rect width="1220" height="810" fill="url(#hero-content-shade)" />
        <rect width="1220" height="810" fill="url(#hero-navigation-shade)" />
      </svg>
    </div>
  )
}
