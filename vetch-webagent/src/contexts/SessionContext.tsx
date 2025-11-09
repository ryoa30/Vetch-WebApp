"use client";

import { createContext, useContext, useState } from "react";

export type MinimalSession = {
  isAuthenticated: boolean;
  user: { id: string; role: string; fullName: string; email: string } | null;
  isNotificationPrompted: boolean;
  setIsNotificationPrompted: (value: boolean) => void;
};

const SessionContext = createContext<MinimalSession>({
  isAuthenticated: false,
  user: null,
  isNotificationPrompted: false,
  // default noop so consumers can call this safely even without a provider
  setIsNotificationPrompted: () => {},
});

export function SessionProvider({ value, children }: {
  value: {
    isAuthenticated: boolean;
    user: { id: string; role: string; fullName: string; email: string } | null;
    isNotificationPrompted?: boolean;
  };
  children: React.ReactNode;
}) {
  const [isNotificationPrompted, setLocalIsNotificationPrompted] = useState(value.isNotificationPrompted ?? false);

  const setIsNotificationPrompted = (v: boolean) => setLocalIsNotificationPrompted(v);

  const contextValue: MinimalSession = {
    ...value,
    isNotificationPrompted,
    setIsNotificationPrompted,
  };

  return <SessionContext.Provider value={contextValue}>{children}</SessionContext.Provider>;
}

export function useSession() {
  return useContext(SessionContext);
}
