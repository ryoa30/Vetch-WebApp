"use client";

import { useState } from "react";
import NavigationBar from "@/components/navigationbar";
import Footer from "@/components/footer2";

export default function HomePage() {
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation at the top */}
      <NavigationBar />

      {/* Page content */}
      <div className="flex flex-4 flex-col bg-[#FBFFE4]">
        <div className="flex flex-col md:flex-row py-20 justify-center w-full">
          {/* Left Side - Text */}
          <div className="max-w-lg text-center md:text-left mb-10 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900">
              Caring for Your Pets,
            </h1>
            <h2 className="italic text-2xl text-gray-800 mb-4">
              Anytime, Anywhere
            </h2>
            <p className="text-gray-600">
              Connect with certified veterinarians for expert advice and
              treatment for your pet’s health.
            </p>
          </div>

          {/* Right Side - Hexagon Image */}
          <div className="ml-auto mt-6 md:mt-0 md:ml-10">
            <div className="hexagon">
              <img src="/dog.png" // 🔹 replace with your image path
                alt="Dog with owner"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-1 bg-[#B3D8A8] flex-col md:flex-row justify-center items-center p-12">
          <div className="hexagon">
            <img
              src="/images/about.jpg"
              alt="About Us"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:ml-10 mt-6 md:mt-0 max-w-xl mb-10 md:mb-0">
            <h2 className="text-3xl font-bold mb-4">About Us</h2>
            <p className="text-white">
              Vetch is a telemedicine platform built to connect pet owners with
              certified veterinarians through online consultations. Our mission is
              to make pet healthcare more accessible, reliable, and convenient
              for everyone—anytime, anywhere.
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col md:flex-row justify-center items-center p-12">
          <div className="md:mr-10 mb-6 md:mb-0 max-w-xl mb-10 md:mb-0">
            <h2 className="text-3xl font-bold mb-4 text-black">Our Vision</h2>
            <p className="text-black">
              Vetch aims to address the significant challenges in Indonesian veterinary care, 
              including a shortage of veterinarians (only around 13,500 available against an estimated 
              need for 50,000 in 2024)78 and difficult access to facilities, which results in only 
              29.5% of pets visiting a vet910. We envision Vetch as an innovative platform that 
              simplifies the process of finding, booking, and consulting with veterinarians efficiently, 
              significantly easing pet owners' access to vital services and enhancing the overall 
              quality of animal care
            </p>
          </div>
          <div className="hexagon">
            <img
              src="/images/vision.jpg"
              alt="Our Vision"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-1 bg-[#B3D8A8] flex-col md:flex-row justify-center items-center p-12">
          <div className="hexagon">
            <img
              src="/images/mission.jpg"
              alt="Our Mission"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:ml-10 mt-6 md:mt-0 max-w-xl mb-10 md:mb-0">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-white">Vetch is committed to:</p>
            <ul className="list-disc list-inside">
              <li>Enhancing Accessibility and Convenience for Pet Owners: We strive to provide pet owners with easy and practical access to veterinary health services anytime and anywhere through a digital application.</li>
              <li>Facilitating Comprehensive Pet Health Management: Our goal is to improve access and simplify the tracking of animal health history, such as vaccination schedules, treatments, and behavioral changes, by providing digital medical records to aid accurate diagnoses and service efficiency.</li>
              <li>Empowering Veterinarians and Building Trust: We aim to assist veterinarians in managing practice schedules efficiently, accepting and processing service bookings, and monitoring the health history of pets with ongoing conditions, enabling them to reach more owners and run more organized services.</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}


