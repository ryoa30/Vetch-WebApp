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

interface IErrors{
  email: string;
  password: string;
}

export default function LoginPage() {
  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [allowLogin, setAllowLogin] = useState(false);
  const [errors, setErrors] = useState<IErrors>({email: "", password: ""});
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [role, setRole] = useState("");
  const router = useRouter();
  const userValidator = new UserValidator();
  const userService = new UserService();
  

  useEffect(() => {
    if(isFirstLoad){
      setIsFirstLoad(false);
      return;
    }
    const response = userValidator.validateLogin(email, password);
    if(!response.ok){
      setAllowLogin(false);
      setErrors({...errors ,...response.errors});
    }else{
      setAllowLogin(true);
      setErrors({email: "", password: ""});
    }
  }, [email, password])

  const handleLogin = async () => {
    const role = await userService.login(email, password, remember);
    if(role){
      setRole(role);
      setOpenSuccess(true);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 bg-[#B3D8A8] flex flex-col justify-center px-8 md:px-16">
        {/* Logo */}
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

        {/* User Login */}
        <h3 className="text-2xl font-bold mt-2 text-white">User Login</h3>

        {/* Email */}
        <div className="flex-col mb-4">
          <div className="relative space-y-3 mt-2">
            <CiMail className="absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email must contains @ and verified"
              className="bg-[#F4F9F4] border-none pl-10"
            />
          </div>
          {errors.email &&<span className="text-red-500 text-xs">{errors.email}</span>}
        </div>

        {/* Password */}
        <div className="flex-col mb-4">
          <div className="relative space-y-3">
            <IoLockClosedOutline className="absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password must be at least 8 characters"
              className="bg-[#F4F9F4] border-none pl-10"
            />
          </div>
          {errors.password &&<span className="text-red-500 text-xs">{errors.password}</span>}
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Checkbox checked={remember} onCheckedChange={() => setRemember(!remember)}/>
            <Label htmlFor="remember" className="text-sm cursor-pointer text-white">
              Remember me?
            </Label>
          </div>

          <Link href="#" className="text-sm text-white hover:underline">
            Forgot Password?
          </Link>
        </div>

        {/* Login Button */}
        <div className="flex justify-center items-center">
          <Button
            onClick={handleLogin}
            disabled={!allowLogin}
            className="w-full bg-white text-black hover:bg-gray-100 font-semibold cursor-pointer"
          >
            Login
          </Button>
        </div>

        {/* Success Dialog */}
        <SuccessDialog open={openSuccess} 
        onOpenChange={(val) => {
            setOpenSuccess(val);
            if (!val) {
              // Kalau dialog ditutup → redirect ke homepage
              if(role === "user") {
                router.push('/');
                // Ensure server components (layout) re-read session
                router.refresh();
              }else if(role === "vet") {
                router.push('/vet/dashboard');
              }else if(role === "admin") {
                router.push('/admin/dashboard');
                router.refresh();
              }
              // router.push("/");
            }
          }}
        />

        {/* Sign Up Links */}
        <div className="mt-4 text-sm text-center">
          <p>Don’t have an account?</p>
          <div className="flex justify-center gap-4 mt-1">
            <Link
              href="/register/vet/account"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign Up as Vet
            </Link>
            <span>|</span>
            <Link
              href="/register/people/account"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign Up as Pet Owner
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden md:flex w-1/2 bg-[#3D8D7A] relative flex-col items-center justify-center">
        <Image
          src="/img/login/foot-step.png"
          alt="Pets Illustration"
          width={400}
          height={400}
          className="object-contain"
        />
        <h1 className="mt-24 text-white text-4xl font-semibold text-center">
          Caring for Your Pets, <br />Anytime, Anywhere
        </h1>
        <Image
          src="/img/login/girl-walking.png"
          alt="Pets Illustration"
          width={400}
          height={400}
          className="object-contain"
        />
      </div>
    </div>
  );
}
