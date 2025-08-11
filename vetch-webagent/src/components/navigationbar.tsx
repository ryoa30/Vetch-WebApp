import { useState, useEffect, useRef } from "react";
import { ThemeToggleSwitch } from "@/components/ui/togglebutton";
import Image from "next/image";

export default function NavigationBar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [clickedMenu, setClickedMenu] = useState(null);
  const parentsRef = useRef(null);
  const accountRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        parentsRef.current &&
        !parentsRef.current.contains(e.target) &&
        accountRef.current &&
        !accountRef.current.contains(e.target)
      ) {
        setOpenMenu(null);
        setClickedMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dropdown item component for reuse
  const Dropdown = ({ children }) => (
    <div className="absolute mt-2 bg-[#b4d7c6] rounded-md shadow-lg py-2 w-40 transition-all duration-500 ease-out">
      {children}
    </div>
  );

  return (
    <nav className="w-full bg-[#439484] px-6 py-3 flex items-center justify-between rounded-b-lg shadow-md">
      {/* Logo */}
      <div className="flex items-center">
        <Image src="/file.svg" alt="Logo" width={40} height={40} className="mr-3" />
      </div>

      {/* Menu */}
      <div className="flex-1 flex items-center justify-center space-x-8">
        {/* For Pet Parents */}
        <div
          ref={parentsRef}
          className="relative"
          onMouseEnter={() => {
            if (!clickedMenu)
              setTimeout(() => setOpenMenu("parents"), 200);
          }}
          onMouseLeave={() => {
            if (!clickedMenu)
              setTimeout(() => setOpenMenu(null), 200);
          }}
          onClick={() => {
            if (clickedMenu === "parents") {
              setClickedMenu(null);
              setOpenMenu(null);
            } else {
              setClickedMenu("parents");
              setOpenMenu("parents");
            }
          }}
        >
          <span className="font-semibold text-white text-lg cursor-pointer flex items-center">
            For Pet Parents <span className="ml-1">&#9660;</span>
          </span>
          {openMenu === "parents" && (
            <Dropdown>
              <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-[#a1cbb5]">Consultation</a>
              <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-[#a1cbb5]">Homecare</a>
              <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-[#a1cbb5]">Emergency</a>
            </Dropdown>
          )}
        </div>

        <span className="font-semibold text-white text-lg cursor-pointer">Blog</span>
        <span className="font-semibold text-white text-lg cursor-pointer">About Us</span>
      </div>

      {/* Icons */}
      <div className="flex items-center space-x-4">
        {/* Account Icon */}
        <div
          ref={accountRef}
          className="relative"
          onMouseEnter={() => {
            if (!clickedMenu) setTimeout(() => setOpenMenu("account"), 200);
          }}
          onMouseLeave={() => {
            if (!clickedMenu) setTimeout(() => setOpenMenu(null), 200);
          }}
          onClick={() => {
            if (clickedMenu === "account") {
              setClickedMenu(null);
              setOpenMenu(null);
            } else {
              setClickedMenu("account");
              setOpenMenu("account");
            }
          }}
        >
          <Image src="/window.svg" alt="User" width={28} height={28} className="cursor-pointer" />
          {openMenu === "account" && (
            <Dropdown>
              <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-[#a1cbb5]">Edit Profile</a>
              <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-[#a1cbb5]">Order History</a>
              <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-[#a1cbb5]">Pets</a>
              <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-[#a1cbb5]">Logout</a>
            </Dropdown>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <Image src="/globe.svg" alt="Notifications" width={28} height={28} />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </div>

        {/* Theme Toggle */}
        <ThemeToggleSwitch
            defaultOn={true}
            onToggle={(state) => console.log("Theme is now:", state ? "Light" : "Dark")}
            />
      </div>
    </nav>
  );
}
