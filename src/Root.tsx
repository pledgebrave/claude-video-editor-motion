import React from "react";
import { Composition } from "remotion";
import { MainComposition } from "./MainComposition";
import { COMP_DURATION, COMP_FPS, COMP_HEIGHT, COMP_WIDTH } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ClaudeEditorMotion"
      component={MainComposition}
      durationInFrames={COMP_DURATION}
      fps={COMP_FPS}
      width={COMP_WIDTH}
      height={COMP_HEIGHT}
    />
  );
};
