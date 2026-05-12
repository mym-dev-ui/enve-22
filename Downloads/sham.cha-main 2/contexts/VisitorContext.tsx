'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import { Visitor, VisitorStep, RegistrationData } from '@/lib/types';

interface VisitorContextType {
  visitors: Visitor[];
  addVisitor: (data: Partial<Visitor>) => Promise<string>;
  updateVisitorStep: (visitorId: string, step: VisitorStep) => Promise<void>;
  updateVisitorData: (visitorId: string, data: Partial<RegistrationData>) => Promise<void>;
  transferVisitor: (visitorId: string, targetStep: VisitorStep) => Promise<void>;
  completeVisitor: (visitorId: string) => Promise<void>;
  rejectVisitor: (visitorId: string) => Promise<void>;
  setVisitorPending: (visitorId: string) => Promise<void>;
  setVisitorStatus: (visitorId: string, status: Visitor['status']) => Promise<void>;
  removeVisitor: (visitorId: string) => Promise<void>;
  getVisitor: (visitorId: string) => Visitor | undefined;
}

const VisitorContext = createContext<VisitorContextType | null>(null);

export function VisitorProvider({ children }: { children: ReactNode }) {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const pollTimerRef = useRef<number | null>(null);

  const fetchVisitors = useCallback(async () => {
    try {
      const res = await fetch('/api/visitors', { cache: 'no-store' });
      if (!res.ok) return;
      const payload = (await res.json()) as { visitors?: Visitor[] };
      setVisitors(Array.isArray(payload.visitors) ? payload.visitors : []);
    } catch {
      // keep the last known state if API is temporarily unavailable
    }
  }, []);

  useEffect(() => {
    fetchVisitors();
    pollTimerRef.current = window.setInterval(() => {
      void fetchVisitors();
    }, 2500);
    return () => {
      if (pollTimerRef.current !== null) {
        window.clearInterval(pollTimerRef.current);
      }
    };
  }, [fetchVisitors]);

  const patchVisitor = useCallback(
    async (visitorId: string, patch: Partial<Visitor>) => {
      setVisitors((prev) =>
        prev.map((v) =>
          v.id === visitorId
            ? {
                ...v,
                ...patch,
                registrationData: patch.registrationData
                  ? { ...v.registrationData, ...patch.registrationData }
                  : v.registrationData,
              }
            : v
        )
      );
      try {
        await fetch(`/api/visitors/${visitorId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patch),
        });
      } finally {
        await fetchVisitors();
      }
    },
    [fetchVisitors]
  );

  const addVisitor = useCallback(async (data: Partial<Visitor>): Promise<string> => {
    const tempId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `visitor_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const optimistic: Visitor = {
      id: tempId,
      name: data.name || 'زائر جديد',
      phone: data.phone || '',
      currentStep: data.currentStep !== undefined ? data.currentStep : 1,
      registrationData: data.registrationData || {},
      createdAt: data.createdAt || new Date().toISOString(),
      status: data.status || 'active',
      email: data.email,
      ...data,
    };
    setVisitors((prev) => [optimistic, ...prev]);
    try {
      const res = await fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error('Failed to create visitor');
      }
      const payload = (await res.json()) as { visitor?: Visitor };
      const serverId = payload.visitor?.id ?? tempId;
      await fetchVisitors();
      return serverId;
    } catch {
      await fetchVisitors();
      throw new Error('Unable to create visitor');
    }
  }, [fetchVisitors]);

  const updateVisitorStep = useCallback(async (visitorId: string, step: VisitorStep) => {
    await patchVisitor(visitorId, { currentStep: step });
  }, [patchVisitor]);

  const updateVisitorData = useCallback(
    async (visitorId: string, data: Partial<RegistrationData>) => {
      await patchVisitor(visitorId, {
        registrationData: data,
      });
    },
    [patchVisitor]
  );

  const transferVisitor = useCallback(async (visitorId: string, targetStep: VisitorStep) => {
    await patchVisitor(visitorId, { currentStep: targetStep });
  }, [patchVisitor]);

  const completeVisitor = useCallback(async (visitorId: string) => {
    await patchVisitor(visitorId, { status: 'completed', currentStep: 4 });
  }, [patchVisitor]);

  const rejectVisitor = useCallback(async (visitorId: string) => {
    await patchVisitor(visitorId, { status: 'rejected' });
  }, [patchVisitor]);

  const setVisitorPending = useCallback(async (visitorId: string) => {
    await patchVisitor(visitorId, { status: 'pending' });
  }, [patchVisitor]);

  const setVisitorStatus = useCallback(async (visitorId: string, status: Visitor['status']) => {
    await patchVisitor(visitorId, { status });
  }, [patchVisitor]);

  const removeVisitor = useCallback(async (visitorId: string) => {
    setVisitors((prev) => prev.filter((v) => v.id !== visitorId));
    try {
      await fetch(`/api/visitors/${visitorId}`, { method: 'DELETE' });
    } finally {
      await fetchVisitors();
    }
  }, [fetchVisitors]);

  const getVisitor = useCallback(
    (visitorId: string) => visitors.find((v) => v.id === visitorId),
    [visitors]
  );

  return (
    <VisitorContext.Provider
      value={{
        visitors,
        addVisitor,
        updateVisitorStep,
        updateVisitorData,
        transferVisitor,
        completeVisitor,
        rejectVisitor,
        setVisitorPending,
        setVisitorStatus,
        removeVisitor,
        getVisitor,
      }}
    >
      {children}
    </VisitorContext.Provider>
  );
}

export function useVisitorContext(): VisitorContextType {
  const ctx = useContext(VisitorContext);
  if (!ctx) {
    throw new Error('useVisitorContext must be used within a VisitorProvider');
  }
  return ctx;
}
