// src/app/LayoutWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/app/layout-component/navbar/Navbar";
import { Footer } from "@/app/layout-component/footer/footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noLayoutRoutes = [
    "/login",
    "/register/people/account",
    "/register/people/location",
    "/register/people/pet",
    "/register/vet/account",
    "/register/vet/location",
  ];

  const isNoLayout = noLayoutRoutes.includes(pathname);

  return (
    <>
      {isNoLayout ? (
        <main>{children}</main>
      ) : (
        <>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </>
      )}
    </>
  );
}
