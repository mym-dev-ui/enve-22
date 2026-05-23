import type { Timestamp } from "firebase/firestore";

export type DateLike =
  | Date
  | string
  | number
  | Timestamp
  | { seconds: number; nanoseconds?: number }
  | { toDate: () => Date }
  | null
  | undefined;

export function toDate(value: DateLike): Date | null {
  if (value == null) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  if (typeof value === "number") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === "string") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === "object") {
    const anyVal = value as any;
    if (typeof anyVal.toDate === "function") {
      try {
        const d = anyVal.toDate();
        return d instanceof Date && !isNaN(d.getTime()) ? d : null;
      } catch {
        return null;
      }
    }
    if (typeof anyVal.seconds === "number") {
      const ms =
        anyVal.seconds * 1000 +
        Math.floor((anyVal.nanoseconds ?? 0) / 1_000_000);
      const d = new Date(ms);
      return isNaN(d.getTime()) ? null : d;
    }
  }
  return null;
}

export function toDateOrEpoch(value: DateLike): Date {
  return toDate(value) ?? new Date(0);
}
