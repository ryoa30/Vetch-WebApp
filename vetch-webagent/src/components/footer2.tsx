"use client";

import { FaInstagram, FaFacebook, FaLinkedin, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#3d8b75] text-[#f6ffd8] px-12 py-6 flex flex-col md:flex-row justify-between items-center md:items-start">
      {/* Left section */}
      <div className="flex flex-col items-center md:items-start space-y-2">
        {/* Logo + Text */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-[#f6ffd8] text-[#3d8b75] flex items-center justify-center rounded-md font-bold">
            V
          </div>
          <h2 className="text-2xl font-bold">Vetch</h2>
        </div>
        <p className="text-lg font-semibold">Caring for Your Pets,</p>
        <p className="italic">Anytime, Anywhere</p>
      </div>

      {/* Right section */}
      <div className="flex flex-col items-center md:items-end mt-6 md:mt-0">
        <h3 className="font-bold text-lg mb-3">Our Socials</h3>
        <div className="flex flex-col space-y-2">
          <a href="#" className="flex items-center space-x-2 hover:underline">
            <FaInstagram />
            <span>vetster.id</span>
          </a>
          <a href="#" className="flex items-center space-x-2 hover:underline">
            <FaFacebook />
            <span>vetster.id</span>
          </a>
          <a href="#" className="flex items-center space-x-2 hover:underline">
            <FaLinkedin />
            <span>vetster.id</span>
          </a>
          <a href="#" className="flex items-center space-x-2 hover:underline">
            <FaYoutube />
            <span>vetster.id</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
