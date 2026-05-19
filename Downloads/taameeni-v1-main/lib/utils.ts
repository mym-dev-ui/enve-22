import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { db } from "./firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const onlyNumbers = (value: string) => {
  return value.replace(/[^\d٠-٩]/g, '');
};

// Track online status using Firestore only (no Realtime Database dependency)
export const setupOnlineStatus = (userId: string) => {
  if (!userId || !db) return;

  const userDocRef = doc(db, "pays", userId);

  // Mark online immediately
  setDoc(userDocRef, { online: true, lastSeen: serverTimestamp() }, { merge: true })
    .catch((error) => console.error("[setupOnlineStatus] error marking online:", error));

  // Mark offline on page unload
  const markOffline = () => {
    setDoc(userDocRef, { online: false, lastSeen: serverTimestamp() }, { merge: true })
      .catch(() => {/* best effort */});
  };

  window.addEventListener("beforeunload", markOffline);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") markOffline();
    else setDoc(userDocRef, { online: true, lastSeen: serverTimestamp() }, { merge: true }).catch(() => {});
  });
};

export const setUserOffline = async (userId: string) => {
  if (!userId || !db) return;

  try {
    await setDoc(doc(db, "pays", userId), { online: false, lastSeen: serverTimestamp() }, { merge: true });
  } catch (error) {
    console.error("[setUserOffline] error:", error);
  }
};
