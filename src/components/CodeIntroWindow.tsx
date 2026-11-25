import React from "react";
import { Easing, interpolate } from "remotion";
import { COLORS, FONTS } from "../theme";

interface CodeIntroWindowProps {
  frame: number;
}

export const CodeIntroWindow: React.FC<CodeIntroWindowProps> = ({ frame }) => {
  if (frame > 42) return null;

  const line1Full = "const 剪辑软件 = 小克.写代码()";
  const line2Full = "剪辑软件.画出(时间轴, 预览, 面板)";

  const chars1 = Math.floor(
    interpolate(frame, [2, 13], [0, line1Full.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const chars2 = Math.floor(
    interpolate(frame, [13, 27], [0, line2Full.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const expandProgress = interpolate(frame, [29, 41], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  const scale = interpolate(expandProgress, [0, 1], [1, 1.45]);
  const opacity = interpolate(expandProgress, [0, 0.65, 1], [1, 0.9, 0]);
  const cursorVisible = frame < 30 || Math.floor(frame / 4) % 2 === 0;

  const shown1 = line1Full.slice(0, chars1);
  const shown2 = line2Full.slice(0, chars2);

  const renderLine1 = (text: string) => {
    const kw = "const ";
    if (text.length <= kw.length) {
      return <span style={{ color: "#C85A32", fontWeight: 700 }}>{text}</span>;
    }
    const rest = text.slice(kw.length);
    const eqIdx = rest.indexOf("=");
    if (eqIdx === -1) {
      return (
        <>
          <span style={{ color: "#C85A32", fontWeight: 700 }}>{kw}</span>
          <span style={{ color: "#2B6CB0" }}>{rest}</span>
        </>
      );
    }
    const varName = rest.slice(0, eqIdx);
    const rhs = rest.slice(eqIdx);
    return (
      <>
        <span style={{ color: "#C85A32", fontWeight: 700 }}>{kw}</span>
        <span style={{ color: "#2B6CB0", fontWeight: 600 }}>{varName}</span>
        <span style={{ color: COLORS.ink }}>{rhs}</span>
      </>
    );
  };

  const renderLine2 = (text: string) => {
    const parenIdx = text.indexOf("(");
    if (parenIdx === -1) {
      return <span style={{ color: "#2B6CB0" }}>{text}</span>;
    }
    const head = text.slice(0, parenIdx + 1);
    const tail = text.slice(parenIdx + 1);
    return (
      <>
        <span style={{ color: "#2B6CB0" }}>{head}</span>
        <span style={{ color: "#2A7B5C", fontWeight: 600 }}>{tail}</span>
      </>
    );
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: COLORS.bgCream,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        zIndex: 40,
      }}
    >
      <div
        style={{
          width: 686,
          height: 196,
          backgroundColor: COLORS.paper,
          border: `3px solid ${COLORS.ink}`,
          borderRadius: 16,
          boxShadow: "0 10px 0 rgba(43, 38, 35, 0.08)",
          overflow: "hidden",
          scale: String(scale),
        }}
      >
        {/* Title bar */}
        <div
          style={{
            height: 38,
            backgroundColor: COLORS.panelHeader,
            borderBottom: `2.5px solid ${COLORS.ink}`,
            display: "flex",
            alignItems: "center",
            padding: "0 14px",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: COLORS.coral, border: `2px solid ${COLORS.ink}` }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: COLORS.gold, border: `2px solid ${COLORS.ink}` }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: COLORS.teal, border: `2px solid ${COLORS.ink}` }} />
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily: FONTS.ui,
              fontSize: 13,
              fontWeight: 700,
              color: COLORS.inkMuted,
            }}
          >
            小克的代码编辑器
          </div>
        </div>

        {/* Code Body */}
        <div
          style={{
            padding: "22px 26px",
            fontFamily: FONTS.mono,
            fontSize: 22,
            lineHeight: 1.7,
            color: COLORS.ink,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ width: 32, fontSize: 15, color: COLORS.inkSoft, userSelect: "none" }}>1</span>
            <span>{renderLine1(shown1)}</span>
            {frame < 13 && cursorVisible && (
              <span
                style={{
                  display: "inline-block",
                  width: 11,
                  height: 24,
                  backgroundColor: COLORS.coral,
                  marginLeft: 3,
                  borderRadius: 2,
                }}
              />
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 4 }}>
            <span style={{ width: 32, fontSize: 15, color: COLORS.inkSoft, userSelect: "none" }}>2</span>
            <span>{renderLine2(shown2)}</span>
            {frame >= 13 && cursorVisible && (
              <span
                style={{
                  display: "inline-block",
                  width: 11,
                  height: 24,
                  backgroundColor: COLORS.coral,
                  marginLeft: 3,
                  borderRadius: 2,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
