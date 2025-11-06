"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/app/layout-component/navbar/Navbar";
import { Footer } from "@/app/layout-component/footer/footer";
import LoadingOverlay from "@/components/LoadingOverlay";
import { useLoading } from "@/contexts/LoadingContext";
import { SessionProvider, useSession } from "@/contexts/SessionContext";
import { useEffect } from "react";

type MinimalSession = {
  isAuthenticated: boolean;
  user: { id: string; role: string; fullName: string; email: string } | null;
};

export default function LayoutWrapper({ children, session }: { children: React.ReactNode; session: MinimalSession }) {
  const pathname = usePathname();
  const {loading} = useLoading();
  const {isAuthenticated, user} = session;

  const noLayoutRoutes = [
    "/OTP",
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
    "/vet/profile-and-schedules/profile",
    "/vet/profile-and-schedules/schedules",
    "/admin/blog/set-blog",
    "/forgotpassword",
    "/changepassword",
  ];

  // cek exact match atau prefix match untuk edit-blog/[id]
  const isNoLayout =
    noLayoutRoutes.includes(pathname) ||
    pathname.startsWith("/admin/blog/set-blog/");

  useEffect(() => {
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

  useEffect(() => {
    console.log("session: ",session);
    if(isAuthenticated){
      if(user?.role === "vet" && !pathname.startsWith("/vet")){
        window.location.href = "/vet/dashboard";
      }else if(user?.role === "admin" && !pathname.startsWith("/admin")){
        window.location.href = "/admin/dashboard";
      }
    }else{
      if(pathname.startsWith("/vet") || pathname.startsWith("/admin") || pathname.startsWith("/forPetParent/orderHistory") || pathname.startsWith("/forPetParent/consultationVetList/")){
        window.location.href = "/login";
      }
    }
  }, [])

  return (
    <>
      {isNoLayout ? (
        <SessionProvider value={session}>
          <main>{children}</main>
          <LoadingOverlay show={loading}/>
        </SessionProvider>
      ) : (
        <SessionProvider value={session}>
          <div className="flex flex-col min-h-screen justify-between">
            <Navbar session={session} />
            <main className="flex-1 bg-[#FBFFE4] dark:bg-[#2E4F4A]">{children}</main>
            <Footer />
            <LoadingOverlay show={loading}/>
          </div>
        </SessionProvider>
      )}
    </>
  );
}
