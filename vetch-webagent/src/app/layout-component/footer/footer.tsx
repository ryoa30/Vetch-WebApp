"use client"
import Link from "next/link";
import Image from "next/image";
import { FaInstagram, FaFacebook, FaLinkedin, FaYoutube } from "react-icons/fa";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useSession } from "@/contexts/SessionContext";

export function Footer() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const {isAuthenticated} = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const dark = theme === "dark" || resolvedTheme === "dark";

  return (
    <footer>
      {/* Top Section */}
      <div className="bg-[#B3D8A8] dark:bg-[#357C72] py-12">
        <div className="container mx-auto px-12 md:px-24 flex flex-col md:flex-row items-start">
          {/* Logo & Tagline */}
          <div className="ml-0 *:md:ml-10">
            <div className="flex items-center space-x-3">
              <Image
                src={dark ? "/img/logo/logo-white.png" : "/img/logo/logo-green.png"}
                alt="Vetch Logo"
                width={50}
                height={50}
              />
              <h2
                className={`text-2xl font-bold ${
                  dark ? "text-white" : "text-[#3D8D7A]"
                }`}
              >
                Vetch
              </h2>
            </div>
            <p
              className={`mt-3 italic ${
                dark ? "text-white" : "text-gray-700"
              }`}
            >
              Caring for Your Pets, <br /> Anytime, Anywhere
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-8 md:mt-0 md:ml-auto mr-0 md:mr-10 flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-16">
            {/* For Pet Parents */}
            <div>
              <h3 className="text-blue-600 dark:text-[#69B9FF] font-semibold mb-3">
                For Pet Parents
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/forPetParent/consultationVetList" className="text-gray-700 dark:text-white hover:text-[#3D8D7A]">
                    Consultation
                  </Link>
                </li>
                <li>
                  <Link href="/forPetParent/emergencyVetList" className="text-gray-700 dark:text-white hover:text-[#3D8D7A]">
                    Emergency
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Vets */}
            {!isAuthenticated && <div>
              <h3 className="text-blue-600 dark:text-[#69B9FF] font-semibold mb-3">For Vets</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/register/vet/account" className="text-gray-700 dark:text-white hover:text-[#3D8D7A]">
                    Register as Vets
                  </Link>
                </li>
              </ul>
            </div>}

            {/* Blog */}
            <div>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/blog"
                    className="text-blue-600 dark:text-[#69B9FF] font-semibold hover:underline"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* About Us */}
            <div>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/aboutUs"
                    className="text-blue-600 dark:text-[#69B9FF] font-semibold hover:underline"
                  >
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-[#3D8D7A] dark:bg-[#1F2D2A] py-6">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-white font-semibold mb-4">Our Socials</h3>
          <div className="flex justify-center space-x-6">
            <Link href="#" className="text-white hover:text-gray-200">
              <FaInstagram size={24} />
            </Link>
            <Link href="#" className="text-white hover:text-gray-200">
              <FaFacebook size={24} />
            </Link>
            <Link href="#" className="text-white hover:text-gray-200">
              <FaLinkedin size={24} />
            </Link>
            <Link href="#" className="text-white hover:text-gray-200">
              <FaYoutube size={24} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
