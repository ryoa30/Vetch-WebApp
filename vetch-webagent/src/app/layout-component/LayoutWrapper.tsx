"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/app/layout-component/navbar/Navbar";
import { Footer } from "@/app/layout-component/footer/footer";
import LoadingOverlay from "@/components/LoadingOverlay";
import { useLoading } from "@/contexts/LoadingContext";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {loading} = useLoading();

  const noLayoutRoutes = [
    "/login",
    "/register/people/account",
    "/register/people/location",
    "/register/people/pet",
    "/register/vet/account",
    "/register/vet/location",
    "/admin/dashboard",
    "/admin/certificates",
    "/admin/approval-history",
    "/admin/blog",
    "/admin/blog/set-blog",
  ];

  // cek exact match atau prefix match untuk edit-blog/[id]
  const isNoLayout =
    noLayoutRoutes.includes(pathname) ||
    pathname.startsWith("/admin/blog/set-blog/");

  return (
    <>
      {isNoLayout ? (
        <main>{children}</main>
      ) : (
        <>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <LoadingOverlay show={loading}/>
        </>
      )}
    </>
  );
}
