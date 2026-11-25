import React from "react";
import { Easing, interpolate } from "remotion";
import { COLORS, FONTS, LAYOUT, RULER_MAX_SEC, secToTrackX } from "../theme";
import { NightCityArt, RamenArt, ShibaArt, XiaoKeDiscoArt } from "./ClipArtwork";

export const BEAT_BUTTON_CENTER = {
  x: LAYOUT.beatButton.x + LAYOUT.beatButton.w / 2,
  y: LAYOUT.beatButton.y + LAYOUT.beatButton.h / 2,
};

interface TimelinePanelProps {
  frame: number;
  playheadSec: number;
}

export const TimelinePanel: React.FC<TimelinePanelProps> = ({ frame, playheadSec }) => {
  // Visibility / drop-in timings for clips
  const nightProgress = interpolate(frame, [52, 66], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ramenProgress = interpolate(frame, [74, 88], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shibaProgress = interpolate(frame, [90, 102], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const discoProgress = interpolate(frame, [98, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bgmProgress = interpolate(frame, [112, 128], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Cut & ripple shift
  const cutLift = interpolate(frame, [196, 206], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rippleShift = interpolate(frame, [215, 236], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  const gapSec = 1.5;
  const shiftPx = rippleShift * (secToTrackX(gapSec) - secToTrackX(0));
  const showBlurryInTrack = frame < 205;

  // Transition badges on seams (added during f=272..316)
  const tr1On = frame >= 282;
  const tr2On = frame >= 298;
  const tr3On = frame >= 314;

  // Text clip
  const showTextClip = frame >= 368;
  const textClipFixed = frame >= 428;

  // Beat markers cascade left-to-right (f=620..662)
  const beatTimes: number[] = [];
  for (let s = 0.5; s <= 10.5; s += 0.5) {
    beatTimes.push(s);
  }
  const visibleBeatCount =
    frame < 620
      ? 0
      : Math.min(
          beatTimes.length,
          Math.floor(interpolate(frame, [620, 662], [0, beatTimes.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))
        );

  const pxPerSec = LAYOUT.trackVideo.w / RULER_MAX_SEC;
  const playheadX = secToTrackX(playheadSec);

  const clipCount = ramenProgress > 0.1 ? (discoProgress > 0.5 ? 4 : 2) : nightProgress > 0.1 ? 1 : 0;
  const totalDurText = rippleShift > 0.9 ? "0:10.5" : discoProgress > 0.5 ? "0:12.0" : "0:06.0";

  return (
    <div
      style={{
        position: "absolute",
        left: LAYOUT.timeline.x,
        top: LAYOUT.timeline.y,
        width: LAYOUT.timeline.w,
        height: LAYOUT.timeline.h,
        backgroundColor: COLORS.paper,
        border: `2.5px solid ${COLORS.ink}`,
        borderRadius: 16,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Top Time Ruler */}
      <div
        style={{
          position: "absolute",
          left: LAYOUT.ruler.x - LAYOUT.timeline.x,
          top: 4,
          width: LAYOUT.ruler.w,
          height: 24,
          borderBottom: "1.5px solid #E5DDD0",
        }}
      >
        {Array.from({ length: 9 }).map((_, idx) => {
          const sec = idx * 2;
          const x = sec * pxPerSec;
          const label = `0:${String(sec).padStart(2, "0")}`;
          return (
            <div key={sec} style={{ position: "absolute", left: x, top: 2 }}>
              <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.inkSoft, fontWeight: 700 }}>{label}</span>
              <div style={{ width: 1.5, height: 6, backgroundColor: COLORS.inkSoft, marginTop: 1 }} />
            </div>
          );
        })}
      </div>

      {/* Left Track Badges */}
      {[
        { y: 40, icon: "T", bg: "#FFF5CC" },
        { y: 94, icon: "▶", bg: "#E0F4F5" },
        { y: 184, icon: "♪", bg: "#EDE7FF" },
      ].map((t) => (
        <div
          key={t.icon}
          style={{
            position: "absolute",
            left: 16,
            top: t.y,
            width: 38,
            height: 38,
            borderRadius: 11,
            border: `2.2px solid ${COLORS.ink}`,
            backgroundColor: t.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONTS.ui,
            fontSize: 15,
            fontWeight: 900,
            color: COLORS.ink,
          }}
        >
          {t.icon}
        </div>
      ))}

      {/* Track Row Backgrounds */}
      <div
        style={{
          position: "absolute",
          left: LAYOUT.trackText.x - LAYOUT.timeline.x,
          top: LAYOUT.trackText.y - LAYOUT.timeline.y,
          width: LAYOUT.trackText.w,
          height: LAYOUT.trackText.h,
          backgroundColor: COLORS.paperWarm,
          borderRadius: 10,
          border: "1.5px solid #E5DDD0",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: LAYOUT.trackVideo.x - LAYOUT.timeline.x,
          top: LAYOUT.trackVideo.y - LAYOUT.timeline.y,
          width: LAYOUT.trackVideo.w,
          height: LAYOUT.trackVideo.h,
          backgroundColor: COLORS.paperWarm,
          borderRadius: 12,
          border: "1.5px solid #E5DDD0",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: LAYOUT.trackAudio.x - LAYOUT.timeline.x,
          top: LAYOUT.trackAudio.y - LAYOUT.timeline.y,
          width: LAYOUT.trackAudio.w,
          height: LAYOUT.trackAudio.h,
          backgroundColor: COLORS.paperWarm,
          borderRadius: 10,
          border: "1.5px solid #E5DDD0",
        }}
      />

      {/* TEXT CLIP */}
      {showTextClip && (
        <div
          style={{
            position: "absolute",
            left: LAYOUT.trackText.x - LAYOUT.timeline.x + 4.5 * pxPerSec,
            top: LAYOUT.trackText.y - LAYOUT.timeline.y + 4,
            width: 3.0 * pxPerSec,
            height: 32,
            borderRadius: 8,
            border: `2px solid ${COLORS.ink}`,
            backgroundColor: textClipFixed ? COLORS.gold : "#FFE082",
            display: "flex",
            alignItems: "center",
            padding: "0 10px",
            boxSizing: "border-box",
            fontFamily: FONTS.ui,
            fontSize: 12,
            fontWeight: 800,
            color: COLORS.ink,
          }}
        >
          T · {textClipFixed ? "前方高能预警" : "前方高能预"}
        </div>
      )}

      {/* VIDEO CLIPS */}
      {nightProgress > 0.05 && (
        <div
          style={{
            position: "absolute",
            left: LAYOUT.trackVideo.x - LAYOUT.timeline.x,
            top: LAYOUT.trackVideo.y - LAYOUT.timeline.y + 4 - (1 - nightProgress) * 28,
            width: 2.0 * pxPerSec,
            height: 70,
            borderRadius: 10,
            border: `2.5px solid ${COLORS.ink}`,
            overflow: "hidden",
            opacity: nightProgress,
          }}
        >
          <div style={{ display: "flex", width: "100%", height: "100%" }}>
            <div style={{ flex: 1 }}><NightCityArt frame={frame} compact /></div>
            <div style={{ flex: 1 }}><NightCityArt frame={frame} compact /></div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 5,
              top: 4,
              backgroundColor: "rgba(255,253,248,0.9)",
              border: `1.5px solid ${COLORS.ink}`,
              borderRadius: 6,
              padding: "1px 5px",
              fontFamily: FONTS.ui,
              fontSize: 10,
              fontWeight: 800,
              color: COLORS.ink,
            }}
          >
            夜景.mp4
          </div>
        </div>
      )}

      {/* Ramen Left */}
      {ramenProgress > 0.05 && (
        <div
          style={{
            position: "absolute",
            left: LAYOUT.trackVideo.x - LAYOUT.timeline.x + 2.0 * pxPerSec,
            top: LAYOUT.trackVideo.y - LAYOUT.timeline.y + 4 - (1 - ramenProgress) * 28,
            width: 1.25 * pxPerSec,
            height: 70,
            borderRadius: showBlurryInTrack ? "10px 0 0 10px" : "10px 0 0 10px",
            border: `2.5px solid ${COLORS.ink}`,
            borderRight: showBlurryInTrack ? "none" : `1.5px solid ${COLORS.ink}`,
            overflow: "hidden",
            opacity: ramenProgress,
          }}
        >
          <RamenArt frame={frame} compact />
          <div
            style={{
              position: "absolute",
              left: 5,
              top: 4,
              backgroundColor: "rgba(255,253,248,0.92)",
              border: `1.5px solid ${COLORS.ink}`,
              borderRadius: 6,
              padding: "1px 5px",
              fontFamily: FONTS.ui,
              fontSize: 10,
              fontWeight: 800,
              color: COLORS.ink,
            }}
          >
            拉面.mp4
          </div>
        </div>
      )}

      {/* Ramen Blurry Middle Slice (before cut eject) */}
      {ramenProgress > 0.3 && showBlurryInTrack && (
        <div
          style={{
            position: "absolute",
            left: LAYOUT.trackVideo.x - LAYOUT.timeline.x + 3.25 * pxPerSec,
            top: LAYOUT.trackVideo.y - LAYOUT.timeline.y + 4 - cutLift * 8,
            width: 1.5 * pxPerSec,
            height: 70,
            borderTop: `2.5px solid ${frame >= 165 ? "#E63946" : COLORS.ink}`,
            borderBottom: `2.5px solid ${frame >= 165 ? "#E63946" : COLORS.ink}`,
            borderLeft: `2px dashed ${COLORS.ink}`,
            borderRight: `2px dashed ${COLORS.ink}`,
            overflow: "hidden",
            background: "repeating-linear-gradient(135deg, #5C6066, #5C6066 10px, #777B82 10px, #777B82 20px)",
            opacity: ramenProgress,
          }}
        >
          <div style={{ width: "100%", height: "100%", opacity: 0.45 }}>
            <RamenArt frame={frame} compact blurry />
          </div>
        </div>
      )}

      {/* Ramen Right */}
      {ramenProgress > 0.05 && (
        <div
          style={{
            position: "absolute",
            left: LAYOUT.trackVideo.x - LAYOUT.timeline.x + 4.75 * pxPerSec - shiftPx,
            top: LAYOUT.trackVideo.y - LAYOUT.timeline.y + 4 - (1 - ramenProgress) * 28,
            width: 1.25 * pxPerSec,
            height: 70,
            borderRadius: "0 10px 10px 0",
            border: `2.5px solid ${COLORS.ink}`,
            borderLeft: showBlurryInTrack ? "none" : `1.5px solid ${COLORS.ink}`,
            overflow: "hidden",
            opacity: ramenProgress,
          }}
        >
          <RamenArt frame={frame} compact />
        </div>
      )}

      {/* Shiba Clip */}
      {shibaProgress > 0.05 && (
        <div
          style={{
            position: "absolute",
            left: LAYOUT.trackVideo.x - LAYOUT.timeline.x + 6.0 * pxPerSec - shiftPx,
            top: LAYOUT.trackVideo.y - LAYOUT.timeline.y + 4 - (1 - shibaProgress) * 28,
            width: 3.0 * pxPerSec,
            height: 70,
            borderRadius: 10,
            border: `2.5px solid ${COLORS.ink}`,
            overflow: "hidden",
            opacity: shibaProgress,
          }}
        >
          <div style={{ display: "flex", width: "100%", height: "100%" }}>
            <div style={{ flex: 1 }}><ShibaArt frame={frame} compact /></div>
            <div style={{ flex: 1 }}><ShibaArt frame={frame} compact /></div>
            <div style={{ flex: 1 }}><ShibaArt frame={frame} compact /></div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 5,
              top: 4,
              backgroundColor: "rgba(255,253,248,0.9)",
              border: `1.5px solid ${COLORS.ink}`,
              borderRadius: 6,
              padding: "1px 5px",
              fontFamily: FONTS.ui,
              fontSize: 10,
              fontWeight: 800,
              color: COLORS.ink,
            }}
          >
            柴犬.mp4
          </div>
        </div>
      )}

      {/* XiaoKe Disco Clip */}
      {discoProgress > 0.05 && (
        <div
          style={{
            position: "absolute",
            left: LAYOUT.trackVideo.x - LAYOUT.timeline.x + 9.0 * pxPerSec - shiftPx,
            top: LAYOUT.trackVideo.y - LAYOUT.timeline.y + 4 - (1 - discoProgress) * 28,
            width: 3.0 * pxPerSec,
            height: 70,
            borderRadius: 10,
            border: `2.5px solid ${COLORS.ink}`,
            overflow: "hidden",
            opacity: discoProgress,
          }}
        >
          <div style={{ display: "flex", width: "100%", height: "100%" }}>
            <div style={{ flex: 1 }}><XiaoKeDiscoArt frame={frame} compact /></div>
            <div style={{ flex: 1 }}><XiaoKeDiscoArt frame={frame} compact /></div>
            <div style={{ flex: 1 }}><XiaoKeDiscoArt frame={frame} compact /></div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 5,
              top: 4,
              backgroundColor: "rgba(255,253,248,0.92)",
              border: `1.5px solid ${COLORS.ink}`,
              borderRadius: 6,
              padding: "1px 5px",
              fontFamily: FONTS.ui,
              fontSize: 10,
              fontWeight: 800,
              color: COLORS.ink,
            }}
          >
            小克蹦迪.mp4
          </div>
        </div>
      )}

      {/* Transition Seam Badges */}
      {[
        { show: tr1On, sec: 2.0, symbol: "✦", bg: "#FFF2B2" },
        { show: tr2On, sec: 4.5, symbol: "⊕", bg: "#D8F3DC" },
        { show: tr3On, sec: 7.5, symbol: "⇄", bg: "#EDE7FF" },
      ].map((badge, idx) =>
        badge.show ? (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: LAYOUT.trackVideo.x - LAYOUT.timeline.x + badge.sec * pxPerSec - 13,
              top: LAYOUT.trackVideo.y - LAYOUT.timeline.y + 26,
              width: 26,
              height: 26,
              borderRadius: "50%",
              backgroundColor: badge.bg,
              border: `2.2px solid ${COLORS.ink}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 900,
              color: COLORS.ink,
              zIndex: 8,
            }}
          >
            {badge.symbol}
          </div>
        ) : null
      )}

      {/* AUDIO WAVEFORM BAR */}
      {bgmProgress > 0.05 && (
        <div
          style={{
            position: "absolute",
            left: LAYOUT.trackAudio.x - LAYOUT.timeline.x,
            top: LAYOUT.trackAudio.y - LAYOUT.timeline.y + 4,
            width: 10.5 * pxPerSec * bgmProgress,
            height: 42,
            borderRadius: 10,
            border: `2.2px solid ${COLORS.ink}`,
            backgroundColor: "#DDD6FE",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* SVG Waveform */}
          <svg width="100%" height="36" viewBox="0 0 760 36" preserveAspectRatio="none">
            {Array.from({ length: 84 }).map((_, i) => {
              const amp = 6 + ((Math.sin(i * 0.7) + 1) * 0.5) * 20;
              return (
                <rect
                  key={i}
                  x={i * 9 + 2}
                  y={18 - amp / 2}
                  width="5"
                  height={amp}
                  rx="2.5"
                  fill={COLORS.lavenderDeep}
                  opacity={0.78}
                />
              );
            })}
          </svg>
          <div
            style={{
              position: "absolute",
              left: 8,
              top: 3,
              backgroundColor: "rgba(255,253,248,0.88)",
              borderRadius: 5,
              padding: "1px 6px",
              fontFamily: FONTS.mono,
              fontSize: 10,
              fontWeight: 800,
              color: COLORS.ink,
            }}
          >
            ♪ bgm_小克.wav
          </div>
        </div>
      )}

      {/* BEAT SYNC BUTTON (▼ 卡点) */}
      <div
        style={{
          position: "absolute",
          left: LAYOUT.beatButton.x - LAYOUT.timeline.x,
          top: LAYOUT.beatButton.y - LAYOUT.timeline.y,
          width: LAYOUT.beatButton.w,
          height: LAYOUT.beatButton.h,
          borderRadius: 11,
          border: `2.2px solid ${COLORS.ink}`,
          backgroundColor: frame >= 618 ? COLORS.gold : "#FFF3C4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          fontFamily: FONTS.ui,
          fontSize: 13,
          fontWeight: 900,
          color: COLORS.ink,
          boxShadow: frame >= 618 && frame < 665 ? "0 0 12px rgba(244, 196, 78, 0.8)" : "none",
        }}
      >
        <span>▼</span>
        <span>卡点</span>
      </div>

      {/* BEAT MARKER TRIANGLES */}
      {beatTimes.slice(0, visibleBeatCount).map((bt, idx) => {
        const bx = LAYOUT.trackAudio.x - LAYOUT.timeline.x + bt * pxPerSec;
        const passed = playheadSec >= bt;
        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: bx - 6,
              top: LAYOUT.beatDotsY - LAYOUT.timeline.y,
              fontSize: 13,
              lineHeight: 1,
              color: passed ? "#FF9F1C" : COLORS.goldDeep,
              textShadow: passed ? "0 0 6px rgba(255, 159, 28, 0.9)" : "none",
            }}
          >
            ▼
          </div>
        );
      })}

      {/* VERTICAL PLAYHEAD */}
      <div
        style={{
          position: "absolute",
          left: playheadX - LAYOUT.timeline.x,
          top: 8,
          bottom: 34,
          width: 2.5,
          backgroundColor: COLORS.redPlayhead,
          zIndex: 20,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -7,
            top: -4,
            width: 16,
            height: 16,
            borderRadius: "4px 4px 8px 8px",
            backgroundColor: COLORS.redPlayhead,
            border: `2px solid ${COLORS.ink}`,
          }}
        />
      </div>

      {/* BOTTOM FOOTER */}
      <div
        style={{
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 8,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: FONTS.ui,
          fontSize: 11,
          fontWeight: 700,
          color: COLORS.inkSoft,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span>-</span>
          <div style={{ width: 96, height: 5, borderRadius: 99, backgroundColor: "#E5DDD0", position: "relative" }}>
            <div
              style={{
                position: "absolute",
                left: 38,
                top: -4,
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: COLORS.paper,
                border: `2px solid ${COLORS.ink}`,
              }}
            />
          </div>
          <span>+</span>
        </div>
        <div style={{ fontFamily: FONTS.mono }}>
          片段 {clipCount} · 总时长 {totalDurText}
        </div>
      </div>
    </div>
  );
};
