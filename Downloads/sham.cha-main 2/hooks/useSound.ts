'use client';

import { useCallback, useEffect, useRef } from 'react';

// ── Audio file paths ──────────────────────────────────────────────────────────
const AUDIO_FILES = {
  'new-visitor': '/sounds/new-visitor.mp3',
  alert: '/sounds/notification.mp3',
} as const;
// Keep shifts subtle (±12%) so the same uploaded notification file conveys outcome tone without distortion.
// Kept as named constants for easy UX tuning from a single location.
const APPROVAL_PLAYBACK_RATE = 1.12; // slightly faster to feel positive/successful
const REJECTION_PLAYBACK_RATE = 0.88; // slightly slower to feel negative/rejected
const MIN_PLAYBACK_RATE = 0.25;
const MAX_PLAYBACK_RATE = 4;

// ── Web Audio tone synthesis ──────────────────────────────────────────────────

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    return new Ctx();
  } catch {
    return null;
  }
}

interface ToneNote {
  freq: number;
  duration: number;
  type?: OscillatorType;
  volume?: number;
}

function playNotes(notes: ToneNote[]) {
  const ctx = getAudioContext();
  if (!ctx) return;

  let time = ctx.currentTime;
  for (const { freq, duration, type = 'sine', volume = 0.28 } of notes) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    osc.start(time);
    osc.stop(time + duration);
    // slight gap between notes for clarity
    time += duration * 0.85;
  }
}

function playAudioFile(path: string, options?: { volume?: number; playbackRate?: number }) {
  if (typeof window === 'undefined') return;
  try {
    const audio = new Audio(path);
    if (typeof options?.volume === 'number') {
      audio.volume = Math.min(1, Math.max(0, options.volume));
    }
    if (typeof options?.playbackRate === 'number') {
      audio.playbackRate = Math.min(MAX_PLAYBACK_RATE, Math.max(MIN_PLAYBACK_RATE, options.playbackRate));
    }
    audio.play().catch(() => {});
  } catch {}
}

// ── Sound event catalogue ─────────────────────────────────────────────────────

/**
 * All named sound events in the application.
 *
 * new-visitor          — new visitor detected in dashboard   (new-visitor.mp3)
 * basic-info           — step-1 basic information submitted  (C5→E5 ascending)
 * email-password       — step-2 email+password submitted     (C5→E5→G5 arpeggio)
 * otp-entry            — step-3 OTP/code submitted            (notification.mp3)
 * verification-complete— step-3 verification screen success  (notification.mp3)
 * registration-complete— step-4 final registration done      (E5→G5→B5→C6→E6 fanfare)
 * login                — admin dashboard login success       (A4→E5 welcome)
 * transfer             — visitor transferred in dashboard    (notification.mp3)
 * approval             — visitor marked complete/approved    (notification.mp3, faster)
 * rejection            — visitor removed/rejected            (notification.mp3, slower)
 * alert                — validation error / general alert   (notification.mp3)
 */
export type SoundEvent =
  | 'new-visitor'
  | 'basic-info'
  | 'email-password'
  | 'otp-entry'
  | 'verification-complete'
  | 'registration-complete'
  | 'login'
  | 'transfer'
  | 'approval'
  | 'rejection'
  | 'alert';

function playEvent(event: SoundEvent) {
  switch (event) {
    case 'new-visitor':
      // Existing chime file — plays when a visitor first appears in the dashboard
      playAudioFile(AUDIO_FILES['new-visitor']);
      break;

    case 'basic-info':
      // Two ascending soft tones — personal information submitted (step 1)
      playNotes([
        { freq: 523, duration: 0.12 }, // C5
        { freq: 659, duration: 0.20 }, // E5
      ]);
      break;

    case 'email-password':
      // Warm three-note arpeggio — email & password submitted (step 2)
      playNotes([
        { freq: 523, duration: 0.10 }, // C5
        { freq: 659, duration: 0.10 }, // E5
        { freq: 784, duration: 0.25 }, // G5
      ]);
      break;

    case 'otp-entry':
    case 'verification-complete':
      // OTP/code events use uploaded notification sound
      playAudioFile(AUDIO_FILES.alert);
      break;

    case 'registration-complete':
      // Five-note triumphant fanfare — full registration finished (step 4)
      playNotes([
        { freq: 659, duration: 0.11 },  // E5
        { freq: 784, duration: 0.11 },  // G5
        { freq: 988, duration: 0.11 },  // B5
        { freq: 1047, duration: 0.11 }, // C6
        { freq: 1319, duration: 0.42 }, // E6
      ]);
      break;

    case 'login':
      // Smooth two-note welcome — admin login success
      playNotes([
        { freq: 440, duration: 0.15 }, // A4
        { freq: 659, duration: 0.32 }, // E5
      ]);
      break;

    case 'transfer':
      // Dashboard transfer event uses uploaded notification sound
      playAudioFile(AUDIO_FILES.alert);
      break;

    case 'approval':
      // Dashboard approval event uses uploaded notification sound
      playAudioFile(AUDIO_FILES.alert, { playbackRate: APPROVAL_PLAYBACK_RATE });
      break;

    case 'rejection':
      // Dashboard rejection/remove event uses uploaded notification sound
      playAudioFile(AUDIO_FILES.alert, { playbackRate: REJECTION_PLAYBACK_RATE });
      break;

    case 'alert':
    default:
      // Existing notification file — validation errors and important alerts
      playAudioFile(AUDIO_FILES.alert);
      break;
  }
}

// ── Public hooks ──────────────────────────────────────────────────────────────

/** Comprehensive sound system. Call `play(event)` with a named SoundEvent. */
export function useSoundSystem() {
  const play = useCallback((event: SoundEvent) => {
    playEvent(event);
  }, []);
  return { play };
}

/** Legacy hook kept for backward compatibility — plays the alert sound. */
export function useSound() {
  const play = useCallback(() => {
    playEvent('alert');
  }, []);
  return { play };
}

/** Dashboard hook: plays the new-visitor sound when visitor count increases. */
export function useNewVisitorSound(visitorCount: number) {
  const prevCountRef = useRef<number | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!initializedRef.current) {
      prevCountRef.current = visitorCount;
      initializedRef.current = true;
      return;
    }

    if (prevCountRef.current !== null && visitorCount > prevCountRef.current) {
      playEvent('new-visitor');
    }

    prevCountRef.current = visitorCount;
  }, [visitorCount]);
}
