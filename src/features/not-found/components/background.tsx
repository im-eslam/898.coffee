import { Fragment, useId } from "react";

const styles = {
  colors: {
    base: "color-mix(in srgb, var(--color-cream) 60%, var(--color-sand))",
    brand: "var(--color-brand)",
    sand: "var(--color-sand)",
    arctic: "var(--color-arctic)",
    highlight: "var(--color-cream)",
  },

  opacity: {
    highlight: 0.9,
    wave: 0.5,
    arch: 0.9,
    rings: 0.14,
    quarterBase: 0.6,
    quarterHighlight: 0.55,
    moonBase: 0.35,
    moonDisc: 0.7,
    moonHalf: 0.12,
    pill: 0.8,
  },

  pattern: {
    cell: 90,
    columns: 3,
    offsetX: -30,
    offsetY: -10,
    ringRadii: [12, 21, 30, 39, 48, 57],
    ringWidth: 4,
  },

  band: {
    height: "75dvh",
  },

  veil: {
    glowSize: "70% 42%",
    glowCenter: "50% 30%",
    glowStrength: 90,
    fadeStart: "50%",
  },

  classes: {
    root: "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
    band: "absolute inset-x-0 top-0",
    layer: "absolute inset-0 size-full",
  },
} as const;

const { colors: c, opacity: o, pattern: p, veil: v } = styles;

const TILE = 120;
const SCALE = p.cell / TILE;

const CELLS = [
  <Fragment key="wave">
    <rect
      width={TILE}
      height={TILE}
      fill={c.highlight}
      fillOpacity={o.highlight}
    />
    <path
      d="M0 120V0A120 120 0 0 1 120 120Z"
      fill={c.arctic}
      fillOpacity={o.wave}
    />
  </Fragment>,

  <path
    key="arch"
    d="M30 120V55A30 30 0 0 1 90 55V120Z"
    fill={c.sand}
    fillOpacity={o.arch}
  />,

  <Fragment key="rings">
    <rect
      width={TILE}
      height={TILE}
      fill={c.highlight}
      fillOpacity={o.highlight}
    />
    {p.ringRadii.map((r) => (
      <path
        key={r}
        d={`M${60 - r} 120A${r} ${r} 0 0 1 ${60 + r} 120`}
        fill="none"
        stroke={c.brand}
        strokeOpacity={o.rings}
        strokeWidth={p.ringWidth}
      />
    ))}
  </Fragment>,

  <Fragment key="quarter">
    <rect
      width={TILE}
      height={TILE}
      fill={c.sand}
      fillOpacity={o.quarterBase}
    />
    <path
      d="M120 0H0A120 120 0 0 0 120 120Z"
      fill={c.highlight}
      fillOpacity={o.quarterHighlight}
    />
  </Fragment>,

  <Fragment key="half-moon">
    <rect width={TILE} height={TILE} fill={c.arctic} fillOpacity={o.moonBase} />
    <circle
      cx="60"
      cy="60"
      r="34"
      fill={c.highlight}
      fillOpacity={o.moonDisc}
    />
    <path
      d="M60 26A34 34 0 0 1 60 94Z"
      fill={c.brand}
      fillOpacity={o.moonHalf}
    />
  </Fragment>,

  <rect
    key="pill"
    x="50"
    y="10"
    width="20"
    height="100"
    rx="10"
    fill={c.sand}
    fillOpacity={o.pill}
  />,
] as const;

const ROWS = Math.ceil(CELLS.length / p.columns);

const VEIL = [
  `radial-gradient(ellipse ${v.glowSize} at ${v.glowCenter}, color-mix(in srgb, ${c.base} ${v.glowStrength}%, transparent), transparent 100%)`,
  `linear-gradient(to bottom, transparent ${v.fadeStart}, ${c.base} 100%)`,
].join(", ");

interface BackgroundProps {
  className?: string;
}

export function Background({ className }: BackgroundProps) {
  const patternId = useId();

  return (
    <div
      aria-hidden="true"
      className={`${styles.classes.root} ${className ?? ""}`}
      style={{ backgroundColor: c.base }}
    >
      <div
        className={styles.classes.band}
        style={{ height: styles.band.height }}
      >
        <svg className={styles.classes.layer}>
          <defs>
            <pattern
              id={patternId}
              width={p.cell * p.columns}
              height={p.cell * ROWS}
              patternUnits="userSpaceOnUse"
              x={p.offsetX}
              y={p.offsetY}
            >
              {CELLS.map((cell, i) => (
                <g
                  key={i}
                  transform={`translate(${(i % p.columns) * p.cell} ${Math.floor(i / p.columns) * p.cell}) scale(${SCALE})`}
                >
                  {cell}
                </g>
              ))}
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
        <div
          className={styles.classes.layer}
          style={{ backgroundImage: VEIL }}
        />
      </div>
    </div>
  );
}
