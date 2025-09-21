"use client"

import { Star, QrCode, Building, Smartphone } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function ConfirmBookingPage() {
    const [consultationType, setConsultationType] = useState("Homecare");
    const [paymentMethod, setPaymentMethod] = useState("Gopay");

    return (
        <main className="bg-[#F5F5F5] dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <div className="min-h-screen bg-[#FBFFE4] dark:bg-[#2E4F4A] p-8">
                <div className="flex items-center mb-6">
                    <h1 className="text-2xl font-semibold text-green-900 dark:text-gray-200">
                        Confirm your consultation booking{" "}
                        <span className="font-normal text-gray-700  dark:text-gray-200">
                            | 22 Apr 2025 at 22:00
                        </span>
                    </h1>
                    <div className="ml-10">
                        <Image
                            src="/img/login/foot-step.png"
                            alt="Pets Illustration"
                            width={400}
                            height={400}
                            className="object-contain"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-10">
                    <div className="space-y-6 h-full">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-[#2D4236] shadow h-full">
                            <div className="w-24 h-24 rounded-xl bg-gray-200 flex items-center justify-center">
                                <Image
                                    src="/placeholder.png"
                                    alt="Doctor"
                                    width={96}
                                    height={96}
                                    className="rounded-xl"
                                />
                            </div>
                            <div className="ml-4">
                                <h2 className="text-lg font-semibold">Dr. Seemore</h2>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Star className="w-4 h-4 text-green-600 fill-green-600 mr-1 stroke-black" />
                                    <span className="dark:text-gray-200">4.9 | 500 Reviews</span>
                                </div>
                                <p className="text-sm font-semibold mt-2 text-green-900 dark:text-gray-200">Specialty</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {["Dermatology", "Nutrition", "Cardiology", "Immunology"].map(
                                    (tag) => (
                                        <span key={tag} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-black border text-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 h-full">
                        <div className="items-center gap-4 p-4 rounded-xl bg-white dark:bg-[#2D4236] shadow h-full">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    {/* <Dog className="w-5 h-5 text-black" /> */}
                                    <span className="font-medium">Pet</span>
                                </div>
                                <span className="text-sm text-gray-500">Seemore</span>
                            </div>

                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    {/* <PlusCircle className="w-5 h-5 text-black" /> */}
                                    <span className="font-medium">Concerns</span>
                                </div>
                                <span className="text-sm text-gray-400">Select Concerns</span>
                            </div>

                            <div>
                                <div className="flex">
                                    {/* <FileText className="w-5 h-5 text-black" /> */}
                                    <span className="font-medium">Illness Description</span>
                                </div>
                                <span className="text-sm text-gray-400">Add Consultation Reason Description</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-10">
                    <div className="space-y-6 h-full">
                        <div className="p-4 bg-white dark:bg-[#2D4236] rounded-xl shadow">
                            <p className="font-semibold mb-3 text-green-900 dark:text-gray-200">
                            Consultation Type
                            </p>
                            <div className="flex gap-3">
                            <button
                                onClick={() => setConsultationType("Homecare")}
                                className={`flex-1 px-4 py-2 rounded-full font-medium ${
                                consultationType === "Homecare"
                                    ? "bg-green-700 text-white dark:text-black dark:bg-white"
                                    : "bg-white dark:bg-[#2D4236] shadow-md border-white"
                                }`}
                            >
                                Homecare
                            </button>
                            <button
                                onClick={() => setConsultationType("Online")}
                                className={`flex-1 px-4 py-2 rounded-full font-medium ${
                                consultationType === "Online"
                                    ? "bg-green-700 text-white dark:text-black dark:bg-white"
                                    : "bg-white dark:bg-[#2D4236] shadow-md border-white"
                                }`}
                            >
                                Online
                            </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 h-full">
                        <div className="items-center gap-4 p-4 rounded-xl bg-white dark:bg-[#2D4236] shadow h-full">
                            <div className="p-4 flex items-start gap-3">
                                {/* <MapPin className="w-5 h-5 text-black mt-1" /> */}
                                <p className="text-sm text-gray-600 dark:text-gray-200">
                                    Jl. ABC Blok A No. 01, Perumahan ABC, Kelurahan X, Kecamatan Y,
                                    Kota X, DKI Jakarta
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                

                {/* Price and Payment Section */}
                <div className="flex dark:text-gray-200 gap-4 p-4 rounded-xl bg-white dark:bg-[#2D4236] shadow h-full">
                    {/* Price Section */}
                    <div className="w-2/3 pr-4 border-r ">
                        <p className="font-semibold text-green-900 dark:text-gray-200 mb-3">Price</p>
                        <div className="flex justify-between text-sm py-1">
                            <span>Appointment Fee</span>
                            <span>IDR 110.000</span>
                        </div>
                        <div className="flex justify-between text-sm py-1">
                            <span>Tax <sup>10%</sup></span>
                            <span>IDR 11.000</span>
                        </div>
                        <div className="flex justify-between text-sm py-1">
                            <span>Service <sup>5%</sup></span>
                            <span>IDR 5.500</span>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-between font-semibold text-green-900 dark:text-gray-200">
                            <span>Grand Total</span>
                            <span>IDR 115.500</span>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button className="px-6 py-2 rounded-full bg-green-700 text-white font-semibold hover:bg-green-800">
                                Confirm and Book
                            </button>
                        </div>
                    </div>

                    {/* Pay Using Section */}
                    <div className="w-1/3 pl-4 gap-4 p-4 rounded-xl bg-white dark:bg-[#2D4236] shadow h-full">
                        <p className="font-semibold text-green-900 dark:text-gray-200 mb-3">Pay Using</p>
                        <div className="space-y-3">
                        {[
                            { label: "QRIS", icon: <QrCode className="w-5 h-5" /> },
                            { label: "Virtual Account", sub: "Only for BCA", icon: <Building className="w-5 h-5" /> },
                            { label: "Gopay", icon: <Smartphone className="w-5 h-5" /> },
                            ].map(({ label, sub, icon }) => (
                            <label
                                key={label}
                                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${
                                paymentMethod === label ? "border-green-600 bg-green-50" : "hover:bg-gray-50"
                                }`}>
                                <div className="flex items-center gap-2">
                                    {icon}
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{label}</span>
                                        {sub && <span className="text-xs text-gray-500">{sub}</span>}
                                    </div>
                                </div>
                                <input
                                    type="radio"
                                    name="payment"
                                    value={label}
                                    checked={paymentMethod === label}
                                    onChange={() => setPaymentMethod(label)}
                                    className="accent-green-600 w-4 h-4"/>
                            </label>
                            ))}
                        </div>
                    </div>
                </div>                
            </div>


        {/* Hero Section */}
        {/* <section className="bg-[#A3D1C6] dark:bg-teal-800 flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-12 gap-8">
            <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white">
                Caring for Your Pets, <br />
                <span className="italic font-normal text-gray-700 dark:text-gray-300">
                Anytime, Anywhere
                </span>
            </h1>
            <p className="mt-4 text-gray-700 dark:text-gray-300 max-w-md">
                Connect with certified veterinarians for expert advice and treatment
                for your pet's health.
            </p>
            </div>
            <div className="flex-1 flex justify-center">
            <Image
                src="/img/about-us.png"
                alt="Pet Hero"
                width={300}
                height={300}
                className="rounded-lg"
            />
            </div>
        </section> */}

        
        </main>
    );
}
