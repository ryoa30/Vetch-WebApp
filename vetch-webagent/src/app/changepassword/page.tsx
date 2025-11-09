"use client"
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeClosed } from "lucide-react";
import { UserService } from "@/lib/services/UserService";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const router = useRouter();
  const userService = new UserService();

  const sp = useSearchParams();
  const email = sp.get("email");
  const key = sp.get("key");

  useEffect(()=> {
    console.log(email, key);
    if (!email || !key) (
      router.push("/login")
    )
  }, [email, key])

  function validate() {
    setError(null);
    if (!password || !confirm) {
      setError("Please fill out both fields.");
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return false;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const result = await userService.resetPassword(email!, password, key!);
    if (!result.ok) {
      setError(result.message || "Failed to reset password. Please try again.");
      return;
    }
    setIsSuccess(true);
    setInterval(()=>{
      router.push("/login");
    }, 5000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#B3D8A8] dark:bg-[#357C72] p-5">
      <div className="w-full max-w-md">
        <div className="bg-white/90 dark:bg-[#074f48]/95 backdrop-blur-md rounded-2xl shadow-lg p-8 sm:p-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-none w-12 h-12 rounded-full bg-[#3D8D7A] dark:bg-[#1f665e] grid place-items-center text-white font-semibold">
              🔑
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Set New Password</h1>
              <p className="text-sm text-gray-600 dark:text-gray-200">Enter your new password below and confirm to complete the reset.</p>
            </div>
          </div>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} noValidate>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">New Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={"text"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className={`${showPasswordNew?"":"password-mask"} w-full rounded-md border border-gray-200 dark:border-[#225a53] px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-[#3D8D7A] dark:focus:ring-[#1f665e] transition-shadow bg-white dark:bg-transparent text-gray-900 dark:text-gray-100`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordNew((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs opacity-80"
                >
                  {showPasswordNew && <Eye className="h-5 w-5 text-gray-500" />}
                  {!showPasswordNew && <EyeClosed className="h-5 w-5 text-gray-500" />}
                </button>
              </div>

              <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mt-4 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirm"
                  type={"text"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Confirm your new password"
                  className={`${showPasswordConfirm?"":"password-mask"} w-full rounded-md border border-gray-200 dark:border-[#225a53] px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-[#3D8D7A] dark:focus:ring-[#1f665e] transition-shadow bg-white dark:bg-transparent text-gray-900 dark:text-gray-100`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs opacity-80"
                >
                  {showPasswordConfirm && <Eye className="h-5 w-5 text-gray-500" />}
                  {!showPasswordConfirm && <EyeClosed className="h-5 w-5 text-gray-500" />}
                </button>
              </div>

              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-semibold shadow-sm hover:shadow-md active:scale-98 transition-transform bg-[#3D8D7A] text-white"
              >
                Set New Password
              </button>
            </form>
          ) : (
            <div className="rounded-md border border-green-200 bg-green-50/80 p-4">
              <h2 className="text-sm font-medium text-green-800">Password Reset</h2>
              <p className="mt-2 text-sm text-green-700">Your password has been successfully updated. You can now sign in with your new password.</p>
              <a href="/login" className="mt-4 inline-block text-sm underline">Go to sign in</a>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
