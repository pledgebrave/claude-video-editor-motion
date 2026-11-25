import React from "react";
import { COLORS, FONTS } from "../theme";

interface ArtProps {
  frame?: number;
  compact?: boolean;
  blurry?: boolean;
  sparkleIntensity?: number;
  discoZoom?: number;
  overdrive?: boolean;
}

export const NightCityArt: React.FC<ArtProps> = ({ frame = 0, compact = false }) => {
  const twinkle = 0.65 + 0.35 * Math.sin(frame * 0.18);
  const windows = [
    { x: 18, y: 122, w: 6, h: 8, lit: true },
    { x: 28, y: 136, w: 6, h: 8, lit: true },
    { x: 48, y: 108, w: 7, h: 9, lit: true },
    { x: 60, y: 126, w: 7, h: 9, lit: true },
    { x: 96, y: 98, w: 8, h: 10, lit: true },
    { x: 110, y: 118, w: 8, h: 10, lit: true },
    { x: 148, y: 110, w: 7, h: 9, lit: true },
    { x: 162, y: 132, w: 7, h: 9, lit: true },
  ];

  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B1F4B" />
          <stop offset="65%" stopColor="#343875" />
          <stop offset="100%" stopColor="#5E4D8C" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#nightSky)" />
      {/* Stars */}
      {[
        [24, 34, 2.2],
        [52, 22, 1.8],
        [82, 46, 2.4],
        [164, 28, 2.1],
        [176, 56, 1.7],
        [36, 72, 1.6],
      ].map(([cx, cy, r], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="#FFF3B0"
          opacity={i % 2 === 0 ? twinkle : 1.15 - twinkle * 0.4}
        />
      ))}
      {/* Crescent Moon */}
      <path
        d="M126 26 A22 22 0 1 0 148 56 A17 17 0 1 1 126 26 Z"
        fill={COLORS.gold}
        stroke={COLORS.ink}
        strokeWidth={compact ? 1.5 : 2.2}
      />
      {/* City skyline */}
      <rect x="8" y="106" width="32" height="94" fill="#23274D" stroke="#151833" strokeWidth="2" />
      <rect x="40" y="92" width="38" height="108" fill="#2D3261" stroke="#151833" strokeWidth="2" />
      <rect x="78" y="114" width="18" height="86" fill="#212548" stroke="#151833" strokeWidth="2" />
      <rect x="90" y="80" width="40" height="120" fill="#2A2E5A" stroke="#151833" strokeWidth="2" />
      <rect x="130" y="100" width="32" height="100" fill="#23274D" stroke="#151833" strokeWidth="2" />
      <rect x="160" y="118" width="34" height="82" fill="#2E3363" stroke="#151833" strokeWidth="2" />
      {windows.map((w, idx) => (
        <rect
          key={idx}
          x={w.x}
          y={w.y}
          width={w.w}
          height={w.h}
          rx="1.5"
          fill={idx % 3 === 0 ? "#FFD166" : "#FFE89E"}
        />
      ))}
    </svg>
  );
};

