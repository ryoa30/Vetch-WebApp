"use client";

import { useEffect } from "react";
import Sidebar from "./components/sidebar";
import { Footer } from "@/app/layout-component/footer/footer-admin-vet";
import { useRouter } from "next/navigation";
import { useSession } from "@/contexts/SessionContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const {user } = useSession();

  useEffect(() => {
    if(user?.role !== 'admin') router.push('/login');
  }, [])
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 bg-[#A3D1C6] dark:bg-[#71998F]">
        <main>{children}</main>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
}
