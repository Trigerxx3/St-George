interface WireLineProps {
  className?: string;
  color?: "orange" | "green";
  /** "sweep" = gentle S-curve across the width; "arc" = single arc */
  variant?: "sweep" | "arc";
}

/** Decorative thin curved line with a faint glow (aria-hidden, no layout impact). */
export default function WireLine({ className = "", color = "orange", variant = "sweep" }: WireLineProps) {
  const d =
    variant === "arc"
      ? "M0 120 C 300 0, 900 0, 1200 120"
      : "M0 90 C 250 10, 450 170, 700 90 S 1050 20, 1200 80";
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none absolute ${className}`}
      viewBox="0 0 1200 180"
      preserveAspectRatio="none"
      fill="none"
    >
      <path d={d} strokeWidth="1.5" className={color === "orange" ? "wire-orange" : "wire-green"} opacity="0.7" />
    </svg>
  );
}