export const RamenArt: React.FC<ArtProps> = ({ frame = 0, compact = false, blurry = false }) => {
  const liftY = Math.sin(frame * 0.14) * 3;
  const steamWave = Math.sin(frame * 0.16) * 4;

  if (blurry) {
    const spinAngle = (frame * 14) % 360;
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          background: "linear-gradient(135deg, #6E7175 0%, #9FA3A8 50%, #5B5E62 100%)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.45 }}>
          <circle cx="55" cy="70" r="34" fill="#D5D8DC" />
          <circle cx="140" cy="82" r="28" fill="#B2B7BD" />
          <ellipse cx="100" cy="142" rx="64" ry="30" fill="#8C9095" />
          <circle cx="96" cy="106" r="42" fill="#EAECEE" opacity="0.4" />
        </svg>
        <svg width={compact ? 26 : 56} height={compact ? 26 : 56} viewBox="0 0 60 60" style={{ zIndex: 2 }}>
          <circle cx="30" cy="30" r="22" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="6" />
          <path
            d="M30 8 A22 22 0 0 1 52 30"
            fill="none"
            stroke="#FFFDF8"
            strokeWidth="6"
            strokeLinecap="round"
            transform={`rotate(${spinAngle} 30 30)`}
          />
        </svg>
        {!compact && (
          <div
            style={{
              zIndex: 2,
              marginTop: 12,
              fontFamily: FONTS.ui,
              fontWeight: 700,
              fontSize: 20,
              color: "#FFFDF8",
              textShadow: "0 2px 4px rgba(0,0,0,0.6)",
              letterSpacing: 1,
            }}
          >
            对焦中...
          </div>
        )}
      </div>
    );
  }

  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <rect width="200" height="200" fill="#FDF5E2" />
      {/* Sunburst stripes */}
      <g opacity="0.55" fill="#FBE5B6">
        <polygon points="100,105 0,20 28,0" />
        <polygon points="100,105 68,0 105,0" />
        <polygon points="100,105 145,0 184,0" />
        <polygon points="100,105 200,36 200,72" />
      </g>
      {!compact && (
        <g>
          <rect x="28" y="8" width="144" height="28" rx="6" fill="#3B6EA5" stroke={COLORS.ink} strokeWidth="2.5" />
          <circle cx="42" cy="22" r="3" fill="#FFFDF8" />
          <circle cx="158" cy="22" r="3" fill="#FFFDF8" />
          <text
            x="100"
            y="28"
            textAnchor="middle"
            fontFamily={FONTS.ui}
            fontWeight="900"
            fontSize="17"
            fill="#FFFDF8"
            letterSpacing="4"
          >
            拉面
          </text>
        </g>
      )}

      {/* Bowl */}
      <path d="M32 122 Q100 132 168 122 L154 166 Q100 184 46 166 Z" fill="#FFFDF8" stroke={COLORS.ink} strokeWidth="3" />
      <path d="M40 136 Q100 148 160 136" fill="none" stroke="#E05A47" strokeWidth="4" />
      <ellipse cx="100" cy="122" rx="68" ry="20" fill="#F2AE52" stroke={COLORS.ink} strokeWidth="3" />
      {/* Broth */}
      <ellipse cx="100" cy="123" rx="60" ry="15" fill="#E89A3C" />
      {/* Toppings */}
      <ellipse cx="64" cy="120" rx="14" ry="8" fill="#FFF5DC" stroke={COLORS.ink} strokeWidth="2" />
      <circle cx="64" cy="120" r="4.5" fill="#F4A236" />
      <ellipse cx="136" cy="119" rx="13" ry="8" fill="#FFB5C2" stroke={COLORS.ink} strokeWidth="2" />
      <path d="M130 119 Q136 115 142 119" fill="none" stroke="#E76F51" strokeWidth="2" />
      <rect x="132" y="96" width="22" height="20" rx="2" fill="#2E4A36" stroke={COLORS.ink} strokeWidth="2" transform="rotate(14 143 106)" />
      {/* Lifted Noodles + Chopsticks */}
      <g transform={`translate(0, ${liftY})`}>
        <path d="M84 82 Q80 105 85 125" fill="none" stroke="#FFE082" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M93 80 Q91 105 94 125" fill="none" stroke="#FFD166" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M102 82 Q104 105 101 125" fill="none" stroke="#FFE082" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M111 84 Q113 105 110 124" fill="none" stroke="#FFD166" strokeWidth="4.5" strokeLinecap="round" />
        {/* Chopsticks */}
        <line x1="78" y1="84" x2="180" y2="52" stroke="#8C5A3C" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="80" y1="92" x2="184" y2="63" stroke="#A66E4E" strokeWidth="4.5" strokeLinecap="round" />
      </g>
      {/* Steam wisps */}
      <path d={`M50 86 Q${44 + steamWave} 70 52 56`} fill="none" stroke="#D5C8B2" strokeWidth="2.5" strokeLinecap="round" />
      <path d={`M156 88 Q${162 - steamWave} 72 154 58`} fill="none" stroke="#D5C8B2" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
};

