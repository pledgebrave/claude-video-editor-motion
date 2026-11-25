import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONTS, LAYOUT, secToTrackX } from "../theme";
import { TRANSITION_CARD_CENTERS } from "./LeftLibraryPanel";

interface ComicEffectsProps {
  frame: number;
}

export const ComicEffects: React.FC<ComicEffectsProps> = ({ frame }) => {
  // 1. Act 3: Scissors snip ("唰!") + Trash Can ("哐当!") (f=190..236)
  const showScissors = frame >= 188 && frame < 214;
  const scissorX = secToTrackX(3.25);
  const scissorY = LAYOUT.trackVideo.y + 38;
  const showSnipText = frame >= 198 && frame < 218;

  const showTrash = frame >= 198 && frame < 242;
  const trashX = secToTrackX(4.1);
  const trashY = 588;
  const ejectedDrop = interpolate(frame, [202, 222], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 2. Act 4: Parabolic dotted arcs & "空心入网!" (f=262..338)
  const showArcs = frame >= 264 && frame < 332;
  const showSwishText = frame >= 295 && frame < 342;

  // 3. Act 5: Giant Ctrl+Z + "撤销!" + "已修正" stamp (f=406..464)
  const showCtrlZ = frame >= 406 && frame < 438;
  const ctrlZPressed = frame >= 418 && frame < 432;
  const showStamped = frame >= 434 && frame < 464;

  // 4. Act 6: "饱和度:拉满" overdrive banner (f=508..538)
  const showSatBanner = frame >= 508 && frame < 538;

  // 5. Act 7: "卡点!" callout (f=630..682)
  const showBeatBanner = frame >= 630 && frame < 682;

  // 6. Act 8: "叮!" bell burst + confetti (f=778..895)
  const showDing = frame >= 778 && frame < 808;
  const showConfetti = frame >= 778;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: frame >= 804 ? 28 : 38 }}>
      {/* Scissors + 唰! */}
      {showScissors && (
        <div
          style={{
            position: "absolute",
            left: scissorX - 24,
            top: scissorY - 30,
            fontSize: 40,
            transform: `rotate(${frame % 6 < 3 ? -12 : 6}deg)`,
          }}
        >
          ✂️
        </div>
      )}
      {showSnipText && (
        <div
          style={{
            position: "absolute",
            left: scissorX + 20,
            top: scissorY - 58,
            fontFamily: FONTS.comic,
            fontSize: 34,
            fontWeight: 900,
            color: COLORS.coral,
            WebkitTextStroke: `1.8px ${COLORS.ink}`,
            textShadow: "0 3px 0 #2B2623",
            rotate: "-8deg",
          }}
        >
          唰!
        </div>
      )}

      {/* Ejected blurry clip dropping into Trash Can */}
      {showTrash && (
        <>
          {ejectedDrop < 0.92 && (
            <div
              style={{
                position: "absolute",
                left: trashX - 38,
                top: interpolate(ejectedDrop, [0, 1], [LAYOUT.trackVideo.y + 10, trashY + 8]),
                width: 76,
                height: 36,
                borderRadius: 6,
                border: `2px solid ${COLORS.ink}`,
                background: "repeating-linear-gradient(135deg, #5C6066, #5C6066 6px, #777B82 6px, #777B82 12px)",
                transform: `rotate(${ejectedDrop * 24}deg) scale(${1 - ejectedDrop * 0.4})`,
              }}
            />
          )}

          {/* Hand-drawn Trash Can */}
          <svg
            width="86"
            height="92"
            viewBox="0 0 86 92"
            style={{ position: "absolute", left: trashX - 43, top: trashY }}
          >
            {/* Lid */}
            <g transform={`rotate(${frame >= 216 && frame < 228 ? -14 : 0} 18 18)`}>
              <rect x="14" y="12" width="58" height="10" rx="4" fill="#D1D5DB" stroke={COLORS.ink} strokeWidth="2.5" />
              <rect x="33" y="5" width="20" height="7" rx="3" fill="#9CA3AF" stroke={COLORS.ink} strokeWidth="2.2" />
            </g>
            {/* Can body */}
            <polygon points="18,24 68,24 62,84 24,84" fill="#E5E7EB" stroke={COLORS.ink} strokeWidth="2.8" strokeLinejoin="round" />
            <line x1="33" y1="34" x2="35" y2="75" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" />
            <line x1="43" y1="34" x2="43" y2="75" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" />
            <line x1="53" y1="34" x2="51" y2="75" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" />
          </svg>

          {frame >= 208 && (
            <div
              style={{
                position: "absolute",
                left: trashX + 46,
                top: trashY + 26,
                fontFamily: FONTS.comic,
                fontSize: 32,
                fontWeight: 900,
                color: COLORS.gold,
                WebkitTextStroke: `1.8px ${COLORS.ink}`,
                textShadow: "0 3px 0 #2B2623",
                rotate: "6deg",
              }}
            >
              哐当!
            </div>
          )}
        </>
      )}

      {/* Parabolic dotted trajectories for transitions */}
      {showArcs && (
        <svg width="1280" height="720" style={{ position: "absolute", inset: 0 }}>
          {[
            { from: TRANSITION_CARD_CENTERS[0], to: { x: secToTrackX(2.0), y: LAYOUT.trackVideo.y + 38 } },
            { from: TRANSITION_CARD_CENTERS[2], to: { x: secToTrackX(4.5), y: LAYOUT.trackVideo.y + 38 } },
            { from: TRANSITION_CARD_CENTERS[3], to: { x: secToTrackX(7.5), y: LAYOUT.trackVideo.y + 38 } },
          ].map((arc, i) => (
            <path
              key={i}
              d={`M ${arc.from.x} ${arc.from.y} Q ${(arc.from.x + arc.to.x) / 2} 145 ${arc.to.x} ${arc.to.y}`}
              fill="none"
              stroke={COLORS.inkSoft}
              strokeWidth="2.8"
              strokeDasharray="6 6"
            />
          ))}
        </svg>
      )}
      {showSwishText && (
        <div
          style={{
            position: "absolute",
            left: 525,
            top: 416,
            fontFamily: FONTS.comic,
            fontSize: 32,
            fontWeight: 900,
            color: COLORS.teal,
            WebkitTextStroke: `1.6px ${COLORS.ink}`,
            textShadow: "0 3px 0 #2B2623",
            rotate: "-4deg",
          }}
        >
          空心入网!
        </div>
      )}

      {/* Giant Ctrl+Z keycap & 撤销! */}
      {showCtrlZ && (
        <>
          <div
            style={{
              position: "absolute",
              left: 332,
              top: 342,
              fontFamily: FONTS.comic,
              fontSize: 32,
              fontWeight: 900,
              color: COLORS.coral,
              WebkitTextStroke: `1.6px ${COLORS.ink}`,
              textShadow: "0 3px 0 #2B2623",
              rotate: "-6deg",
            }}
          >
            撤销!
          </div>
          <div
            style={{
              position: "absolute",
              left: 112,
              top: ctrlZPressed ? 548 : 540,
              width: 196,
              height: 68,
              borderRadius: 14,
              backgroundColor: COLORS.paper,
              border: `3px solid ${COLORS.ink}`,
              boxShadow: ctrlZPressed ? `0 2px 0 ${COLORS.ink}` : `0 10px 0 ${COLORS.ink}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FONTS.mono,
              fontSize: 34,
              fontWeight: 900,
              color: COLORS.ink,
            }}
          >
            Ctrl+Z
          </div>
        </>
      )}

      {/* Green rubber stamp 已修正 */}
      {showStamped && (
        <div
          style={{
            position: "absolute",
            left: 745,
            top: 112,
            padding: "8px 20px",
            borderRadius: 10,
            border: `4px solid ${COLORS.greenDone}`,
            outline: `2px solid ${COLORS.greenDone}`,
            outlineOffset: 3,
            backgroundColor: "rgba(255, 253, 248, 0.92)",
            fontFamily: FONTS.comic,
            fontSize: 32,
            fontWeight: 900,
            color: COLORS.greenDone,
            rotate: "-10deg",
          }}
        >
          已修正
        </div>
      )}

      {/* Fiery Saturation Overdrive Banner */}
      {showSatBanner && (
        <div
          style={{
            position: "absolute",
            left: 148,
            top: 142,
            padding: "8px 20px",
            borderRadius: 14,
            backgroundColor: "#FFE66D",
            border: `3px solid ${COLORS.ink}`,
            boxShadow: "0 5px 0 #2B2623",
            fontFamily: FONTS.comic,
            fontSize: 38,
            fontWeight: 900,
            color: "#E63946",
            WebkitTextStroke: `1.6px ${COLORS.ink}`,
            rotate: "-4deg",
          }}
        >
          饱和度:拉满
        </div>
      )}

      {/* 卡点! callout */}
      {showBeatBanner && (
        <div
          style={{
            position: "absolute",
            left: 88,
            top: 536,
            fontFamily: FONTS.comic,
            fontSize: 40,
            fontWeight: 900,
            color: COLORS.gold,
            WebkitTextStroke: `1.8px ${COLORS.ink}`,
            textShadow: "0 4px 0 #2B2623",
            rotate: "-5deg",
          }}
        >
          卡点!
        </div>
      )}

      {/* 叮! chime burst */}
      {showDing && (
        <div
          style={{
            position: "absolute",
            left: 912,
            top: 66,
            fontFamily: FONTS.comic,
            fontSize: 42,
            fontWeight: 900,
            color: COLORS.greenDone,
            WebkitTextStroke: `1.8px ${COLORS.ink}`,
            textShadow: "0 4px 0 #2B2623",
            rotate: "-8deg",
          }}
        >
          叮!
        </div>
      )}

      {/* Confetti particles after export completes */}
      {showConfetti &&
        Array.from({ length: 18 }).map((_, i) => {
          const t = frame - 778;
          const x = 140 + ((i * 67) % 1020) + Math.sin(t * 0.1 + i) * 18;
          const y = ((40 + i * 33 + t * (2.6 + (i % 3))) % 740) - 20;
          const colors = [COLORS.gold, COLORS.coral, COLORS.teal, COLORS.greenDone, COLORS.pastelPink];
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: i % 2 === 0 ? 10 : 8,
                height: i % 2 === 0 ? 10 : 14,
                borderRadius: i % 3 === 0 ? "50%" : 2,
                backgroundColor: colors[i % colors.length],
                border: `1.5px solid ${COLORS.ink}`,
                rotate: `${(t * 9 + i * 30) % 360}deg`,
                opacity: 0.9,
              }}
            />
          );
        })}
    </div>
  );
};
