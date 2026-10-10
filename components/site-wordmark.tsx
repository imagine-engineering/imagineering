/** Custom lowercase letter paths; no font, raster image, or animation dependency. */
const letters = [
  { x: 0, path: "M2 3v3 M2 9v12" }, // i
  { x: 7, path: "M1 21V9h7v12 M8 9h7v12" }, // m
  { x: 26, path: "M1 9h10v12H1v-6h10" }, // a
  { x: 41, path: "M11 9H1v12h10V9 M11 21v4H2" }, // g
  { x: 56, path: "M2 3v3 M2 9v12" }, // i
  { x: 63, path: "M1 21V9h10v12" }, // n
  { x: 78, path: "M11 21H1V9h10v6H1" }, // e
  { x: 93, path: "M11 21H1V9h10v6H1" }, // e
  { x: 108, path: "M1 21V9h7v4" }, // r
  { x: 120, path: "M2 3v3 M2 9v12" }, // i
  { x: 127, path: "M1 21V9h10v12" }, // n
  { x: 142, path: "M11 9H1v12h10V9 M11 21v4H2" }, // g
]

/** The containing homepage link provides the accessible name. */
export function SiteWordmark() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 160 28"
      width="160"
      height="28"
      aria-hidden="true"
      focusable="false"
      className="block h-7 w-40 shrink-0"
      fill="none"
      strokeLinecap="butt"
      strokeLinejoin="miter"
    >
      {/* A small lower-right outline echoes the supplied square logo's layers. */}
      <g transform="translate(3.5 1)" stroke="hsl(var(--secondary))" strokeWidth="3.4">
        {letters.map(({ x, path }) => <path key={x} d={path} transform={`translate(${x} 0)`} />)}
      </g>
      <g transform="translate(2 0)" stroke="hsl(var(--primary))" strokeWidth="2.8">
        {letters.map(({ x, path }) => <path key={x} d={path} transform={`translate(${x} 0)`} />)}
      </g>
    </svg>
  )
}
