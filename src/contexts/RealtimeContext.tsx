import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./AuthContext";

interface RealtimeEvent {
  type: "message" | "lead" | "notification";
  payload: unknown;
}

interface RealtimeContextValue {
  events: RealtimeEvent[];
  pushEvent: (event: RealtimeEvent) => void;
}

const RealtimeContext = createContext<RealtimeContextValue | undefined>(undefined);

const WS_URL = "wss://api.example.com/ws";

export const RealtimeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { token } = useAuth();
  const [events, setEvents] = useState<RealtimeEvent[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !token) {
      wsRef.current?.close();
      wsRef.current = null;
      return;
    }

    const socket = new WebSocket(`${WS_URL}?token=${token}`);
    wsRef.current = socket;

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as RealtimeEvent;
        setEvents((prev) => [...prev, payload]);
      } catch (error) {
        console.error("Failed to parse realtime event", error);
      }
    };

    socket.onclose = () => {
      wsRef.current = null;
    };

    return () => {
      socket.close();
    };
  }, [token]);

  const pushEvent = (event: RealtimeEvent) => setEvents((prev) => [...prev, event]);

  const value = useMemo(() => ({ events, pushEvent }), [events]);

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
};

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error("useRealtime must be used within a RealtimeProvider");
  }
  return context;
};
