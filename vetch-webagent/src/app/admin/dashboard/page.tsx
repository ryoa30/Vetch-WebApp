import { ChevronRight } from "lucide-react";

const certificates = [
  { name: "Dr. Seemore", type: "Registration Certificate" },
  { name: "Dr. Raydawn", type: "Specialty Certificate" },
  { name: "Dr. Taftian", type: "Species Certificate" },
];

export default function DashboardPage() {
  return (
    <div className="w-full">
      {/* Header Welcome */}
      <div className="w-full bg-[#F7FBEF] dark:bg-[#2E4F4A] py-6 px-6">
        <h1 className="text-2xl font-bold text-black dark:text-white">Welcome Back Admin</h1>
      </div>

      {/* Dashboard Title */}
      <h1 className="text-3xl font-bold text-white p-6">Dashboard</h1>

      {/* Certificates */}
      <div className="px-6 mb-10 ">
        <div className="bg-[#FFFFFF] dark:bg-[#2D4A46] rounded-md overflow-hidden">
          {/* Header container */}
          <div className="bg-[#3D8D7A] dark:bg-[#1c2d29] px-4 py-2">
            <h2 className="text-white font-semibold">Certificates to approve</h2>
          </div>

          {/* List */}
          <div>
            {certificates.map((c, i) => (
              <div
                key={i}
                className={`flex items-center justify-between px-4 py-3 cursor-pointer ${
                  i < certificates.length - 1 ? "border-b border-gray-600/50" : ""
                }`}
              >
                <div>
                  <p className="text-black dark:text-white font-medium">{c.name}</p>
                  <p className="text-sm text-black dark:text-white">{c.type}</p>
                </div>
                <ChevronRight className="text-black" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
