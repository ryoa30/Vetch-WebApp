"use client"
import React, { useState } from "react";

export default function ForgotPasswordPage(){
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  function validateEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Email wajib diisi.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Format email tidak valid.");
      return;
    }
    setIsSent(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#B3D8A8] dark:bg-[#357C72] p-6">
      <div className="w-full max-w-md">
        <div className="bg-white/90 dark:bg-[#074f48]/95 backdrop-blur-md rounded-2xl shadow-lg p-8 sm:p-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-none w-12 h-12 rounded-full bg-[#3D8D7A] dark:bg-[#1f665e] grid place-items-center text-white font-semibold">
              🔒
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Forgot Password</h1>
              <p className="text-sm text-gray-600 dark:text-gray-200">Enter your email to receive password reset instructions.</p>
            </div>
          </div>

          {!isSent ? (
            <form onSubmit={handleSubmit} noValidate>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=""
                className="w-full rounded-md border border-gray-200 dark:border-[#225a53] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D8D7A] dark:focus:ring-[#1f665e] transition-shadow bg-white dark:bg-transparent text-gray-900 dark:text-gray-100"
              />

              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-semibold shadow-sm hover:shadow-md active:scale-98 transition-transform bg-[#3D8D7A] text-white"
              >
                Send Reset Link
              </button>
            </form>
          ) : (
            <div className="rounded-md border border-green-200 bg-green-50/80 p-4">
              <h2 className="text-sm font-medium text-green-800">Permintaan Terkirim</h2>
              <p className="mt-2 text-sm text-green-700">Kami telah mengirimkan email berisi instruksi reset kata sandi (cek folder spam jika tidak terlihat).</p>
              <button
                onClick={() => {
                  setEmail("");
                  setIsSent(false);
                }}
                className="mt-4 inline-block text-sm underline"
              >
                Kembali
              </button>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-200">
            <a href="/login" className="underline">Back to login page</a>
          </div>
        </div>
      </div>
    </div>
  );
}