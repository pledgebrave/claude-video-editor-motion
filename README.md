# claude-video-editor-motion

A Remotion replication of **claude_剪视频过程motion** ([MotionFace recording](https://motionface.cc/?recording=e3ee409a-50f7-4b4a-af27-288226e47a57)).

## Composition Specs

- **Composition ID**: `ClaudeEditorMotion`
- **Resolution**: `1280 × 720` (16:9)
- **Frame Rate**: `30 fps`
- **Duration**: `900 frames` (`30.0s`)
- **Audio**: Procedural 44.1 kHz WAV tracks (`public/audio/bgm.wav` & `public/audio/sfx-track.wav`)

## Scene Breakdown (9 Acts)

1. **Act 1 (`0:00–0:01.3`)**: Hand-drawn code editor (`小克的代码编辑器`) typing the editor initialization code and expanding into the full workspace.
2. **Act 2 (`0:01.4–0:04.6`)**: Mascot XiaoKe (`小克`) pops in (`开工!`) and drags clips (`夜景.mp4`, `拉面.mp4`, `柴犬.mp4`, `小克蹦迪.mp4`) and `bgm_小克.wav` onto the multi-track timeline.
3. **Act 3 (`0:04.7–0:08.1`)**: Playhead discovers an out-of-focus middle segment (`对焦中...` / `这段在发呆 zzz`), snips it out (`唰!`), drops it into the trash can (`哐当!`), and ripple-closes the gap to `0:10.5`.
4. **Act 4 (`0:08.2–0:11.6`)**: Switches to the `转场` tab and arcs transition badges onto clip seams (`空心入网!`).
5. **Act 5 (`0:11.7–0:15.5`)**: Drops `前方高能预警` onto the text track, catches a typo (`前方高能预`), presses `Ctrl+Z` (`撤销!`), and stamps `已修正`.
6. **Act 6 (`0:15.5–0:19.8`)**: Stretches an arm over to the right Inspector (`调整 ✦`), pushes `饱和度` to `爆表!!` (`饱和度:拉满`), pulls back to `110%`, and dials up `闪光` (`90%`) and `缩放冲击` (`60%`).
7. **Act 7 (`0:19.8–0:23.1`)**: Clicks `▼ 卡点` on the audio track, cascading beat markers across the timeline (`卡点!`).
8. **Act 8 (`0:23.1–0:26.8`)**: Clicks `导出`, stalls comedically at `渲染中 99.99%`, then chimes `叮!` (`已完成 ✓`) with celebratory confetti.
9. **Act 9 (`0:26.8–0:30.0`)**: Short-video preview scales up (`拿捏了!`) alongside a lined notebook memo card (`30 秒剪完，Opus 5.5 — 小克收工 ✨`).

## Quick Start

```bash
npm install
npm run audio:generate
npm run dev
```

## Render & Verify

```bash
# Typecheck
npm run typecheck

# Render full MP4 to out/claude-editor-motion.mp4
npm run render

# Render a specific frame still
npm run still -- out/still.png --frame=435
```
