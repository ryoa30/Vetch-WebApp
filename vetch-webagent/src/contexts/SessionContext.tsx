"use client";

import React, { createContext, useContext } from "react";

export type MinimalSession = {
  isAuthenticated: boolean;
  user: { id: string; role: string; fullName: string; email: string } | null;
};

const SessionContext = createContext<MinimalSession>({
  isAuthenticated: false,
  user: null,
});

export function SessionProvider({ value, children }: { value: MinimalSession; children: React.ReactNode }) {
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  return useContext(SessionContext);
}
