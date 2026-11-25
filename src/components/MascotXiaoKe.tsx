import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONTS } from "../theme";
import { CLIP_CARD_CENTERS, TEXT_CARD_CENTERS, TRANSITION_CARD_CENTERS } from "./LeftLibraryPanel";
import { EXPORT_BUTTON_CENTER } from "./TopToolbar";
import { BEAT_BUTTON_CENTER } from "./TimelinePanel";
import { getInspectorState } from "./InspectorPanel";

export type XiaoKeMood = "normal" | "happy" | "panic" | "sweat" | "celebrate" | "cool";

interface XiaoKePose {
  x: number;
  y: number;
  mood: XiaoKeMood;
  armTarget: { x: number; y: number } | null;
  speech: string | null;
  scaleX?: number;
  jumpY?: number;
}

export function getXiaoKePose(frame: number): XiaoKePose {
  const inspector = getInspectorState(frame);

  // Act 2: Dragging clips & BGM onto timeline (42..138)
  if (frame >= 42 && frame < 140) {
    let target = CLIP_CARD_CENTERS.night;
    let bodyX = 185;
    if (frame >= 66 && frame < 92) {
      target = CLIP_CARD_CENTERS.ramen;
      bodyX = 275;
    } else if (frame >= 92 && frame < 114) {
      target = CLIP_CARD_CENTERS.disco;
      bodyX = 335;
    } else if (frame >= 114) {
      target = { x: 245, y: 595 };
      bodyX = 220;
    }

    const armDown =
      frame >= 52 && frame < 66
        ? { x: 155, y: 515 }
        : frame >= 76 && frame < 92
          ? { x: 310, y: 515 }
          : target;

    return {
      x: bodyX,
      y: 455,
      mood: "happy",
      armTarget: armDown,
      speech: frame < 85 ? "开工!" : null,
      jumpY: Math.abs(Math.sin(frame * 0.25)) * -6,
    };
  }

  // Act 3: Blurry segment inspection & scissor cut (140..246)
  if (frame >= 140 && frame < 246) {
    return {
      x: 205,
      y: 455,
      mood: frame >= 188 && frame < 220 ? "cool" : "normal",
      armTarget: frame >= 158 && frame < 210 ? { x: 365, y: 515 } : null,
      speech: frame >= 155 && frame < 194 ? "这段在发呆 zzz" : null,
    };
  }

  // Act 4: Tossing transitions onto timeline seams (246..350)
  if (frame >= 246 && frame < 350) {
    const idx = frame < 276 ? 0 : frame < 296 ? 1 : frame < 316 ? 2 : 3;
    const armTarget =
      frame >= 260 && frame < 326
        ? TRANSITION_CARD_CENTERS[idx % TRANSITION_CARD_CENTERS.length]
        : null;
    return {
      x: 215,
      y: 455,
      mood: "happy",
      armTarget,
      speech: null,
      jumpY: Math.abs(Math.sin(frame * 0.22)) * -4,
    };
  }

  // Act 5: Text drop & Ctrl+Z fix (350..466)
  if (frame >= 350 && frame < 466) {
    const isPanic = frame >= 390 && frame < 430;
    return {
      x: 255,
      y: 446,
      mood: isPanic ? "panic" : frame >= 432 ? "happy" : "normal",
      armTarget: frame >= 358 && frame < 382 ? TEXT_CARD_CENTERS.highEnergy : null,
      speech: null,
      jumpY: isPanic ? Math.sin(frame * 0.9) * 3 : 0,
    };
  }

  // Act 6: Adjusting right Inspector sliders with long stretchy arm (466..596)
  if (frame >= 466 && frame < 596) {
    return {
      x: 390,
      y: 462,
      mood: inspector.isOverdrive ? "panic" : "cool",
      armTarget: inspector.activeKnobPos,
      speech: null,
    };
  }

  // Act 7: Clicking Beat Sync button (596..696)
  if (frame >= 596 && frame < 696) {
    const bodyX = interpolate(frame, [596, 616], [390, 560], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return {
      x: bodyX,
      y: 595,
      mood: "happy",
      armTarget: frame >= 612 && frame < 668 ? BEAT_BUTTON_CENTER : null,
      speech: null,
      jumpY: frame >= 662 ? Math.abs(Math.sin(frame * 0.35)) * -8 : 0,
    };
  }

  // Act 8: Exporting & 99.99% stall gag -> celebration! (696..804)
  if (frame >= 696 && frame < 804) {
    const bodyX = interpolate(frame, [696, 714], [560, 995], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const isStall = frame >= 746 && frame < 778;
    const isCelebrate = frame >= 778;
    return {
      x: bodyX,
      y: 472,
      mood: isStall ? "sweat" : isCelebrate ? "celebrate" : "normal",
      armTarget: frame >= 712 && frame < 732 ? EXPORT_BUTTON_CENTER : null,
      speech: isStall ? "..." : null,
      jumpY: isCelebrate ? Math.abs(Math.sin((frame - 778) * 0.42)) * -18 : 0,
    };
  }

  // Act 9: Finale celebration at bottom-right (804..900)
  return {
    x: 1090,
    y: 618,
    mood: "celebrate",
    armTarget: null,
    speech: null,
    jumpY: Math.abs(Math.sin(frame * 0.35)) * -10,
  };
}

interface MascotXiaoKeProps {
  frame: number;
}

export const MascotXiaoKe: React.FC<MascotXiaoKeProps> = ({ frame }) => {
  if (frame < 40) return null;

  const pose = getXiaoKePose(frame);
  const bx = pose.x;
  const by = pose.y + (pose.jumpY ?? 0);

  const renderFace = () => {
    if (pose.mood === "panic") {
      return (
        <>
          <path d="M-16 -10 L-8 -5 L-16 0" fill="none" stroke={COLORS.ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 -10 L8 -5 L16 0" fill="none" stroke={COLORS.ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="0" cy="11" rx="7" ry="6" fill={COLORS.ink} />
        </>
      );
    }
    if (pose.mood === "sweat") {
      return (
        <>
          <line x1="-15" y1="-6" x2="-7" y2="-6" stroke={COLORS.ink} strokeWidth="3" strokeLinecap="round" />
          <line x1="7" y1="-6" x2="15" y2="-6" stroke={COLORS.ink} strokeWidth="3" strokeLinecap="round" />
          <line x1="-8" y1="10" x2="8" y2="10" stroke={COLORS.ink} strokeWidth="2.8" strokeLinecap="round" />
          {/* Sweat drop */}
          <path d="M22 -18 Q28 -10 22 -4 Q16 -10 22 -18 Z" fill="#6EC1E4" stroke={COLORS.ink} strokeWidth="1.6" />
        </>
      );
    }
    if (pose.mood === "celebrate" || pose.mood === "happy") {
      return (
        <>
          <path d="M-16 -5 Q-11 -12 -6 -5" fill="none" stroke={COLORS.ink} strokeWidth="3" strokeLinecap="round" />
          <path d="M6 -5 Q11 -12 16 -5" fill="none" stroke={COLORS.ink} strokeWidth="3" strokeLinecap="round" />
          <path d="M-8 8 Q0 17 8 8" fill="none" stroke={COLORS.ink} strokeWidth="3" strokeLinecap="round" />
        </>
      );
    }
    return (
      <>
        <circle cx="-11" cy="-6" r="3.8" fill={COLORS.ink} />
        <circle cx="11" cy="-6" r="3.8" fill={COLORS.ink} />
        <path d="M-7 8 Q0 14 7 8" fill="none" stroke={COLORS.ink} strokeWidth="2.8" strokeLinecap="round" />
      </>
    );
  };

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 35 }}>
      {/* Stage-space Stretchy Rubber-Hose Arm */}
      {pose.armTarget && (
        <svg width="1280" height="720" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <path
            d={`M ${bx + (pose.armTarget.x >= bx ? 26 : -26)} ${by - 4} Q ${(bx + pose.armTarget.x) / 2} ${Math.min(by, pose.armTarget.y) - 24} ${pose.armTarget.x} ${pose.armTarget.y}`}
            fill="none"
            stroke={COLORS.ink}
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d={`M ${bx + (pose.armTarget.x >= bx ? 26 : -26)} ${by - 4} Q ${(bx + pose.armTarget.x) / 2} ${Math.min(by, pose.armTarget.y) - 24} ${pose.armTarget.x} ${pose.armTarget.y}`}
            fill="none"
            stroke={COLORS.terracotta}
            strokeWidth="7"
            strokeLinecap="round"
          />
          <circle
            cx={pose.armTarget.x}
            cy={pose.armTarget.y}
            r="9"
            fill={COLORS.terracotta}
            stroke={COLORS.ink}
            strokeWidth="2.5"
          />
        </svg>
      )}

      {/* Character Body */}
      <svg
        width="120"
        height="110"
        viewBox="-60 -55 120 110"
        style={{
          position: "absolute",
          left: bx - 60,
          top: by - 55,
          overflow: "visible",
        }}
      >
        {/* Celebratory raised arms when no target */}
        {pose.mood === "celebrate" && (
          <>
            <path d="M-28 -4 Q-44 -28 -36 -42" fill="none" stroke={COLORS.ink} strokeWidth="10" strokeLinecap="round" />
            <path d="M-28 -4 Q-44 -28 -36 -42" fill="none" stroke={COLORS.terracotta} strokeWidth="6" strokeLinecap="round" />
            <path d="M28 -4 Q44 -28 36 -42" fill="none" stroke={COLORS.ink} strokeWidth="10" strokeLinecap="round" />
            <path d="M28 -4 Q44 -28 36 -42" fill="none" stroke={COLORS.terracotta} strokeWidth="6" strokeLinecap="round" />
          </>
        )}

        {/* Legs */}
        <line x1="-13" y1="26" x2="-15" y2="39" stroke={COLORS.ink} strokeWidth="6" strokeLinecap="round" />
        <line x1="13" y1="26" x2="15" y2="39" stroke={COLORS.ink} strokeWidth="6" strokeLinecap="round" />

        {/* Block Body */}
        <rect
          x="-32"
          y="-28"
          width="64"
          height="54"
          rx="13"
          fill={COLORS.terracotta}
          stroke={COLORS.ink}
          strokeWidth="3"
        />
        {/* Cheeks */}
        <circle cx="-20" cy="4" r="4.5" fill={COLORS.blush} opacity="0.85" />
        <circle cx="20" cy="4" r="4.5" fill={COLORS.blush} opacity="0.85" />
        {renderFace()}
      </svg>

      {/* Speech Bubble */}
      {pose.speech && (
        <div
          style={{
            position: "absolute",
            left: bx + 38,
            top: by - 56,
            backgroundColor: COLORS.paper,
            border: `2.5px solid ${COLORS.ink}`,
            borderRadius: 12,
            padding: "5px 12px",
            fontFamily: FONTS.ui,
            fontSize: 13,
            fontWeight: 800,
            color: COLORS.ink,
            whiteSpace: "nowrap",
            boxShadow: "0 3px 0 rgba(43,38,35,0.12)",
          }}
        >
          {pose.speech}
        </div>
      )}
    </div>
  );
};
