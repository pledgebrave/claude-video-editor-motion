import fs from "node:fs";
import path from "node:path";

const SAMPLE_RATE = 44100;
const DURATION_SEC = 30.0;
const TOTAL_SAMPLES = Math.floor(SAMPLE_RATE * DURATION_SEC);

function writeWav(filePath, samples) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (SAMPLE_RATE * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(clamped * 32767), 44 + i * 2);
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buffer);
}

function midiToFreq(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function addTone(buf, startSec, durSec, freqStart, freqEnd, amp, wave = "sine", decay = 6) {
  const s0 = Math.max(0, Math.floor(startSec * SAMPLE_RATE));
  const s1 = Math.min(buf.length, Math.floor((startSec + durSec) * SAMPLE_RATE));
  let phase = 0;
  for (let i = s0; i < s1; i++) {
    const t = (i - s0) / SAMPLE_RATE;
    const progress = (i - s0) / Math.max(1, s1 - s0);
    const freq = freqStart + (freqEnd - freqStart) * progress;
    phase += (2 * Math.PI * freq) / SAMPLE_RATE;
    const env = Math.min(1, t / 0.004) * Math.exp(-decay * progress);
    let val = 0;
    if (wave === "sine") val = Math.sin(phase);
    else if (wave === "tri") val = 2 * Math.abs(2 * ((phase / (2 * Math.PI)) % 1) - 1) - 1;
    else if (wave === "square") val = Math.sin(phase) >= 0 ? 1 : -1;
    else if (wave === "saw") val = 2 * ((phase / (2 * Math.PI)) % 1) - 1;
    buf[i] += val * env * amp;
  }
}

function addNoise(buf, startSec, durSec, amp, decay = 8, seedOffset = 1) {
  const s0 = Math.max(0, Math.floor(startSec * SAMPLE_RATE));
  const s1 = Math.min(buf.length, Math.floor((startSec + durSec) * SAMPLE_RATE));
  let state = (seedOffset * 1664525 + 1013904223) >>> 0;
  let lp = 0;
  for (let i = s0; i < s1; i++) {
    const progress = (i - s0) / Math.max(1, s1 - s0);
    state = (state * 1664525 + 1013904223) >>> 0;
    const white = (state / 0xffffffff) * 2 - 1;
    lp = lp * 0.65 + white * 0.35;
    const env = Math.exp(-decay * progress);
    buf[i] += lp * env * amp;
  }
}

function generateBgm() {
  const buf = new Float32Array(TOTAL_SAMPLES);
  const bpm = 120;
  const eighth = 60 / bpm / 2; // 0.25s

  // Cheerful C-major / F-major / G-major / Am bouncy marimba + bass pattern
  const chords = [
    [60, 64, 67, 72], // C
    [69, 72, 76, 81], // Am
    [65, 69, 72, 77], // F
    [67, 71, 74, 79], // G
  ];
  const bassNotes = [36, 45, 41, 43];
  const melodyPattern = [0, 2, 1, 3, 2, 1, 3, 2];

  const totalSteps = Math.floor(DURATION_SEC / eighth);
  for (let step = 0; step < totalSteps; step++) {
    const t = step * eighth;
    if (t < 1.15) continue;

    // Comedic silence dip during 99.99% freeze (24.6s - 25.75s)
    let masterMul = 1.0;
    if (t >= 24.55 && t < 25.75) {
      masterMul = 0.08;
    } else if (t >= 26.8) {
      masterMul = 1.15;
    }
    if (t >= 29.4) {
      masterMul *= Math.max(0, 1 - (t - 29.4) / 0.6);
    }

    const bar = Math.floor(step / 8) % chords.length;
    const chord = chords[bar];
    const melIdx = melodyPattern[step % 8];
    const melFreq = midiToFreq(chord[melIdx]);

    // Soft marimba pluck
    addTone(buf, t, 0.22, melFreq, melFreq, 0.095 * masterMul, "tri", 7);
    addTone(buf, t, 0.14, melFreq * 2, melFreq * 2, 0.025 * masterMul, "sine", 9);

    // Downbeat & upbeat bass
    if (step % 2 === 0) {
      const bf = midiToFreq(bassNotes[bar]);
      addTone(buf, t, 0.28, bf, bf * 0.99, 0.11 * masterMul, "sine", 5);
    }

    // Light kick & hi-hat groove
    if (step % 4 === 0) {
      addTone(buf, t, 0.11, 130, 48, 0.13 * masterMul, "sine", 9);
    }
    if (step % 2 === 1) {
      addNoise(buf, t, 0.045, 0.045 * masterMul, 14, step + 7);
    }
  }

  return buf;
}

function generateSfx() {
  const buf = new Float32Array(TOTAL_SAMPLES);

  // 0.05 - 0.85s: Mechanical keystrokes for code typing
  for (let k = 0; k < 18; k++) {
    const kt = 0.06 + k * 0.043;
    addTone(buf, kt, 0.025, 900 + (k % 5) * 90, 420, 0.12, "square", 14);
    addNoise(buf, kt, 0.018, 0.08, 16, k + 11);
  }

  // 0.95s: Bright upward pop for editor UI reveal
  addTone(buf, 0.95, 0.18, 360, 920, 0.24, "sine", 5);
  addTone(buf, 1.02, 0.2, 720, 1280, 0.14, "tri", 6);

  // 1.6s, 2.3s, 3.0s, 3.6s: Cute bubble-pops & soft thuds for clips + BGM
  [1.6, 2.3, 3.0, 3.6].forEach((t, idx) => {
    const f = 440 + idx * 75;
    addTone(buf, t, 0.12, f, f * 1.65, 0.22, "sine", 8);
    addTone(buf, t + 0.14, 0.08, 180, 95, 0.18, "sine", 10);
  });

  // 5.5s: Focus-hunting whirr/beep
  addTone(buf, 5.5, 0.25, 620, 480, 0.1, "sine", 5);
  addTone(buf, 5.82, 0.16, 480, 560, 0.08, "sine", 6);

  // 6.45s: Sharp scissor snip ("唰!")
  addNoise(buf, 6.45, 0.14, 0.28, 10, 645);
  addTone(buf, 6.45, 0.09, 2400, 950, 0.18, "tri", 12);

  // 6.85s: Metallic trash-can clang ("哐当!")
  addTone(buf, 6.85, 0.35, 310, 275, 0.28, "square", 7);
  addTone(buf, 6.85, 0.35, 467, 435, 0.22, "tri", 7);
  addTone(buf, 6.92, 0.25, 620, 580, 0.15, "sine", 8);
  addNoise(buf, 6.85, 0.12, 0.18, 11, 685);

  // 8.3s, 9.2s, 10.0s, 10.8s: Swish + basketball swish pop ("空心入网!")
  [8.3, 9.2, 10.0].forEach((t, i) => {
    addNoise(buf, t, 0.16, 0.15, 9, 800 + i);
    addTone(buf, t + 0.12, 0.11, 520 + i * 90, 980 + i * 110, 0.2, "sine", 8);
  });
  addTone(buf, 10.75, 0.14, 523.25, 1046.5, 0.24, "tri", 6);
  addTone(buf, 10.88, 0.2, 1318.5, 1568, 0.2, "sine", 5);

  // 12.0s: Text drop pop; 13.6s: Ctrl+Z click; 14.7s: Rubber stamp thud
  addTone(buf, 12.0, 0.14, 480, 860, 0.22, "sine", 8);
  addTone(buf, 13.6, 0.06, 1200, 320, 0.24, "square", 14);
  addTone(buf, 13.68, 0.14, 780, 420, 0.2, "tri", 8);
  addTone(buf, 14.7, 0.16, 170, 55, 0.34, "sine", 9);
  addNoise(buf, 14.7, 0.08, 0.2, 12, 147);

  // 15.8s, 16.9s: Rising synth shimmer + overdriven alarm buzz + relief slide + bass punch
  addTone(buf, 15.8, 0.35, 420, 1120, 0.18, "sine", 5);
  addTone(buf, 16.9, 0.45, 220, 290, 0.22, "saw", 4);
  addTone(buf, 16.9, 0.45, 330, 440, 0.16, "square", 5);
  addTone(buf, 18.0, 0.24, 680, 310, 0.18, "sine", 6);
  addTone(buf, 19.2, 0.28, 160, 48, 0.35, "sine", 7);

  // 20.8 - 22.6s: Rhythmic woodblock/chime ticks matching beat-sync markers
  for (let m = 0; m < 8; m++) {
    const mt = 20.85 + m * 0.21;
    const f = 880 + (m % 4) * 140;
    addTone(buf, mt, 0.08, f, f * 1.03, 0.22, "tri", 11);
  }
  addTone(buf, 22.65, 0.22, 1046.5, 1318.5, 0.22, "sine", 6);

  // 23.6 - 24.5s: Rising progress ticks -> pause -> bright bell "叮!" at 25.8s + fanfare at 26.9s
  [23.6, 23.85, 24.1, 24.35].forEach((t, i) => {
    addTone(buf, t, 0.07, 560 + i * 110, 620 + i * 110, 0.16, "sine", 10);
  });

  // Bright metallic bell "叮!" at 25.8s
  addTone(buf, 25.8, 0.9, 1567.98, 1567.98, 0.3, "sine", 4.5);
  addTone(buf, 25.8, 0.7, 3135.96, 3135.96, 0.12, "sine", 6);

  // Celebratory fanfare chord at 26.9s
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
    addTone(buf, 26.9 + idx * 0.04, 1.1, freq, freq, 0.14, "tri", 3.5);
  });

  return buf;
}

const outDir = path.resolve(process.cwd(), "public/audio");
writeWav(path.join(outDir, "bgm.wav"), generateBgm());
writeWav(path.join(outDir, "sfx-track.wav"), generateSfx());
console.log("Generated public/audio/bgm.wav and public/audio/sfx-track.wav");
