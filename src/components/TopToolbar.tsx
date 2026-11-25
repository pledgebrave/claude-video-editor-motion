import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONTS, LAYOUT } from "../theme";

export const EXPORT_BUTTON_CENTER = { x: 1204, y: 35 };

interface TopToolbarProps {
  frame: number;
  timecodeText: string;
}

export const TopToolbar: React.FC<TopToolbarProps> = ({ frame, timecodeText }) => {
  const isRendering = frame >= 722 && frame < 778;
  const isDone = frame >= 778;

  // Progress climbs 0 -> 90% (722..748), then stalls dramatically at 99.99% (748..778)
  let renderPctText = "导出";
  let fillPct = 0;
  if (isRendering) {
    if (frame < 746) {
      const p = Math.round(interpolate(frame, [722, 746], [12, 90], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
      renderPctText = `渲染中 ${p}%`;
      fillPct = p;
    } else {
      renderPctText = "渲染中 99.99%";
      fillPct = 99.5;
    }
  } else if (isDone) {
    renderPctText = "已完成 ✓";
    fillPct = 100;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: LAYOUT.toolbar.x,
        top: LAYOUT.toolbar.y,
        width: LAYOUT.toolbar.w,
        height: LAYOUT.toolbar.h,
        backgroundColor: COLORS.paper,
        border: `2.5px solid ${COLORS.ink}`,
        borderRadius: 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 14px",
        boxSizing: "border-box",
      }}
    >
      {/* Left: traffic lights + XiaoKe badge + project name */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: COLORS.coral, border: `2px solid ${COLORS.ink}` }} />
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: COLORS.gold, border: `2px solid ${COLORS.ink}` }} />
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: COLORS.teal, border: `2px solid ${COLORS.ink}` }} />
        </div>
        {/* Mini XiaoKe icon */}
        <svg width="24" height="24" viewBox="0 0 28 28">
          <rect x="3" y="3" width="22" height="22" rx="5" fill={COLORS.terracotta} stroke={COLORS.ink} strokeWidth="2.2" />
          <circle cx="10" cy="12" r="2" fill={COLORS.ink} />
          <circle cx="18" cy="12" r="2" fill={COLORS.ink} />
          <path d="M10 17 Q14 21 18 17" fill="none" stroke={COLORS.ink} strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span
          style={{
            fontFamily: FONTS.ui,
            fontSize: 13,
            fontWeight: 800,
            color: COLORS.ink,
          }}
        >
          小克剪辑_最终版_打死不改(3).mp4
        </span>
      </div>

      {/* Center: SMPTE Timecode + Auto-save */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            backgroundColor: COLORS.ink,
            color: "#FFFDF8",
            fontFamily: FONTS.mono,
            fontSize: 16,
            fontWeight: 700,
            padding: "4px 16px",
            borderRadius: 10,
            letterSpacing: 1.5,
          }}
        >
          {timecodeText}
        </div>
        <span
          style={{
            fontFamily: FONTS.ui,
            fontSize: 11,
            fontWeight: 600,
            color: COLORS.inkSoft,
          }}
        >
          ✓ 已自动保存
        </span>
      </div>

      {/* Right: 1080P + Export button */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            padding: "4px 10px",
            borderRadius: 8,
            border: `2px solid ${COLORS.ink}`,
            backgroundColor: COLORS.paperWarm,
            fontFamily: FONTS.mono,
            fontSize: 12,
            fontWeight: 700,
            color: COLORS.ink,
          }}
        >
          1080P
        </div>

        <div
          style={{
            position: "relative",
            width: isRendering ? 148 : 112,
            height: 32,
            borderRadius: 10,
            border: `2.5px solid ${COLORS.ink}`,
            backgroundColor: isDone ? COLORS.greenDone : isRendering ? COLORS.paperWarm : COLORS.teal,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: isDone ? "0 0 12px rgba(82, 183, 136, 0.55)" : "0 2px 0 rgba(43,38,35,0.18)",
          }}
        >
          {isRendering && (
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: `${fillPct}%`,
                backgroundColor: COLORS.gold,
                borderRight: `2px solid ${COLORS.ink}`,
              }}
            />
          )}
          <span
            style={{
              position: "relative",
              zIndex: 2,
              fontFamily: FONTS.ui,
              fontSize: 13,
              fontWeight: 800,
              color: isRendering ? COLORS.ink : "#FFFDF8",
              textShadow: isRendering ? "none" : "0 1px 0 rgba(0,0,0,0.2)",
              whiteSpace: "nowrap",
            }}
          >
            {isRendering || isDone ? renderPctText : "⬆ 导出"}
          </span>
        </div>
      </div>
    </div>
  );
};
