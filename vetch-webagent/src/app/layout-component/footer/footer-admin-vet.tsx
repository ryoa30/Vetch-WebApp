"use client";
import Link from "next/link";
import Image from "next/image";
import { FaInstagram, FaFacebook, FaLinkedin, FaYoutube } from "react-icons/fa";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Footer() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const dark = theme === "dark" || resolvedTheme === "dark";

  return (
    <footer>
      <div className="bg-[#FBFFE4] dark:bg-[#2E4F4A] py-6">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-black dark:text-white font-semibold mb-4">Our Socials</h3>
          <div className="flex justify-center space-x-6">
            <Link href="#" className="text-black hover:text-gray-200 dark:text-white">
              <FaInstagram size={24} />
            </Link>
            <Link href="#" className="text-black hover:text-gray-200 dark:text-white">
              <FaFacebook size={24} />
            </Link>
            <Link href="#" className="text-black hover:text-gray-200 dark:text-white">
              <FaLinkedin size={24} />
            </Link>
            <Link href="#" className="text-black hover:text-gray-200 dark:text-white">
              <FaYoutube size={24} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
