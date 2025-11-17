"use client";

import Image from "next/image";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { IoLockClosedOutline } from "react-icons/io5";
import { CiMail } from "react-icons/ci";
import SuccessDialog from "@/app/alert-dialog-box/SuccessLogin";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { UserValidator } from "@/lib/validators/UserValidator";
import { UserService } from "@/lib/services/UserService";
import { useTheme } from "next-themes";
import ToggleTheme from "@/components/ToggleTheme";
import { useLoading } from "@/contexts/LoadingContext";
import { NotificationService } from "@/lib/services/NotificationService";
import ErrorDialog from "../alert-dialog-box/ErrorDialogBox";
import { useSession } from "@/contexts/SessionContext";

interface IErrors {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [allowLogin, setAllowLogin] = useState(false);
  const [errors, setErrors] = useState<IErrors>({ email: "", password: "" });
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [role, setRole] = useState("");
  const router = useRouter();
  const userValidator = new UserValidator();
  const userService = new UserService();
  const { theme } = useTheme();
  const { setIsLoading } = useLoading();
  const {setIsNotificationPrompted} = useSession();
  const [userId, setUserId] = useState<string | null>(null);

  const nc = new NotificationService("/sw.js");  
  const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

  const subscribeNotification = async () => {
    console.log("Subscribing to notification...");
    console.log(await Notification.permission);
    if(Notification.permission === "default"){
      setIsNotificationPrompted(true);
      return;
    }else if(Notification.permission === "granted"){
      await nc.init();
      await nc.subscribe(VAPID_PUBLIC_KEY, userId || "");
    }
    
    console.log("Subscribing to notification 2...");
  };

  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      return;
    }
    const response = userValidator.validateLogin(email, password);
    if (!response.ok) {
      setAllowLogin(false);
      setErrors({ ...errors, ...response.errors });
    } else {
      setAllowLogin(true);
      setErrors({ email: "", password: "" });
    }
  }, [email, password]);

  const handleLogin = async () => {
    setIsLoading(true);
    const data = await userService.login(email, password, remember);
    if (data) {
      setRole(data.role);
      setUserId(data.id);
      setOpenSuccess(true);
    }else{
      setOpenError(true);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 bg-[#B3D8A8] dark:bg-[#357C72] flex flex-col justify-center px-8 md:px-16">
        {/* Logo */}
        <div className="flex justify-between">
          <div className="flex space-x-2">
            <Image
              src="/img/logo/logo-white.png"
              alt="Vetch Logo"
              width={40}
              height={40}
              className="mb-4"
            />
            <h1 className="text-white font-bold text-2xl mb-6">Vetch</h1>
          </div>
          <ToggleTheme />
        </div>

        {/* Title */}
        <div className="flex items-center justify-center">
          <h2 className="text-4xl font-bold text-white text-center">
            Welcome Back!
          </h2>
          <Image
            src="/img/register/paw.png"
            alt="Paw"
            width={100}
            height={100}
          />
        </div>

        <img src="/img/register/bone.png" alt="" />
        <form onSubmit={(e)=>{handleLogin(); e.preventDefault();}}>
          {/* User Login */}
          <h3 className="text-2xl font-bold mt-2 text-white">User Login</h3>

          {/* Email */}
          <div className="flex-col mb-4">
            <div className="relative space-y-3 mt-2">
              <CiMail className="absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="my-email-example@email-provider.com"
                className="bg-[#F4F9F4]/100 w-full rounded-lg p-2 placeholder:text-wrap dark:bg-[#2E4F4A]/100 border-none pl-10"
              />
            </div>
            {errors.email && (
              <span className="text-red-500 text-xs">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="flex-col mb-4">
            <div className="relative space-y-3">
              <IoLockClosedOutline className="absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="bg-[#F4F9F4] w-full rounded-lg p-2 h-fit dark:bg-[#2E4F4A]/100 border-none pl-10"
              />
            </div>
            {errors.password && (
              <span className="text-red-500 text-xs">{errors.password}</span>
            )}
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={remember}
                onCheckedChange={() => setRemember(!remember)}
              />
              <Label
                htmlFor="remember"
                className="text-sm cursor-pointer text-white"
              >
                Remember me?
              </Label>
            </div>

            <Link href="/forgotpassword" className="text-sm text-white hover:underline">
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <div className="flex justify-center items-center">
            <Button
              type="submit"
              disabled={!allowLogin}
              className="w-full bg-white text-black dark:bg-black dark:text-white hover:bg-gray-100 font-semibold cursor-pointer"
            >
              Login
            </Button>
          </div>
        </form>

        {/* Success Dialog */}
        <SuccessDialog
          open={openSuccess}
          onOpenChange={(val) => {
            setOpenSuccess(val);
            subscribeNotification();
            if (!val) {
              // Kalau dialog ditutup → redirect ke homepage
              if (role === "user") {
                router.push("/");
                // Ensure server components (layout) re-read session
                router.refresh();
              } else if (role === "vet") {
                router.push("/vet/dashboard");
                router.refresh();
              } else if (role === "admin") {
                router.push("/admin/dashboard");
                router.refresh();
              }
              // router.push("/");
            }
          }}
        />

        <ErrorDialog open={openError} onOpenChange={setOpenError} errors={["Invalid Password Or Username"]}/>

        {/* Sign Up Links */}
        <div className="mt-4 text-sm text-center">
          <p>Don’t have an account?</p>
          <div className="flex justify-center gap-4 mt-1">
            <Link
              href="/register/vet/account"
              className="text-[#00A6FF] font-medium hover:underline"
            >
              Sign Up as Vet
            </Link>
            <span>|</span>
            <Link
              href="/register/people/account"
              className="text-[#00A6FF] font-medium hover:underline"
            >
              Sign Up as Pet Owner
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden md:flex w-1/2 bg-[#3D8D7A] dark:bg-[#1F2D2A] relative flex-col items-center justify-between">
        <div className="flex-col mt-auto">
          {theme && (
            <img
              src={
                theme === "light"
                  ? "/img/login/foot-step.png"
                  : "/img/login/foot-step-dark.png"
              }
              alt="Pets Illustration"
              width={400}
              height={400}
              className="object-contain"
            />
          )}
          <h1 className="mt-24 text-white text-4xl font-semibold text-center">
            Caring for Your Pets, <br />
            Anytime, Anywhere
          </h1>
        </div>
        <img
          src="/img/login/girl-walking.png"
          alt="Pets Illustration"
          className="w-full object-contain justify-self-end"
        />
      </div>
    </div>
  );
}
