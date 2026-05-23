// Dashboard sounds — 4 distinct events, mp3 + WebAudio tones only.
// No mp4. Throttled at the call site to avoid overlapping playback.

type SoundEvent = "enter" | "register" | "approve" | "reject";

let busy = false;
function withBusy(ms: number) {
  busy = true;
  setTimeout(() => {
    busy = false;
  }, ms);
}

function playFile(src: string, durationMs: number) {
  if (typeof window === "undefined" || busy) return;
  try {
    const a = new Audio(src);
    a.volume = 0.85;
    withBusy(durationMs);
    a.play().catch(() => {
      busy = false;
    });
  } catch {
    busy = false;
  }
}

function playTone(freqs: number[], durationMs = 220) {
  if (typeof window === "undefined" || busy) return;
  try {
    const Ctx =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    withBusy(durationMs + 80);
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const startAt = ctx.currentTime + (i * durationMs) / 1000;
      const stopAt = startAt + durationMs / 1000;
      gain.gain.setValueAtTime(0, startAt);
      gain.gain.linearRampToValueAtTime(0.25, startAt + 0.02);
      gain.gain.linearRampToValueAtTime(0, stopAt - 0.02);
      osc.connect(gain).connect(ctx.destination);
      osc.start(startAt);
      osc.stop(stopAt);
    });
    setTimeout(() => ctx.close().catch(() => {}), durationMs * freqs.length + 200);
  } catch {
    busy = false;
  }
}

export const playSound = (event: SoundEvent) => {
  switch (event) {
    case "enter":
      playFile("/notify.mp3", 900);
      break;
    case "register":
      playFile("/info-sound.mp3", 1200);
      break;
    case "approve":
      playTone([880, 1320], 200);
      break;
    case "reject":
      playTone([400, 220], 220);
      break;
  }
};

// Back-compat for any old imports.
export const playNotificationSound = (kind?: "info" | "card") =>
  playSound(kind === "card" ? "register" : "enter");
