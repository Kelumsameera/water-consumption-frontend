export default function RoundTank({ level = 0, label = "Tank" }) {
  const height = 360;
  const radius = 70;
  const x = 150;
  const topY = 60;
  const bottomY = topY + height;

  const waterHeight = (height * level) / 100;
  const waterTopY = bottomY - waterHeight;

  return (
    <svg width="300" height="440" className="drop-shadow-xl">
      <rect
        x={x - radius}
        y={topY}
        width={radius * 2}
        height={height}
        fill="url(#tankGradient)"
        stroke="#334155"
        strokeWidth="3"
      />

      <ellipse
        cx={x}
        cy={topY}
        rx={radius}
        ry="18"
        fill="#cbd5e1"
        stroke="#334155"
        strokeWidth="3"
      />

      <ellipse
        cx={x}
        cy={bottomY}
        rx={radius}
        ry="18"
        fill="#94a3b8"
        stroke="#334155"
        strokeWidth="3"
      />

      {level > 0 && (
        <>
          <defs>
            <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          <rect
            x={x - radius + 3}
            y={waterTopY}
            width={radius * 2 - 6}
            height={waterHeight}
            fill="url(#waterGradient)"
          />

          <ellipse
            cx={x}
            cy={waterTopY}
            rx={radius - 3}
            ry="14"
            fill="#3b82f6"
            opacity="0.95"
          />

          <ellipse
            cx={x}
            cy={bottomY}
            rx={radius - 3}
            ry="14"
            fill="#1d4ed8"
            opacity="0.9"
          />
        </>
      )}

      <defs>
        <linearGradient id="tankGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="50%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
      </defs>

      <text
        x={x}
        y={waterTopY - 20}
        textAnchor="middle"
        fontSize="32"
        fontWeight="bold"
        fill="#1e40af"
      >
        {Math.round(level)}%
      </text>

      <text
        x={x}
        y={bottomY + 50}
        textAnchor="middle"
        fontSize="18"
        fontWeight="600"
        fill="#1e293b"
      >
        {label}
      </text>
    </svg>
  );
}
