import React from "react";
import { Easing, interpolate } from "remotion";
import { COLORS, FONTS } from "../theme";

interface FinaleMemoCardProps {
  frame: number;
}

export const FinaleMemoCard: React.FC<FinaleMemoCardProps> = ({ frame }) => {
  if (frame < 804) return null;

  const progress = interpolate(frame, [804, 824], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  const translateX = interpolate(progress, [0, 1], [-80, 0]);
  const line2Opacity = interpolate(frame, [826, 838], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line3Opacity = interpolate(frame, [844, 858], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        left: 58,
        top: 168,
        width: 344,
        height: 292,
        backgroundColor: COLORS.paper,
        border: `3px solid ${COLORS.ink}`,
        borderRadius: 16,
        boxShadow: "0 12px 0 rgba(43, 38, 35, 0.14)",
        padding: "22px 26px",
        boxSizing: "border-box",
        rotate: "-2.5deg",
        opacity: progress,
        translate: `${translateX}px 0px`,
        zIndex: 36,
        backgroundImage: "repeating-linear-gradient(to bottom, transparent 0px, transparent 39px, #EAE2D3 39px, #EAE2D3 41px)",
      }}
    >
      {/* Top sticky tape */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: -12,
          marginLeft: -42,
          width: 84,
          height: 22,
          backgroundColor: "#FFE89E",
          border: `2px solid ${COLORS.ink}`,
          borderRadius: 4,
          rotate: "2deg",
          opacity: 0.9,
        }}
      />

      <div
        style={{
          fontFamily: FONTS.ui,
          fontSize: 24,
          fontWeight: 800,
          color: COLORS.ink,
          marginTop: 22,
        }}
      >
        30 秒剪完，
      </div>

      <div
        style={{
          fontFamily: FONTS.comic,
          fontSize: 48,
          fontWeight: 900,
          color: COLORS.ink,
          marginTop: 24,
          opacity: line2Opacity,
          letterSpacing: -0.5,
        }}
      >
        Opus 5.5
      </div>

      <div
        style={{
          fontFamily: FONTS.ui,
          fontSize: 22,
          fontWeight: 700,
          color: COLORS.inkMuted,
          marginTop: 32,
          textAlign: "right",
          opacity: line3Opacity,
        }}
      >
        — 小克收工 ✨
      </div>
    </div>
  );
};
