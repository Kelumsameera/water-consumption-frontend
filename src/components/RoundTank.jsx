export default function RoundTank({
  levelCm = 0,
  maxHeightCm = 250,
  label = "Main Tank",
}) {
 
  const safeLevel = Math.max(0, Math.min(levelCm, maxHeightCm));
  const TANK_HEIGHT_PX = 432;
  const waterHeightPx = (safeLevel / maxHeightCm) * TANK_HEIGHT_PX;
  const percent = (safeLevel / maxHeightCm) * 100;
  const fillHeightPx = Math.min(waterHeightPx-15 );

  return (
    <div className="flex flex-col items-center w-95">

      {/* ===== HEADER ===== */}
      <div className="mb-3 text-xl font-semibold text-slate-800">
        {label}
      </div>

      {/* ===== READOUT ===== */}
      <div className="mb-5 flex items-center gap-4">
        <div className="text-3xl font-bold text-slate-900">
          {safeLevel} cm
        </div>
        <div className="text-2xl font-semibold text-green-600">
          {Math.round(percent)}%
        </div>
      </div>

      <div className="relative flex">

        {/* ===== BOTTLE NECK ===== */}
        <div className="absolute -top-4 left-22.75 -translate-x-1/2 w-26 h-4 bg-slate-700 rounded-t-full" />

        {/* ===== TANK BODY ===== */}
        <div
          className="
            relative w-44 h-108
            border-4 border-slate-700
            rounded-t-[48px]
            rounded-b-xl
            bg-slate-200
            overflow-hidden
          "
        >
          {/* ===== WATER CONTAINER (REAL HEIGHT) ===== */}
          <div
            className="
              absolute bottom-0 left-0 w-full 
              
              transition-[height]
              duration-700
              ease-in-out
              overflow-hidden
            "
            style={{ height: `${fillHeightPx}px` }}
          >
            {/* WATER BODY */}
            <div className="absolute inset-0 bg-linear-to-b from-blue-400 via-blue-600 to-blue-900" />

            {/* ===== WAVES (CLAMPED TO WATER ONLY) ===== */}
            <div className="absolute top-0 left-0 rounded-4xl w-[300%] h-3">
              <div className="wave wave-back" />
              <div className="wave wave-front" />
            </div>
          </div>

          {/* INNER STEEL SHINE */}
          <div className="absolute inset-y-0 left-3 w-4 bg-white opacity-10 blur-md" />
          <div className="absolute inset-y-0 right-3 w-4 bg-black opacity-10 blur-md" />
        </div>

        {/* ===== SCALE ===== */}
        <div className="ml-6 flex flex-col gap-6.25 mt-3 h-110 text-xs text-slate-600">
          {[...Array(11)].map((_, i) => {
            const cm = maxHeightCm - i * 25;

            return (
              <div key={i-1} className="flex items-center gap-1">
                <span className="w-4 h-0.5 bg-slate-500" />
                <span>{cm} cm</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== CSS WAVES ===== */}
      <style>
        {`
          .wave {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 100%;
          }

          .wave-back {
            background: rgba(147,197,253,0.4);
            animation: waveMove 7s linear infinite,
                       waveBob 2s ease-in-out infinite;
          }

          .wave-front {
            background: rgba(59,130,246,0.8);
            animation: waveMove 5s linear infinite,
                       waveBob 2s ease-in-out infinite;
          }

          @keyframes waveMove {
            from { transform: translateX(0); }
            to   { transform: translateX(50%); }
          }

          @keyframes waveBob {
            0%,100% { transform: translateY(0); }
            50%     { transform: translateY(4px); }
          }
        `}
      </style>
    </div>
  );
}
