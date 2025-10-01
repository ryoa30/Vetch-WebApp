"use client";

import { useState } from "react";
import { User } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#fcffe5] flex flex-col">

      {/* Avatar */}
      <div className="flex justify-center mt-10">
        <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
          <User className="w-12 h-12" />
        </div>
      </div>

      {/* Profile Form */}
      <div className="relative mx-auto w-4/5 mt-10 bg-[#B3D8A8] rounded-lg shadow-lg p-6">
        
        {/* Paw Icon floating top-right */}
        <div className="absolute top-2 right-2">
          <Image
            src="/img/register/paw.png"
            alt="Paw"
            width={40}
            height={40}
          />
        </div>

        <form className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Nama</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-md px-3 py-2 bg-[#fcffe5] outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-md px-3 py-2 bg-[#fcffe5] outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              className="bg-white px-6 py-2 rounded-md shadow font-semibold hover:bg-gray-100"
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-white px-6 py-2 rounded-md shadow font-semibold hover:bg-gray-100"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
