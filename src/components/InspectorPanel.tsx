import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONTS, LAYOUT } from "../theme";

export interface InspectorState {
  sparklePct: number; // 0..100
  saturationPct: number; // 0..200 (100 = normal, 200 = 爆表!!)
  zoomImpactPct: number; // 0..100
  speedLabel: string;
  isOverdrive: boolean;
  saturationLabel: string;
  activeSliderIndex: number | null; // 0=闪光, 1=饱和度, 2=缩放冲击
  activeKnobPos: { x: number; y: number } | null;
}

const SLIDER_TRACK_LEFT = LAYOUT.inspector.x + 20;
const SLIDER_TRACK_WIDTH = LAYOUT.inspector.w - 40;
const SLIDER_ROW_Y = [148, 208, 268, 328];

export function getInspectorState(frame: number): InspectorState {
  // Sparkle: 0 -> 56 -> 70 -> 90
  let sparklePct = 0;
  if (frame >= 472 && frame < 498) {
    sparklePct = interpolate(frame, [472, 498], [0, 70], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  } else if (frame >= 498 && frame < 556) {
    sparklePct = 70;
  } else if (frame >= 556 && frame < 572) {
    sparklePct = interpolate(frame, [556, 572], [70, 90], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  } else if (frame >= 572) {
    sparklePct = 90;
  }

  // Saturation: 100 -> 200 (爆表!!) during 500..536 -> drops to 123 -> 110
  let saturationPct = 100;
  if (frame >= 500 && frame < 512) {
    saturationPct = interpolate(frame, [500, 512], [100, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  } else if (frame >= 512 && frame < 536) {
    saturationPct = 200;
  } else if (frame >= 536 && frame < 556) {
    saturationPct = interpolate(frame, [536, 556], [200, 110], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  } else if (frame >= 556) {
    saturationPct = 110;
  }

  // Zoom Impact: 0 -> 60 during 572..594
  let zoomImpactPct = 0;
  if (frame >= 572 && frame < 594) {
    zoomImpactPct = interpolate(frame, [572, 594], [0, 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  } else if (frame >= 594) {
    zoomImpactPct = 60;
  }

  const isOverdrive = frame >= 508 && frame < 538;
  const saturationLabel = saturationPct >= 185 ? "爆表!!" : `${Math.round(saturationPct)}%`;

  let activeSliderIndex: number | null = null;
  let ratio = 0;
  if (frame >= 472 && frame < 500) {
    activeSliderIndex = 0;
    ratio = sparklePct / 100;
  } else if (frame >= 500 && frame < 556) {
    activeSliderIndex = 1;
    ratio = saturationPct / 200;
  } else if (frame >= 556 && frame < 572) {
    activeSliderIndex = 0;
    ratio = sparklePct / 100;
  } else if (frame >= 572 && frame < 596) {
    activeSliderIndex = 2;
    ratio = zoomImpactPct / 100;
  }

  const activeKnobPos =
    activeSliderIndex !== null
      ? {
          x: SLIDER_TRACK_LEFT + ratio * SLIDER_TRACK_WIDTH,
          y: SLIDER_ROW_Y[activeSliderIndex],
        }
      : null;

  return {
    sparklePct,
    saturationPct,
    zoomImpactPct,
    speedLabel: "1.0x",
    isOverdrive,
    saturationLabel,
    activeSliderIndex,
    activeKnobPos,
  };
}

interface InspectorPanelProps {
  frame: number;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({ frame }) => {
  const st = getInspectorState(frame);

  const sliders = [
    {
      label: "闪光",
      valueText: `${Math.round(st.sparklePct)}%`,
      ratio: st.sparklePct / 100,
      fill: COLORS.gold,
      rainbow: false,
      overdrive: false,
    },
    {
      label: "饱和度",
      valueText: st.saturationLabel,
      ratio: st.saturationPct / 200,
      fill: COLORS.teal,
      rainbow: st.isOverdrive,
      overdrive: st.isOverdrive,
    },
    {
      label: "缩放冲击",
      valueText: `${Math.round(st.zoomImpactPct)}%`,
      ratio: st.zoomImpactPct / 100,
      fill: COLORS.teal,
      rainbow: false,
      overdrive: false,
    },
    {
      label: "速度",
      valueText: st.speedLabel,
      ratio: 0.45,
      fill: COLORS.teal,
      rainbow: false,
      overdrive: false,
    },
  ];

  return (
    <div
      style={{
        position: "absolute",
        left: LAYOUT.inspector.x,
        top: LAYOUT.inspector.y,
        width: LAYOUT.inspector.w,
        height: LAYOUT.inspector.h,
        backgroundColor: COLORS.paper,
        border: `2.5px solid ${COLORS.ink}`,
        borderRadius: 16,
        padding: "14px 18px",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontFamily: FONTS.ui,
          fontSize: 18,
          fontWeight: 900,
          color: COLORS.ink,
          marginBottom: 14,
          paddingBottom: 8,
          borderBottom: `2px dashed #E5DDD0`,
        }}
      >
        <span>调整</span>
        <span style={{ color: COLORS.goldDeep, fontSize: 18 }}>✦</span>
      </div>

      {/* Sliders */}
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {sliders.map((sl, idx) => (
          <div key={sl.label}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
              <span style={{ fontFamily: FONTS.ui, fontSize: 13, fontWeight: 700, color: COLORS.ink }}>
                {sl.label}
              </span>
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 12,
                  fontWeight: 800,
                  color: sl.overdrive ? "#E63946" : COLORS.inkMuted,
                  backgroundColor: sl.overdrive ? "#FFE3E3" : "transparent",
                  padding: sl.overdrive ? "1px 6px" : 0,
                  borderRadius: 6,
                  border: sl.overdrive ? `1.5px solid #E63946` : "none",
                }}
              >
                {sl.valueText}
              </span>
            </div>

            <div
              style={{
                position: "relative",
                height: 10,
                borderRadius: 999,
                border: `2px solid ${COLORS.ink}`,
                backgroundColor: "#EFE9DC",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${Math.max(2, Math.min(100, sl.ratio * 100))}%`,
                  borderRadius: 999,
                  background: sl.rainbow
                    ? "linear-gradient(90deg, #FF595E, #FFCA3A, #8AC926, #1982C4, #6A4C93)"
                    : sl.fill,
                }}
              />
              {/* Thumb */}
              <div
                style={{
                  position: "absolute",
                  left: `calc(${Math.max(2, Math.min(98, sl.ratio * 100))}% - 9px)`,
                  top: -6,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  backgroundColor: st.activeSliderIndex === idx && sl.overdrive ? "#FFE066" : COLORS.paper,
                  border: `2.5px solid ${COLORS.ink}`,
                  boxShadow: sl.overdrive ? "0 0 10px rgba(230, 57, 70, 0.7)" : "0 1px 0 rgba(0,0,0,0.2)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
