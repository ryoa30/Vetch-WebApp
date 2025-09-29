"use client";

import Image from "next/image";
import { Banknote , Dog, ClipboardPlus, List, Star } from "lucide-react";

export default function PaymentConfirmation() {
  return (
    <div className="min-h-screen bg-[#FAFFD9] flex flex-col items-center p-6 space-y-6">
      {/* Header */}
      <div className="flex w-full items-center gap-2 text-green-800 font-semibold text-lg">
        <Banknote  className="w-5 h-5" />
        <span>Payment Confirmation</span>
      </div>

      {/* QR Section */}
      <div className="flex flex-col items-center space-y-4">
        <div className="p-4 bg-white rounded-xl shadow">
          <Image
            src="/img/payment/qr-placeholder.png" // replace with real QR
            alt="QRIS"
            width={200}
            height={200}
          />
        </div>
        <h2 className="text-xl font-bold text-blue-600">QRIS</h2>
        {/* Payment Waiting Animation */}
        <div className="relative flex items-center justify-center">
          <div className="animate-ping absolute inline-flex h-20 w-20 rounded-full bg-blue-400 opacity-50"></div>
          <div className="relative flex items-center justify-center h-20 w-20 rounded-full border-2 border-dashed border-blue-500">
            <span className="text-2xl">💲</span>
          </div>
        </div>
        <p className="font-medium text-gray-700">Waiting for Payment</p>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Doctor Card */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-white shadow">
          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">IMG</span>
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold">Dr. Seemore</h3>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>4.9 | 500 Reviews</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {["Dermatology", "Nutrition", "Cardiology", "Immunology"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded-md bg-gray-100 text-xs font-medium"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="rounded-xl bg-white shadow p-4">
          <h3 className="text-lg font-semibold text-green-800 mb-3">Details</h3>

          {/* Date Row */}
          <div className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center gap-3">
              <Banknote  className="w-5 h-5 text-gray-700" />
              <div>
                <p className="font-medium">22 Apr 2025 at 22:00</p>
                <p className="text-sm text-gray-500">Consultation Time</p>
              </div>
            </div>
          </div>

          {/* Pet Row */}
          <div className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center gap-3">
              <Dog className="w-5 h-5 text-gray-700" />
              <div>
                <p className="font-medium">Pet</p>
                <p className="text-sm text-gray-500">Seemore</p>
              </div>
            </div>
          </div>

          {/* Concerns Row */}
          <div className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center gap-3">
              <ClipboardPlus className="w-5 h-5 text-gray-700" />
              <div>
                <p className="font-medium">Concerns</p>
                <p className="text-sm text-gray-500">
                  Flea and Tick, Ear Infection
                </p>
              </div>
            </div>
          </div>

          {/* Illness Row */}
          <div className="flex items-center gap-3 py-2">
            <List className="w-5 h-5 text-gray-700" />
            <div>
              <p className="font-medium">Illness Description</p>
              <p className="text-sm text-gray-400">Add Consultation Reason</p>
            </div>
          </div>
        </div>

        {/* Price Card */}
        <div className="rounded-xl bg-white shadow p-4 md:col-span-2">
          <h3 className="text-lg font-semibold text-green-800 mb-3">Price</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Appointment Fee</span>
              <span>IDR 110.000</span>
            </div>
            <div className="flex justify-between">
              <span>Tax 10%</span>
              <span>IDR 11.000</span>
            </div>
            <div className="flex justify-between">
              <span>Service 5%</span>
              <span>IDR 5.500</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2">
              <span>Grand Total</span>
              <span className="text-green-700">IDR 115.500</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
