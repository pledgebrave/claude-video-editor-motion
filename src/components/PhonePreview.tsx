import React from "react";
import { Easing, interpolate } from "remotion";
import { COLORS, FONTS, LAYOUT } from "../theme";
import { NightCityArt, RamenArt, ShibaArt, XiaoKeDiscoArt } from "./ClipArtwork";
import { getInspectorState } from "./InspectorPanel";

interface PhonePreviewProps {
  frame: number;
  playheadSec: number;
  hasNight: boolean;
  hasRamen: boolean;
  isPostCut: boolean;
  hasTransitions: boolean;
  textState: "none" | "typo" | "fixed";
}

export const PhonePreview: React.FC<PhonePreviewProps> = ({
  frame,
  playheadSec,
  hasNight,
  hasRamen,
  isPostCut,
  hasTransitions,
  textState,
}) => {
  const inspector = getInspectorState(frame);
  const isFinale = frame >= 804;

  const finaleProgress = interpolate(frame, [804, 822], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  const phoneScale = isFinale ? interpolate(finaleProgress, [0, 1], [1, 1.24]) : 1;
  const phoneTranslateY = isFinale ? interpolate(finaleProgress, [0, 1], [0, 52]) : 0;

  // Determine active clip inside phone screen
  const isPlayingDim = frame >= 538 && frame < 556;
  const beatPulse =
    inspector.zoomImpactPct > 10 && playheadSec >= 7.5
      ? 1 + 0.14 * Math.pow(Math.max(0, Math.sin((frame - 570) * 0.48)), 4)
      : 1;

  const renderScreenContent = () => {
    if (!hasNight) {
      return <div style={{ width: "100%", height: "100%", backgroundColor: "#141312" }} />;
    }

    if (isFinale) {
      const fLocal = frame - 804;
      const showDiscoFinale = fLocal >= 30;
      return (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          {showDiscoFinale ? (
            <XiaoKeDiscoArt
              frame={frame}
              sparkleIntensity={0.9}
              discoZoom={1 + 0.08 * Math.pow(Math.max(0, Math.sin(frame * 0.48)), 4)}
            />
          ) : (
            <RamenArt frame={frame} />
          )}

          {showDiscoFinale && (
            <div
              style={{
                position: "absolute",
                top: 66,
                left: 0,
                right: 0,
                textAlign: "center",
                fontFamily: FONTS.comic,
                fontSize: 28,
                fontWeight: 900,
                color: COLORS.gold,
                WebkitTextStroke: `1.5px ${COLORS.ink}`,
                textShadow: "0 3px 0 #2B2623",
                rotate: "-3deg",
              }}
            >
              拿捏了!
            </div>
          )}

          {/* Right social engagement column */}
          <div
            style={{
              position: "absolute",
              right: 8,
              bottom: 54,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              color: "#FFFDF8",
              fontFamily: FONTS.ui,
              fontSize: 10,
              fontWeight: 800,
              textShadow: "0 1px 3px rgba(0,0,0,0.8)",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18, color: "#FF5C8A", lineHeight: 1 }}>♥</div>
              <div>10.2w</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 16, lineHeight: 1 }}>💬</div>
              <div>2333</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 16, lineHeight: 1 }}>↗</div>
              <div>分享</div>
            </div>
          </div>

          {/* Bottom creator caption */}
          <div
            style={{
              position: "absolute",
              left: 8,
              right: 42,
              bottom: 10,
              color: "#FFFDF8",
              fontFamily: FONTS.ui,
              textShadow: "0 1px 3px rgba(0,0,0,0.85)",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800 }}>@小克 · Opus 5.5</div>
            <div style={{ fontSize: 9, opacity: 0.9, marginTop: 2 }}>♪ 原创音轨 · 小克 @code2video</div>
          </div>
        </div>
      );
    }

    // Active editing timeline playback
    const ramenEnd = isPostCut ? 4.5 : 6.0;
    const shibaEnd = isPostCut ? 7.5 : 9.0;

    let clipNode: React.ReactNode = <NightCityArt frame={frame} />;
    if (hasRamen && playheadSec >= 2.0 && playheadSec < ramenEnd) {
      const isBlurryZone = !isPostCut && playheadSec >= 3.2 && playheadSec <= 4.7;
      clipNode = <RamenArt frame={frame} blurry={isBlurryZone} />;
    } else if (hasRamen && playheadSec >= ramenEnd && playheadSec < shibaEnd) {
      clipNode = <ShibaArt frame={frame} />;
    } else if (hasRamen && playheadSec >= shibaEnd) {
      clipNode = (
        <XiaoKeDiscoArt
          frame={frame}
          sparkleIntensity={inspector.sparklePct / 100}
          discoZoom={beatPulse}
          overdrive={inspector.isOverdrive}
        />
      );
    }

    // Flash transition effect near seam boundaries
    const nearSeam =
      hasTransitions &&
      (Math.abs(playheadSec - 2.0) < 0.14 || Math.abs(playheadSec - ramenEnd) < 0.14 || Math.abs(playheadSec - shibaEnd) < 0.14);

    return (
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        {clipNode}

        {nearSeam && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(255, 253, 248, 0.72)",
            }}
          />
        )}

        {/* Dim dip during saturation pull-back */}
        {isPlayingDim && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(20, 18, 25, 0.42)",
            }}
          />
        )}

        {/* Caption overlay on Shiba clip */}
        {playheadSec >= ramenEnd && playheadSec < shibaEnd && textState !== "none" && (
          <div
            style={{
              position: "absolute",
              left: 8,
              right: 8,
              bottom: 18,
              textAlign: "center",
              fontFamily: FONTS.comic,
              fontSize: 22,
              fontWeight: 900,
              color: textState === "typo" ? "#FFE066" : COLORS.gold,
              WebkitTextStroke: `1.2px ${COLORS.ink}`,
              textShadow: "0 2px 0 #2B2623",
              letterSpacing: 1,
            }}
          >
            {textState === "typo" ? "前方高能预" : "前方高能预警"}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        position: "absolute",
        left: LAYOUT.phone.x,
        top: LAYOUT.phone.y,
        width: LAYOUT.phone.w,
        height: LAYOUT.phone.h,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: `translateY(${phoneTranslateY}px) scale(${phoneScale})`,
        transformOrigin: "center top",
        zIndex: isFinale ? 32 : 12,
      }}
    >
      {/* Phone Bezel */}
      <div
        style={{
          width: 196,
          height: 286,
          borderRadius: 28,
          backgroundColor: COLORS.ink,
          padding: "16px 10px 14px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "0 8px 0 rgba(43,38,35,0.14)",
        }}
      >
        {/* Speaker notch */}
        <div
          style={{
            width: 44,
            height: 5,
            borderRadius: 999,
            backgroundColor: "#4A433E",
            marginBottom: 8,
          }}
        />
        {/* Screen */}
        <div
          style={{
            width: "100%",
            flex: 1,
            borderRadius: 16,
            overflow: "hidden",
            backgroundColor: "#141312",
            position: "relative",
          }}
        >
          {renderScreenContent()}
        </div>
      </div>

      {/* Transport Controls */}
      {!isFinale && (
        <div
          style={{
            marginTop: 8,
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: COLORS.ink,
            fontFamily: FONTS.ui,
            fontSize: 12,
            fontWeight: 800,
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              border: `2px solid ${COLORS.ink}`,
              backgroundColor: COLORS.paper,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ⏮
          </div>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: `2px solid ${COLORS.ink}`,
              backgroundColor: COLORS.paper,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {hasNight ? "⏸" : "▶"}
          </div>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              border: `2px solid ${COLORS.ink}`,
              backgroundColor: COLORS.paper,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ⏭
          </div>
        </div>
      )}
    </div>
  );
};