export const ShibaArt: React.FC<ArtProps> = ({ frame = 0 }) => {
  const heartBob = Math.sin(frame * 0.2) * 3;
  const headTilt = Math.sin(frame * 0.12) * 2.5;
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="shibaBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EAF6F6" />
          <stop offset="100%" stopColor="#FFF3E0" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#shibaBg)" />
      {/* Floating pink hearts */}
      <path
        d="M148 54 C148 47 137 47 137 54 C137 61 148 67 148 67 C148 67 159 61 159 54 C159 47 148 47 148 54 Z"
        fill="#FF758F"
        stroke={COLORS.ink}
        strokeWidth="2"
        transform={`translate(0, ${heartBob})`}
      />
      <path
        d="M46 66 C46 61 39 61 39 66 C39 71 46 75 46 75 C46 75 53 71 53 66 C53 61 46 61 46 66 Z"
        fill="#FFB3C1"
        stroke={COLORS.ink}
        strokeWidth="1.5"
        transform={`translate(0, ${-heartBob * 0.8})`}
      />
      {/* Body */}
      <path d="M52 200 C54 148 146 148 148 200 Z" fill="#E99A44" stroke={COLORS.ink} strokeWidth="3" />
      <path d="M72 200 C74 164 126 164 128 200 Z" fill="#FFFDF8" />
      {/* Red Collar + Gold Bell */}
      <path d="M68 156 Q100 172 132 156" fill="none" stroke="#E63946" strokeWidth="10" strokeLinecap="round" />
      <circle cx="100" cy="168" r="8" fill={COLORS.gold} stroke={COLORS.ink} strokeWidth="2.2" />
      {/* Head */}
      <g transform={`rotate(${headTilt} 100 105)`}>
        {/* Ears */}
        <polygon points="52,72 44,32 82,56" fill="#E99A44" stroke={COLORS.ink} strokeWidth="3" strokeLinejoin="round" />
        <polygon points="56,64 52,42 74,56" fill="#FFB5C2" />
        <polygon points="148,72 156,32 118,56" fill="#E99A44" stroke={COLORS.ink} strokeWidth="3" strokeLinejoin="round" />
        <polygon points="144,64 148,42 126,56" fill="#FFB5C2" />
        {/* Face Base */}
        <ellipse cx="100" cy="108" rx="52" ry="46" fill="#E99A44" stroke={COLORS.ink} strokeWidth="3" />
        {/* White Cheeks & Muzzle */}
        <path
          d="M52 116 Q72 98 100 104 Q128 98 148 116 Q142 152 100 152 Q58 152 52 116 Z"
          fill="#FFFDF8"
        />
        {/* Eyebrows */}
        <ellipse cx="78" cy="88" rx="6" ry="3.5" fill="#FFF3DC" />
        <ellipse cx="122" cy="88" rx="6" ry="3.5" fill="#FFF3DC" />
        {/* Eyes */}
        <circle cx="78" cy="100" r="5.5" fill={COLORS.ink} />
        <circle cx="76.5" cy="98" r="1.8" fill="#FFF" />
        <circle cx="122" cy="100" r="5.5" fill={COLORS.ink} />
        <circle cx="120.5" cy="98" r="1.8" fill="#FFF" />
        {/* Blush */}
        <ellipse cx="64" cy="116" rx="7" ry="4" fill="#FF9E9E" opacity="0.7" />
        <ellipse cx="136" cy="116" rx="7" ry="4" fill="#FF9E9E" opacity="0.7" />
        {/* Nose & Happy Mouth */}
        <ellipse cx="100" cy="113" rx="6.5" ry="4.5" fill={COLORS.ink} />
        <path d="M90 124 Q95 130 100 123 Q105 130 110 124" fill="none" stroke={COLORS.ink} strokeWidth="2.8" strokeLinecap="round" />
      </g>
    </svg>
  );
};

