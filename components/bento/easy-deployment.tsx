import type React from "react"

interface DeploymentEasyProps {
  /** Width of component – number (px) or any CSS size value */
  width?: number | string
  /** Height of component – number (px) or any CSS size value */
  height?: number | string
  /** Extra Tailwind / CSS classes for root element */
  className?: string
}

const DeploymentEasy: React.FC<DeploymentEasyProps> = ({ width = "100%", height = "100%", className = "" }) => {
  /* ------------------------------------------------------------
   * Theme-based design tokens using global CSS variables
   * ---------------------------------------------------------- */
  const themeVars = {
    "--deploy-primary-color": "hsl(var(--primary))",
    "--deploy-background-color": "hsl(var(--background))",
    "--deploy-text-color": "hsl(var(--foreground))",
    "--deploy-text-secondary": "hsl(var(--muted-foreground))",
    "--deploy-border-color": "hsl(var(--border))",
  } as React.CSSProperties

  /* ------------------------------------------------------------
   * Console log output (static for demo) – can be replaced via props
   * ---------------------------------------------------------- */
  const logLines = [
    "Illustrative Cargo session",
    "Example project: copper-demo",
    "$ cargo check",
    "    Checking copper-demo",
    "    Finished dev profile",
    "$ cargo test",
    "    Running unit tests",
    "running 3 tests",
    "test parse_valid_input ... ok",
    "test reject_invalid_input ... ok",
    "test keep_error_context ... ok",
    "test result: ok. 3 passed",
    "$ cargo clippy",
    "    Checking copper-demo",
    "    Finished dev profile",
    "Review diagnostics and command output.",
    "This example does not execute commands."
]


  return (
    <div
      className={`w-full h-full flex items-center justify-center p-4 relative ${className}`}
      style={{
        width,
        height,
        position: "relative",
        background: "transparent",
        ...themeVars,
      }}
      role="img"
      aria-label="Static Cargo console illustration with example output"
    >
      {/* -------------------------------------------------------- */}
      {/* Console / Terminal panel                                */}
      {/* -------------------------------------------------------- */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "340px",
          height: "239px",
          background: "linear-gradient(180deg, var(--deploy-background-color) 0%, transparent 100%)",
          backdropFilter: "blur(7.907px)",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        {/* Inner translucent panel – replicates subtle overlay */}
        <div
          style={{
            position: "absolute",
            inset: "2px",
            borderRadius: "8px",
            background: "hsl(var(--foreground) / 0.08)",
          }}
        />

        {/* Log text */}
        <div
          style={{
            position: "relative",
            padding: "8px",
            height: "100%",
            overflow: "hidden",
            fontFamily: "'Geist Mono', 'SF Mono', Monaco, Consolas, 'Liberation Mono', monospace",
            fontSize: "10px",
            lineHeight: "16px",
            color: "var(--deploy-text-color)",
            whiteSpace: "pre",
          }}
        >
          {logLines.map((line, index) => (
            <p key={index} style={{ margin: 0 }}>
              {line}
            </p>
          ))}
        </div>

        {/* Inner border overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "0.791px solid var(--deploy-border-color)",
            borderRadius: "10px",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* -------------------------------------------------------- */}
      {/* Call-to-action button                                   */}
      {/* -------------------------------------------------------- */}
      <div
        style={{
          position: "absolute",
          top: "calc(50% + 57.6px)",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6.375px",
          padding: "5.1px 10.2px",
          background: "var(--deploy-primary-color)",
          color: "hsl(var(--primary-foreground))",
          border: "none",
          cursor: "pointer",
          borderRadius: "8.925px",
          fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: "16.575px",
          lineHeight: "25.5px",
          letterSpacing: "-0.51px",
          fontWeight: 500,
          whiteSpace: "nowrap",
          boxShadow:
            "0px 42.075px 11.475px rgba(0, 0, 0, 0), 0px 26.775px 10.2px rgba(0, 0, 0, 0.01), 0px 15.3px 8.925px rgba(0, 0, 0, 0.05), 0px 6.375px 6.375px rgba(0, 0, 0, 0.09), 0px 1.275px 3.825px rgba(0, 0, 0, 0.1)",
        }}
      >
        Cargo test example
      </div>
    </div>
  )
}

export default DeploymentEasy
