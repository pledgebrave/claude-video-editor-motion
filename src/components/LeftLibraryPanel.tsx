import React from "react";
import { COLORS, FONTS, LAYOUT } from "../theme";
import { NightCityArt, RamenArt, ShibaArt, XiaoKeDiscoArt } from "./ClipArtwork";

export const CLIP_CARD_CENTERS = {
  night: { x: 96, y: 162 },
  ramen: { x: 256, y: 162 },
  shiba: { x: 96, y: 252 },
  disco: { x: 256, y: 252 },
};

export const TRANSITION_CARD_CENTERS = [
  { x: 96, y: 164 },
  { x: 256, y: 164 },
  { x: 96, y: 238 },
  { x: 256, y: 238 },
];

export const TEXT_CARD_CENTERS = {
  highEnergy: { x: 180, y: 158 },
};

interface LeftLibraryPanelProps {
  frame: number;
}

export const LeftLibraryPanel: React.FC<LeftLibraryPanelProps> = ({ frame }) => {
  const activeTab: "media" | "transition" | "text" =
    frame < 248 ? "media" : frame < 350 ? "transition" : "text";

  const tabs: Array<{ key: "media" | "transition" | "text"; label: string }> = [
    { key: "media", label: "素材" },
    { key: "transition", label: "转场" },
    { key: "text", label: "文字" },
  ];

  const transitionItems = [
    { name: "闪白", bg: "#FFF2B2", symbol: "✦", color: "#E59D2C" },
    { name: "翻页", bg: "#E0F4F5", symbol: "📄", color: "#3A86FF" },
    { name: "故障", bg: "#FFE0E6", symbol: "⚡", color: "#E63946" },
    { name: "缩放", bg: "#D8F3DC", symbol: "⊕", color: "#2D6A4F" },
    { name: "滑动", bg: "#EDE7FF", symbol: "⇄", color: "#7209B7" },
    { name: "溶解", bg: "#FFEAD2", symbol: "◌", color: "#E76F51" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        left: LAYOUT.leftPanel.x,
        top: LAYOUT.leftPanel.y,
        width: LAYOUT.leftPanel.w,
        height: LAYOUT.leftPanel.h,
        backgroundColor: COLORS.paper,
        border: `2.5px solid ${COLORS.ink}`,
        borderRadius: 16,
        padding: 12,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {/* Tabs */}
      <div style={{ display: "flex", gap: 8 }}>
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <div
              key={tab.key}
              style={{
                flex: 1,
                height: 30,
                borderRadius: 10,
                border: `2px solid ${COLORS.ink}`,
                backgroundColor: isActive ? COLORS.gold : COLORS.paperWarm,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONTS.ui,
                fontSize: 13,
                fontWeight: isActive ? 800 : 600,
                color: COLORS.ink,
              }}
            >
              {tab.label}
            </div>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "media" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, flex: 1 }}>
          {[
            { name: "夜景.mp4", dur: "2.0s", art: <NightCityArt frame={frame} compact /> },
            { name: "拉面.mp4", dur: "4.0s", art: <RamenArt frame={frame} compact /> },
            { name: "柴犬.mp4", dur: "3.0s", art: <ShibaArt frame={frame} compact /> },
            { name: "小克蹦迪.mp4", dur: "3.0s", art: <XiaoKeDiscoArt frame={frame} compact /> },
          ].map((item) => (
            <div
              key={item.name}
              style={{
                border: `2px solid ${COLORS.ink}`,
                borderRadius: 10,
                backgroundColor: COLORS.paperWarm,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ position: "relative", height: 58, borderBottom: `2px solid ${COLORS.ink}` }}>
                {item.art}
                <div
                  style={{
                    position: "absolute",
                    right: 4,
                    bottom: 4,
                    padding: "1px 5px",
                    borderRadius: 6,
                    backgroundColor: "rgba(43,38,35,0.8)",
                    color: "#FFFDF8",
                    fontFamily: FONTS.mono,
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  {item.dur}
                </div>
              </div>
              <div
                style={{
                  padding: "3px 6px",
                  fontFamily: FONTS.ui,
                  fontSize: 11,
                  fontWeight: 700,
                  color: COLORS.ink,
                  textAlign: "center",
                }}
              >
                {item.name}
              </div>
            </div>
          ))}
          {[0, 1].map((slot) => (
            <div
              key={slot}
              style={{
                border: `2px dashed ${COLORS.inkSoft}`,
                borderRadius: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: COLORS.inkSoft,
                fontFamily: FONTS.ui,
                fontSize: 11,
                fontWeight: 600,
                height: 52,
              }}
            >
              <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
              <span>导入素材</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === "transition" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, flex: 1 }}>
          {transitionItems.map((tr) => (
            <div
              key={tr.name}
              style={{
                border: `2px solid ${COLORS.ink}`,
                borderRadius: 12,
                backgroundColor: tr.bg,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              <div style={{ fontSize: 22, color: tr.color, fontWeight: 900, lineHeight: 1 }}>{tr.symbol}</div>
              <div style={{ fontFamily: FONTS.ui, fontSize: 12, fontWeight: 800, color: COLORS.ink }}>{tr.name}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "text" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, justifyContent: "center" }}>
          <div
            style={{
              height: 62,
              borderRadius: 12,
              border: `2.5px solid ${COLORS.ink}`,
              backgroundColor: "#FFF5CC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FONTS.comic,
              fontSize: 24,
              fontWeight: 900,
              color: "#FF8C00",
              WebkitTextStroke: `1.2px ${COLORS.ink}`,
            }}
          >
            前方高能
          </div>
          <div
            style={{
              height: 62,
              borderRadius: 12,
              border: `2.5px solid ${COLORS.ink}`,
              backgroundColor: "#FFE8EC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FONTS.comic,
              fontSize: 22,
              fontWeight: 900,
              color: "#FF6B8B",
            }}
          >
            好耶~
          </div>
          <div
            style={{
              height: 62,
              borderRadius: 12,
              border: `2.5px solid ${COLORS.ink}`,
              backgroundColor: "#1E1B2E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FONTS.ui,
              fontSize: 20,
              fontWeight: 900,
              color: "#FF4DFF",
              textShadow: "0 0 8px #00F5D4",
            }}
          >
            霓虹 NEON
          </div>
        </div>
      )}
    </div>
  );
};
