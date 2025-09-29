"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/app/layout-component/navbar/Navbar";
import { Footer } from "@/app/layout-component/footer/footer";
import LoadingOverlay from "@/components/LoadingOverlay";
import { useLoading } from "@/contexts/LoadingContext";
import { SessionProvider } from "@/contexts/SessionContext";
import { useEffect } from "react";

type MinimalSession = {
  isAuthenticated: boolean;
  user: { id: string; role: string; fullName: string; email: string } | null;
};

export default function LayoutWrapper({ children, session }: { children: React.ReactNode; session: MinimalSession }) {
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
    "/admin/blog/add-blog",
    "/vet/dashboard",
    "/vet/history",
    "/vet/patients",
    "/vet/schedule",
    "/vet/profile-and-schedules",

    "/admin/blog/set-blog",
  ];

  // cek exact match atau prefix match untuk edit-blog/[id]
  const isNoLayout =
    noLayoutRoutes.includes(pathname) ||
    pathname.startsWith("/admin/blog/set-blog/");

  useEffect(() => {
    console.log("masuk ini kawan");
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";

    const scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;

    const myMidtransClientKey = process.env.MIDTRANS_CLIENT_ID || "";
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);
    scriptTag.async = true;

    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  return (
    <>
      {isNoLayout ? (
        <SessionProvider value={session}>
          <main>{children}</main>
        </SessionProvider>
      ) : (
        <SessionProvider value={session}>
          <Navbar session={session} />
          <main>{children}</main>
          <Footer />
          <LoadingOverlay show={loading}/>
        </SessionProvider>
      )}
    </>
  );
}
