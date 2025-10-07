import Sidebar from "./components/sidebar";
import { Footer } from "@/app/layout-component/footer/footer-admin-vet";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 bg-[#A3D1C6]">
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
