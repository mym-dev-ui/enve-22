import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { Visitor } from '@/lib/types';

const DATA_FILE = process.env.SHAMCHA_VISITOR_STORE_FILE || '/tmp/shamcha-visitors.json';

let cache: Visitor[] | null = null;
let writeQueue: Promise<void> = Promise.resolve();
let mutationQueue: Promise<unknown> = Promise.resolve();

function normalizeVisitor(input: Partial<Visitor>): Visitor {
  const id = input.id && input.id.trim() ? input.id : randomUUID();

  return {
    id,
    name: input.name?.trim() || 'زائر جديد',
    phone: input.phone?.trim() || '',
    email: input.email?.trim() || undefined,
    currentStep: input.currentStep ?? 1,
    registrationData: input.registrationData ?? {},
    createdAt: input.createdAt || new Date().toISOString(),
    status: input.status ?? 'active',
  };
}

async function ensureLoaded(): Promise<Visitor[]> {
  if (cache) return cache;
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Visitor[];
    cache = Array.isArray(parsed) ? parsed : [];
  } catch {
    cache = [];
  }
  return cache;
}

async function persist(visitors: Visitor[]): Promise<void> {
  const toWrite = JSON.stringify(visitors);
  writeQueue = writeQueue
    .then(async () => {
      await fs.mkdir(path.dirname(DATA_FILE), { recursive: true, mode: 0o700 });
      await fs.writeFile(DATA_FILE, toWrite, { encoding: 'utf-8', mode: 0o600 });
    })
    .catch(() => {
      // ignore queue errors to avoid breaking future writes
    });
  await writeQueue;
}

async function runMutation<T>(operation: () => Promise<T>): Promise<T> {
  const resultPromise = mutationQueue.then(operation);
  mutationQueue = resultPromise
    .then(() => undefined)
    .catch(() => undefined);
  return resultPromise;
}

export async function listVisitors(): Promise<Visitor[]> {
  const visitors = await ensureLoaded();
  return [...visitors].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createVisitor(input: Partial<Visitor>): Promise<Visitor> {
  return runMutation(async () => {
    const visitors = await ensureLoaded();
    const visitor = normalizeVisitor(input);
    cache = [visitor, ...visitors];
    await persist(cache);
    return visitor;
  });
}

export async function updateVisitor(id: string, patch: Partial<Visitor>): Promise<Visitor | null> {
  return runMutation(async () => {
    const visitors = await ensureLoaded();
    const idx = visitors.findIndex((v) => v.id === id);
    if (idx < 0) return null;

    const current = visitors[idx];
    const updated: Visitor = {
      ...current,
      ...patch,
      id: current.id,
      registrationData: {
        ...current.registrationData,
        ...(patch.registrationData ?? {}),
      },
    };

    const next = [...visitors];
    next[idx] = updated;
    cache = next;
    await persist(next);
    return updated;
  });
}

export async function deleteVisitor(id: string): Promise<boolean> {
  return runMutation(async () => {
    const visitors = await ensureLoaded();
    const next = visitors.filter((v) => v.id !== id);
    if (next.length === visitors.length) return false;
    cache = next;
    await persist(next);
    return true;
  });
}