export const XiaoKeDiscoArt: React.FC<ArtProps> = ({
  frame = 0,
  compact = false,
  sparkleIntensity = 0,
  discoZoom = 1,
  overdrive = false,
}) => {
  const bounceY = Math.abs(Math.sin(frame * 0.28)) * -8;
  const armWave = Math.sin(frame * 0.35) * 18;
  const discoRot = (frame * 5) % 360;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        background: "#1B1336",
      }}
    >
      <svg
        viewBox="0 0 200 200"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        style={{
          transform: `scale(${discoZoom})`,
          filter: overdrive
            ? "saturate(2.8) contrast(1.45) brightness(1.15)"
            : sparkleIntensity > 0.3
              ? `saturate(${1 + sparkleIntensity * 0.45}) contrast(${1 + sparkleIntensity * 0.12})`
              : undefined,
        }}
      >
        <defs>
          <linearGradient id="discoWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1D123A" />
            <stop offset="65%" stopColor="#4A1E6B" />
            <stop offset="100%" stopColor="#7C2AE8" />
          </linearGradient>
        </defs>
        <rect width="200" height="200" fill="url(#discoWall)" />
        {/* Light beams */}
        <polygon points="100,32 10,160 44,160" fill="rgba(255, 224, 102, 0.18)" />
        <polygon points="100,32 156,160 190,160" fill="rgba(79, 179, 191, 0.2)" />
        <polygon points="100,32 75,160 125,160" fill="rgba(255, 117, 143, 0.15)" />

        {/* Hanging Disco Ball */}
        <line x1="100" y1="0" x2="100" y2="20" stroke="#DDD" strokeWidth="2.5" />
        <circle cx="100" cy="34" r="15" fill="#E5E7EB" stroke={COLORS.ink} strokeWidth="2" />
        <path d="M86 34 H114 M100 19 V49 M89 25 Q100 30 111 25 M89 43 Q100 38 111 43" stroke="#9CA3AF" strokeWidth="1.4" fill="none" />
        <circle cx={94 + Math.cos(discoRot * 0.05) * 4} cy="28" r="3" fill="#FFF" opacity="0.85" />

        {/* Checkered Dance Floor */}
        <rect x="0" y="142" width="200" height="58" fill="#251A48" />
        {[0, 1, 2, 3, 4].map((col) =>
          [0, 1].map((row) => {
            const bright = (col + row + Math.floor(frame / 6)) % 2 === 0;
            return (
              <rect
                key={`${col}-${row}`}
                x={col * 40}
                y={142 + row * 28}
                width="40"
                height="28"
                fill={bright ? "#4CC9F0" : "#7209B7"}
                opacity={bright ? 0.55 : 0.4}
                stroke="#181033"
                strokeWidth="1.5"
              />
            );
          })
        )}

        {/* Dancing Mini XiaoKe */}
        <g transform={`translate(100, ${114 + bounceY})`}>
          {/* Arms */}
          <path
            d={`M-28 -4 Q-42 ${-24 + armWave} -36 ${-38 + armWave}`}
            fill="none"
            stroke={COLORS.terracotta}
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d={`M28 -4 Q42 ${-24 - armWave} 36 ${-38 - armWave}`}
            fill="none"
            stroke={COLORS.terracotta}
            strokeWidth="7"
            strokeLinecap="round"
          />
          {/* Legs */}
          <line x1="-12" y1="22" x2="-15" y2="36" stroke={COLORS.ink} strokeWidth="5.5" strokeLinecap="round" />
          <line x1="12" y1="22" x2="15" y2="36" stroke={COLORS.ink} strokeWidth="5.5" strokeLinecap="round" />
          {/* Body */}
          <rect x="-28" y="-24" width="56" height="48" rx="10" fill={COLORS.terracotta} stroke={COLORS.ink} strokeWidth="3" />
          {/* Happy eyes */}
          <path d="M-15 -6 Q-11 -11 -7 -6" fill="none" stroke={COLORS.ink} strokeWidth="3" strokeLinecap="round" />
          <path d="M7 -6 Q11 -11 15 -6" fill="none" stroke={COLORS.ink} strokeWidth="3" strokeLinecap="round" />
          {/* Blush */}
          <circle cx="-18" cy="3" r="3.5" fill="#FF9E9E" />
          <circle cx="18" cy="3" r="3.5" fill="#FF9E9E" />
          {/* Smile */}
          <path d="M-7 6 Q0 14 7 6" fill="none" stroke={COLORS.ink} strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Sparkle stars */}
        {!compact && sparkleIntensity > 0.05 && (
          <g opacity={Math.min(1, sparkleIntensity)}>
            {[
              [34, 48, 12],
              [162, 60, 10],
              [42, 118, 9],
              [158, 120, 11],
            ].map(([sx, sy, sz], i) => {
              const pulse = 0.75 + 0.35 * Math.sin(frame * 0.4 + i);
              const r = sz * pulse;
              return (
                <path
                  key={i}
                  d={`M${sx} ${sy - r} L${sx + r * 0.25} ${sy - r * 0.25} L${sx + r} ${sy} L${sx + r * 0.25} ${sy + r * 0.25} L${sx} ${sy + r} L${sx - r * 0.25} ${sy + r * 0.25} L${sx - r} ${sy} L${sx - r * 0.25} ${sy - r * 0.25} Z`}
                  fill="#FFF7AE"
                  stroke={COLORS.goldDeep}
                  strokeWidth="1.2"
                />
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
};
