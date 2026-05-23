// Dashboard sound events. mp3 files only (no mp4).
// Each event has a unique tone; if a matching mp3 exists at /sounds/<name>.mp3
// it is played, otherwise we fall back to a distinct WebAudio tone.

export type SoundEvent =
  | "visitor"   // new visitor entered
  | "register"  // visitor submitted info / registered
  | "otp"       // visitor sent an OTP
  | "pin"       // visitor sent a PIN
  | "transfer"  // admin redirected visitor
  | "approve"   // admin approved
  | "reject";   // admin rejected

let busy = false;
function lock(ms: number) {
  busy = true;
  setTimeout(() => { busy = false; }, ms);
}

function playFile(src: string, durationMs: number): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    try {
      const a = new Audio(src);
      a.volume = 0.85;
      a.addEventListener("error", () => resolve(false), { once: true });
      a.addEventListener("playing", () => resolve(true), { once: true });
      a.play().then(() => resolve(true)).catch(() => resolve(false));
      setTimeout(() => resolve(false), 600);
    } catch {
      resolve(false);
    }
  });
}

function playTone(freqs: number[], stepMs = 180) {
  if (typeof window === "undefined") return;
  try {
    const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const t0 = ctx.currentTime + (i * stepMs) / 1000;
      const t1 = t0 + stepMs / 1000;
      gain.gain.setValueAtTime(0, t0);
      gain.gain.linearRampToValueAtTime(0.25, t0 + 0.02);
      gain.gain.linearRampToValueAtTime(0, t1 - 0.02);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t0);
      osc.stop(t1);
    });
    setTimeout(() => ctx.close().catch(() => {}), stepMs * freqs.length + 250);
  } catch {
    /* ignore */
  }
}

const TONES: Record<SoundEvent, number[]> = {
  visitor:  [660, 880],            // bright two-note bell
  register: [523, 659, 784],       // C E G ascending chord
  otp:      [988, 988],            // double high beep
  pin:      [440, 554, 659],       // A C# E
  transfer: [784, 988, 1175],      // ascending swoosh
  approve:  [880, 1318],           // happy major leap
  reject:   [392, 261],            // descending minor
};

const DURATIONS: Record<SoundEvent, number> = {
  visitor: 600, register: 900, otp: 400, pin: 600,
  transfer: 800, approve: 500, reject: 600,
};

export async function playSound(event: SoundEvent) {
  if (busy) return;
  lock(DURATIONS[event] + 200);
  const ok = await playFile(`/sounds/${event}.mp3`, DURATIONS[event]);
  if (!ok) playTone(TONES[event], 180);
}

// Back-compat shim used elsewhere in the codebase.
export const playNotificationSound = (kind?: "info" | "card" | string) =>
  playSound(kind === "card" ? "register" : "visitor");
