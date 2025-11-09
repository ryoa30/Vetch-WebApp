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
  setIsNotificationPrompted: () => {},
});

export function SessionProvider({ value, children }: { value: MinimalSession; children: React.ReactNode }) {
  const [isNotificationPrompted, setIsNotificationPrompted] = useState(value.isNotificationPrompted ?? false);

  const contextValue = {
    ...value,
    isNotificationPrompted,
    setIsNotificationPrompted,
  };

  return <SessionContext.Provider value={contextValue}>{children}</SessionContext.Provider>;
}

export function useSession() {
  return useContext(SessionContext);
}
