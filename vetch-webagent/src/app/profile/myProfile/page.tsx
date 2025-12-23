"use client";

import { useEffect, useState } from "react";
import { Camera, ChevronRight, MapPin, User } from "lucide-react";
import Image from "next/image";
import { UserService } from "@/lib/services/UserService";
import { useSession } from "@/contexts/SessionContext";
import { UserValidator } from "@/lib/validators/UserValidator";
import SuccessDialog from "@/app/alert-dialog-box/SuccessDialog";
import ErrorDialog from "@/app/alert-dialog-box/ErrorDialogBox";
import { useLoading } from "@/contexts/LoadingContext";
import { LocationDialog } from "@/app/alert-dialog-box/LocationDialog";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  image: File | string | null;
}

export default function ProfilePage() {
  const [formData, setFormData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    image: null,
  });
  const [location, setLocation] = useState<string>("");

  const {setIsLoading} = useLoading();

  const { user } = useSession();

  const userService = new UserService();
  const userValidator = new UserValidator();

  const [openSuccess, setOpenSuccess] = useState(false);
  const [openFail, setOpenFail] = useState(false);
  const [showLocation, setShowLocation] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const validateUserInfo = userValidator.validateUpdateAccountInfo({
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      if (validateUserInfo.ok) {
        if (user && user.id) {
          const response = await userService.updateProfile(
            user.id,
            formData.firstName,
            formData.lastName,
            formData.image
          );
          console.log(response);
          if (response.ok) {
            setOpenSuccess(true);
            loadUser();
          }else{
            setOpenFail(true);
          }
        }
      }
    } catch (error) {console.log(error);}
    setIsLoading(false);
  };

  const loadUser = async () => {
    setIsLoading(true);
    try {
      if (user && user.id) {
        const response = await userService.fetchUserById(user.id);
        console.log(response);
        setLocation(response.data.locations[0].addressName || "");
        if (response.ok) {
          setFormData({
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            image: response.data.profilePicture || null,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Avatar */}
      <div className="w-full flex justify-center mt-10">
        <div className="relative w-[200px] h-[200px] rounded-full bg-gray-200">
          <div className="absolute z-100 w-[200px] h-[200px] bg-black/50 rounded-full flex flex-col items-center justify-center opacity-0 hover:opacity-100 duration-300 cursor-pointer">
            <input
              className="opacity-0 w-[200px] z-100 h-[200px] cursor-pointer rounded-full "
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            ></input>
            <Camera className="absolute w-10 z-0 h-10"/>
          </div>
          <Image
            src={
              formData.image
                ? formData.image instanceof File
                  ? URL.createObjectURL(formData.image)
                  : formData.image
                : "https://res.cloudinary.com/daimddpvp/image/upload/v1758101764/default-profile-pic_lppjro.jpg"
            }
            fill
            alt="profile picture"
            className="object-cover rounded-full"
          />
        </div>
      </div>

      {/* Profile Form */}
      <div className="relative mx-auto w-4/5 mt-10 bg-[#B3D8A8] dark:bg-[#357C72] rounded-lg shadow-lg p-6">
        {/* Paw Icon floating top-right */}
        <div className="absolute top-2 right-2">
          <Image src="/img/register/paw.png" alt="Paw" width={40} height={40} />
        </div>

          {/* Name */}
          <div className="flex gap-2">
            <div className="flex-1/2">
              <label className="block text-sm font-medium mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full rounded-md px-3 py-2 bg-[#fcffe5] dark:bg-[#2E4F4A] outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
            <div className="flex-1/2">
              <label className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full rounded-md px-3 py-2 bg-[#fcffe5] dark:bg-[#2E4F4A] outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled
              className="w-full rounded-md px-3 py-2 bg-[#fcffe5] dark:bg-[#2E4F4A] outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

        <button className="items-center mt-4 gap-4 p-4 rounded-xl bg-[#fcffe5] dark:bg-[#2E4F4A] hover:bg-gray-100 duration-200 shadow h-full w-full" onClick={() => setShowLocation(true)}>
          <div className="px-4 py-1 flex items-center gap-3">
            <MapPin className="w-5 h-5 flex-shrink-0 text-black mt-1 dark:text-white" />
            <div className="flex flex-col items-start">
              <div className="font-medium">Location</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{location}</div>
            </div>
            <ChevronRight className="w-5 h-5 flex-shrink-0 ml-auto text-black mt-1 dark:text-white" />
          </div>
        </button>

          {/* Buttons */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleUpdate}
              className="bg-white px-6 py-2 rounded-md shadow font-semibold hover:bg-gray-100 text-black"
            >
              Update
            </button>
          </div>
        <SuccessDialog open={openSuccess} onOpenChange={setOpenSuccess} message="Profile updated successfully!" />
        <ErrorDialog open={openFail} onOpenChange={setOpenFail} errors={["Failed to update profile!"]} />
        <LocationDialog 
          show={showLocation} 
          onClose={(data) => {if(data){setLocation(data.addressName)};setShowLocation(false);}}
        />
      </div>
    </div>
  );
}
