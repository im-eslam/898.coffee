interface BackgroundProps {
  className?: string;
}

const BASE = "#e8ddcc";

const TILE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="270" height="180" viewBox="0 0 270 180">
  <g transform="translate(0 0) scale(0.75)">
    <rect width="120" height="120" fill="#f3ebdd" fill-opacity=".9"/>
    <path d="M0 120V0A120 120 0 0 1 120 120Z" fill="#cfe3e8" fill-opacity=".5"/>
  </g>
  <g transform="translate(90 0) scale(0.75)">
    <path d="M30 120V55A30 30 0 0 1 90 55V120Z" fill="#d8c8b2" fill-opacity=".9"/>
  </g>
  <g transform="translate(180 0) scale(0.75)">
    <rect width="120" height="120" fill="#f3ebdd" fill-opacity=".9"/>
    <path d="M48 120A12 12 0 0 1 72 120M39 120A21 21 0 0 1 81 120M30 120A30 30 0 0 1 90 120M21 120A39 39 0 0 1 99 120M12 120A48 48 0 0 1 108 120M3 120A57 57 0 0 1 117 120" fill="none" stroke="#005569" stroke-opacity=".14" stroke-width="4"/>
  </g>
  <g transform="translate(0 90) scale(0.75)">
    <rect width="120" height="120" fill="#d8c8b2" fill-opacity=".6"/>
    <path d="M120 0H0A120 120 0 0 0 120 120Z" fill="#f3ebdd" fill-opacity=".55"/>
  </g>
  <g transform="translate(90 90) scale(0.75)">
    <rect width="120" height="120" fill="#cfe3e8" fill-opacity=".35"/>
    <circle cx="60" cy="60" r="34" fill="#f3ebdd" fill-opacity=".7"/>
    <path d="M60 26A34 34 0 0 1 60 94Z" fill="#005569" fill-opacity=".12"/>
  </g>
  <g transform="translate(180 90) scale(0.75)">
    <rect x="50" y="10" width="20" height="100" rx="10" fill="#d8c8b2" fill-opacity=".8"/>
  </g>
</svg>`;

const PATTERN = `url("data:image/svg+xml,${encodeURIComponent(TILE_SVG)}")`;

const styles = {
  root: "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
  band: "absolute inset-x-0 top-0",
} as const;

const bandStyle = {
  height: "90dvh",
  backgroundImage: [
    "radial-gradient(ellipse 70% 42% at 50% 30%, rgb(232 221 204 / 0.9), transparent)",
    `linear-gradient(to bottom, transparent 50%, ${BASE})`,
    PATTERN,
  ].join(", "),
  backgroundSize: "auto, auto, 270px 180px",
  backgroundPosition: "0 0, 0 0, -30px -10px",
  backgroundRepeat: "no-repeat, no-repeat, repeat",
} as const;

export function Background({ className }: BackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={`${styles.root} ${className ?? ""}`}
      style={{ backgroundColor: BASE }}
    >
      <div className={styles.band} style={bandStyle} />
    </div>
  );
}
