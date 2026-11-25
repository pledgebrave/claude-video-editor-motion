export const COMP_WIDTH = 1280;
export const COMP_HEIGHT = 720;
export const COMP_FPS = 30;
export const COMP_DURATION = 900; // 30.0s

export const COLORS = {
  bgCream: "#F6F2E9",
  paper: "#FFFDF8",
  paperWarm: "#F9F4E8",
  panelHeader: "#F3EDE0",
  ink: "#2B2623",
  inkMuted: "#6F655C",
  inkSoft: "#9C9187",
  terracotta: "#D97757",
  terracottaDark: "#B9593B",
  blush: "#F29C85",
  gold: "#F4C44E",
  goldDeep: "#E59D2C",
  teal: "#4FB3BF",
  mint: "#74C69D",
  greenDone: "#52B788",
  coral: "#E76F51",
  redPlayhead: "#E63946",
  lavender: "#C9C0F0",
  lavenderDeep: "#8E7CE0",
  skyBlue: "#8ECAE6",
  pastelPink: "#FFB5C2",
};

export const FONTS = {
  ui: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", sans-serif',
  comic: '"STHupo", "FZYouTi", "Microsoft YaHei", "Comic Sans MS", sans-serif',
  mono: '"Consolas", "SFMono-Regular", "Courier New", monospace',
};

export const LAYOUT = {
  toolbar: { x: 14, y: 12, w: 1252, h: 46 },
  leftPanel: { x: 14, y: 70, w: 332, h: 312 },
  phone: { x: 536, y: 66, w: 208, h: 318 },
  inspector: { x: 954, y: 70, w: 312, h: 312 },
  timeline: { x: 14, y: 394, w: 1252, h: 314 },
  ruler: { x: 86, y: 400, w: 1164, h: 24 },
  trackText: { x: 86, y: 432, w: 1164, h: 40 },
  trackVideo: { x: 86, y: 482, w: 1164, h: 78 },
  trackAudio: { x: 86, y: 572, w: 1068, h: 50 },
  beatButton: { x: 1164, y: 576, w: 86, h: 42 },
  beatDotsY: 634,
};

// Timeline ruler maps 0s..16s across trackVideo.x .. trackVideo.x + trackVideo.w
export const RULER_MAX_SEC = 16;

export function secToTrackX(sec: number): number {
  const clamped = Math.max(0, Math.min(RULER_MAX_SEC, sec));
  return LAYOUT.trackVideo.x + (clamped / RULER_MAX_SEC) * LAYOUT.trackVideo.w;
}

export const ACT = {
  INTRO_END: 40,
  DRAG_START: 42,
  DRAG_END: 138,
  CUT_START: 142,
  CUT_END: 245,
  TRANSITION_START: 248,
  TRANSITION_END: 348,
  TEXT_START: 350,
  TEXT_END: 465,
  INSPECTOR_START: 465,
  INSPECTOR_END: 595,
  BEAT_START: 595,
  BEAT_END: 695,
  EXPORT_START: 695,
  EXPORT_END: 804,
  FINALE_START: 804,
  FINALE_END: 900,
};
