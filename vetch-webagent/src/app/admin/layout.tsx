"use client";

import { useEffect } from "react";
import Sidebar from "./components/sidebar";
import { Footer } from "@/app/layout-component/footer/footer";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if(sessionStorage.getItem('role') !== 'admin' || !sessionStorage.getItem('accessToken')) router.push('/login');
  }, [])
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 bg-[#A3D1C6]">
        <main>{children}</main>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
}
