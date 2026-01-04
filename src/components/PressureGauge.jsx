import React, { useRef, useEffect } from "react";

export default function PressureGauge({
  value = 0,
  min = 0,
  max = 50,
  unit = "Pa",
  size = 320,
  showDigital = true,

  zones = [
    { start: 0, end: 15, color: "#2ecc71" },
    { start: 15, end: 35, color: "#f1c40f" },
    { start: 35, end: 50, color: "#e74c3c" },
  ],
}) {
  /* ---------- SAFE VALUE ---------- */
  const safeValue = Math.min(Math.max(value, min), max);
  const range = max - min || 1;

  /* ---------- GEOMETRY ---------- */
  const cx = size / 2;
  const cy = size / 2;

  const arcThickness = 10;
  const arcGap = 80;
  const radius = (size - arcThickness - arcGap) / 2;

  /* ---------- TICKS ---------- */
  const tickMajor = 22;
  const tickMinor = 14;
  const tickMicro = 8;

  const tickOuterRadius = radius - arcThickness / 2;
  const labelRadius = tickOuterRadius - 30;

  /* ---------- ANGLES ---------- */
  const startAngle = 135;   // LEFT (0)
  const endAngle = 405;     // RIGHT (max)
  const angleRange = endAngle - startAngle;

  /* ---------- NEEDLE ---------- */
  const smoothValue = useRef(safeValue);
  useEffect(() => {
    smoothValue.current = safeValue; // no smoothing (stable)
  }, [safeValue]);

  const needleAngle =
    startAngle + 90 +
    angleRange * ((safeValue.toFixed(2) - min) / range); // ((value.current - min) / range);

  const toRad = (deg) => (deg * Math.PI) / 180;

  const arcPath = (a1, a2, r) => {
    const s = toRad(a1);
    const e = toRad(a2);
    const x1 = cx + r * Math.cos(s);
    const y1 = cy + r * Math.sin(s);
    const x2 = cx + r * Math.cos(e);
    const y2 = cy + r * Math.sin(e);
    const large = a2 - a1 > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id="metal" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#222" />
          <stop offset="50%" stopColor="#aaa" />
          <stop offset="100%" stopColor="#555" />
        </linearGradient>

        <linearGradient id="needleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff2a2a" />
          <stop offset="100%" stopColor="#7a0000" />
        </linearGradient>
      </defs>

      {/* ---------- BEZEL ---------- */}
      <circle cx={cx} cy={cy} r={radius + 32} fill="none" stroke="url(#metal)" strokeWidth={14} />
      <circle cx={cx} cy={cy} r={radius + 22} fill="none" stroke="#777" strokeWidth={4} />

      {/* ---------- FACE ---------- */}
      <circle cx={cx} cy={cy} r={radius + 10} fill="#fff" />

      {/* ---------- ZONES ---------- */}
      {zones.map((z, i) => {
        const a1 = startAngle + angleRange * (z.start / max);
        const a2 = startAngle + angleRange * (z.end / max);
        return (
          <path
            key={i}
            d={arcPath(a1, a2, radius)}
            stroke={z.color}
            strokeWidth={arcThickness}
            strokeLinecap="round"
            fill="none"
          />
        );
      })}

      {/* ---------- TICKS + NUMBERS ---------- */}
      {Array.from({ length: 101 }).map((_, i) => {
        const valueAtTick = min + (range * i) / 100;
        const pct = (valueAtTick - min) / range;
        const ang = startAngle + angleRange * pct;
        const rad = toRad(ang);

        const isMajor = i % 10 === 0;
        const isMinor = i % 5 === 0;

        const inner =
          radius -
          arcThickness / 2 -
          (isMajor ? tickMajor : isMinor ? tickMinor : tickMicro);

        return (
          <g key={i}>
            <line
              x1={cx + inner * Math.cos(rad)}
              y1={cy + inner * Math.sin(rad)}
              x2={cx + tickOuterRadius * Math.cos(rad)}
              y2={cy + tickOuterRadius * Math.sin(rad)}
              stroke="#2c3e50"
              strokeWidth={isMajor ? 3 : isMinor ? 2 : 1}
            />

            {isMajor && (
              <text
                x={cx + labelRadius * Math.cos(rad)}
                y={cy + labelRadius * Math.sin(rad)}
                fontSize="12"
                fontWeight="bold"
                fill="#333"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {Math.round(valueAtTick)}
              </text>
            )}
          </g>
        );
      })}

      {/* ---------- UNIT ---------- */}
      <text x={cx} y={cy - 55} fontSize="20" fontWeight="bold" textAnchor="middle">
        {unit}
      </text>

      {/* ---------- NEEDLE ---------- */}
      <g transform={`rotate(${needleAngle} ${cx} ${cy})`}>
        <polygon
          points={`${cx},${cy}
            ${cx - 8},${cy + 10}
            ${cx + 8},${cy + 10}
            ${cx},${cy - tickOuterRadius}`}
          fill="url(#needleGrad)"
        />
      </g>

      {/* ---------- CENTER ---------- */}
      <circle cx={cx} cy={cy} r={12} fill="url(#metal)" />
      <circle cx={cx} cy={cy} r={6} fill="#8b4513" />

      {/* ---------- DIGITAL ---------- */}
      {showDigital && (
        <>
          <rect x={cx - 45} y={cy + 55} width={90} height={36} rx={6} fill="#f8f6f4" stroke="#000" />
          <text x={cx} y={cy + 80} fontSize="20" fontWeight="bold" textAnchor="middle">
            {safeValue.toFixed(2)}
          </text>
        </>
      )}
    </svg>
  );
}
