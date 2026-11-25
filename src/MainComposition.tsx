import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COLORS } from "./theme";
import { CodeIntroWindow } from "./components/CodeIntroWindow";
import { TopToolbar } from "./components/TopToolbar";
import { LeftLibraryPanel } from "./components/LeftLibraryPanel";
import { PhonePreview } from "./components/PhonePreview";
import { InspectorPanel } from "./components/InspectorPanel";
import { TimelinePanel } from "./components/TimelinePanel";
import { MascotXiaoKe } from "./components/MascotXiaoKe";
import { ComicEffects } from "./components/ComicEffects";
import { FinaleMemoCard } from "./components/FinaleMemoCard";

function getPlayheadSec(frame: number): number {
  if (frame < 62) return 0;
  if (frame < 138) return interpolate(frame, [62, 138], [0.2, 2.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (frame < 196) return interpolate(frame, [138, 196], [2.6, 3.95], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (frame < 246) return interpolate(frame, [196, 246], [3.95, 2.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (frame < 348) return interpolate(frame, [246, 348], [1.6, 6.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (frame < 465) return interpolate(frame, [348, 465], [5.1, 6.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (frame < 595) return interpolate(frame, [465, 595], [7.6, 9.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (frame < 695) return interpolate(frame, [595, 695], [7.8, 10.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return 10.4;
}

function getCameraRig(frame: number): { scale: number; tx: number; ty: number } {
  const ease = Easing.bezier(0.22, 1, 0.36, 1);

  // Subtle camera pan & zoom across key editing moments
  if (frame < 40) return { scale: 1, tx: 0, ty: 0 };
  if (frame >= 44 && frame < 140) {
    const p = interpolate(frame, [44, 62, 128, 140], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
    return { scale: 1 + 0.1 * p, tx: 46 * p, ty: -14 * p };
  }
  if (frame >= 150 && frame < 244) {
    const p = interpolate(frame, [150, 168, 232, 244], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
    return { scale: 1 + 0.14 * p, tx: 36 * p, ty: -38 * p };
  }
  if (frame >= 398 && frame < 464) {
    const p = interpolate(frame, [398, 412, 452, 464], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
    return { scale: 1 + 0.12 * p, tx: 32 * p, ty: -22 * p };
  }
  if (frame >= 466 && frame < 595) {
    const p = interpolate(frame, [466, 484, 580, 595], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
    return { scale: 1 + 0.1 * p, tx: -36 * p, ty: 14 * p };
  }
  if (frame >= 698 && frame < 802) {
    const p = interpolate(frame, [698, 718, 790, 802], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
    return { scale: 1 + 0.1 * p, tx: -38 * p, ty: 24 * p };
  }
  return { scale: 1, tx: 0, ty: 0 };
}

function formatTimecode(frame: number): string {
  const sec = Math.floor(frame / 30);
  const ff = frame % 30;
  return `00:00:${String(sec).padStart(2, "0")}:${String(ff).padStart(2, "0")}`;
}

export const MainComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const playheadSec = getPlayheadSec(frame);
  const cam = getCameraRig(frame);

  const editorOpacity = interpolate(frame, [28, 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const finaleDimOpacity = interpolate(frame, [804, 822], [0, 0.45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const hasNight = frame >= 56;
  const hasRamen = frame >= 78;
  const isPostCut = frame >= 215;
  const hasTransitions = frame >= 282;
  const textState: "none" | "typo" | "fixed" =
    frame < 368 ? "none" : frame < 428 ? "typo" : "fixed";

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgCream, overflow: "hidden" }}>
      {/* Audio Tracks */}
      <Audio src={staticFile("audio/bgm.wav")} volume={0.75} />
      <Audio src={staticFile("audio/sfx-track.wav")} volume={0.9} />

      {/* Editor UI Stage with Virtual Camera Rig */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: editorOpacity,
          transform: `translate(${cam.tx}px, ${cam.ty}px) scale(${cam.scale})`,
          transformOrigin: "center center",
        }}
      >
        <TopToolbar frame={frame} timecodeText={formatTimecode(frame)} />
        <LeftLibraryPanel frame={frame} />
        <InspectorPanel frame={frame} />
        <TimelinePanel frame={frame} playheadSec={playheadSec} />

        {/* Soft scrim over background editor during Finale */}
        {finaleDimOpacity > 0 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: COLORS.bgCream,
              opacity: finaleDimOpacity,
              zIndex: 25,
            }}
          />
        )}

        <PhonePreview
          frame={frame}
          playheadSec={playheadSec}
          hasNight={hasNight}
          hasRamen={hasRamen}
          isPostCut={isPostCut}
          hasTransitions={hasTransitions}
          textState={textState}
        />

        <FinaleMemoCard frame={frame} />
        <MascotXiaoKe frame={frame} />
        <ComicEffects frame={frame} />
      </div>

      {/* Act 1: Code Intro Window */}
      <CodeIntroWindow frame={frame} />
    </AbsoluteFill>
  );
};
