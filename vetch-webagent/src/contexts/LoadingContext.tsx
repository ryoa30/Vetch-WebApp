// /contexts/AuthContext.tsx
"use client"; // 👈 context must run on the client

import { createContext, useContext, useState, ReactNode } from "react";

type LoadingContextType = {
  loading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingContextProvider({ children }: { children: ReactNode }) {
  const [loading, setIsLoading] = useState(false);


  const context = {
    loading,
    setIsLoading,
  };

  return (
    <LoadingContext.Provider value={context}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useRegister must be used within LoadingContextProvider");
  return ctx;
}

