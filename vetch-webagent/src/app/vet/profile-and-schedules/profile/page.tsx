"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// 1. Impor komponen modal yang baru dibuat
import AddSpeciesModal from "@/app/vet/components/overlay/OverlayPetAddSpecies";
import { useEffect, useState } from "react";
import { VetService } from "@/lib/services/VetService";
import { useSession } from "@/contexts/SessionContext";
import { UserWithRelations, VetData, VetWithSpeciesType } from "@/app/types";
import { VetValidator } from "@/lib/validators/VetValidator";
import ErrorDialog from "@/app/alert-dialog-box/ErrorDialogBox";
import { PriceInput } from "@/components/PriceInput";
import { UserService } from "@/lib/services/UserService";
import { LocationDialog } from "@/app/alert-dialog-box/LocationDialog";
import { ChevronRight, MapPin, X } from "lucide-react";
import ConfirmationDialogBox from "@/app/alert-dialog-box/ConfirmationDialogBox";

export default function ProfilePage() {
  const { user } = useSession();
  const [profileImage, setProfileImage] = useState<File | string | null>(null);
  const [vetDetails, setVetDetails] = useState<VetWithSpeciesType | null>(null);
  const [hover, setHover] = useState<number>(-1);

  const vetService = new VetService();
  const userService = new UserService();
  const vetValidator = new VetValidator();

  const [errors, setErrors] = useState<any>({});
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [locationVisible, setLocationVisible] = useState(false);

  const loadVetDetails = async () => {
    try {
      const response = await vetService.fetchVetDetailsByUserId(user!.id);
      if (response.ok) {
        setVetDetails(response.data as VetWithSpeciesType);
        setProfileImage(response.data.user?.profilePicture || null);
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const validate = vetValidator.validateVetInfo(
        vetDetails!.user?.firstName || "",
        vetDetails!.user?.lastName || "",
        vetDetails!.price,
        vetDetails!.description
      );
      if (!validate.ok) {
        console.log("Validation errors:", validate.errors);
        setErrors(validate.errors);
        setIsErrorVisible(true);
        return;
      } else {
        setErrors({});
        const { speciesHandled, user, ...vetData } = vetDetails!;
        const result = await vetService.updateVetDetails(vetData as VetData);
        const result2 = await userService.updateProfile(
          user?.id || "",
          user?.firstName || "",
          user?.lastName || "",
          profileImage
        );
        console.log(result);
        if (result.ok && result2.ok) {
          console.log("Vet details updated successfully");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteSpecies = async (speciesId) => {
    try {
      const result = await vetService.deleteVetSpecies(vetDetails!.id, speciesId);
      if(result.ok){
        setVetDetails((prev) => {
          if(!prev) return prev;
          return {
            ...prev,
            speciesHandled: prev.speciesHandled.filter(sh => sh.id !== speciesId)
          }
        })
      }
    } catch (error) {
      console.log(error);
    }
  } 

  useEffect(() => {
    loadVetDetails();
  }, []);


  return (
    <div className="sm:p-6 mt-2 min-h-screen">
      <div className="bg-white dark:bg-[#1F2D2A] rounded-xl shadow-md p-6 max-w-2xl mx-auto">
        {/* Profile Picture */}
        <div className="w-full flex justify-center mt-10">
          <div className="relative w-[200px] h-[200px] rounded-full bg-gray-200">
            <input
              className="absolute z-100 w-[200px] h-[200px] opacity-0 cursor-pointer rounded-full"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            ></input>
            <Image
              src={
                profileImage
                  ? profileImage instanceof File
                    ? URL.createObjectURL(profileImage)
                    : profileImage
                  : "https://res.cloudinary.com/daimddpvp/image/upload/v1758101764/default-profile-pic_lppjro.jpg"
              }
              fill
              alt="profile picture"
              className="object-cover rounded-full"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Email</label>
          <Input
            value={vetDetails?.user?.email || ""}
            readOnly
            className="bg-gray-200 cursor-not-allowed"
          />
        </div>

        {/* Name */}
        <div className="flex gap-2">
          <div className="flex-1/2">
            <label className="block text-sm font-medium mb-1">First Name</label>
            <Input
              type="text"
              name="firstName"
              value={vetDetails?.user?.firstName || ""}
              onChange={(e) =>
                setVetDetails({
                  ...vetDetails!,
                  user: {
                    ...vetDetails!.user,
                    firstName: e.target.value,
                  } as UserWithRelations,
                })
              }
              className="flex items-end"
            />
          </div>
          <div className="flex-1/2">
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <Input
              type="text"
              name="lastName"
              value={vetDetails?.user?.lastName || ""}
              onChange={(e) =>
                setVetDetails({
                  ...vetDetails!,
                  user: {
                    ...vetDetails!.user,
                    lastName: e.target.value,
                  } as UserWithRelations,
                })
              }
              className="flex items-end"
            />
          </div>
        </div>

        {/* Price and Location */}
        <div className="mb-4 flex gap-2">
          <div className="flex-1">
            <label className="block font-medium mb-1">Price</label>
            <PriceInput
              value={vetDetails?.price}
              onChange={(value) =>
                setVetDetails({
                  ...vetDetails!,
                  price: value,
                })
              }
            />
          </div>
        </div>

        <div className="space-y-6 h-full">
          <button
            className="items-center flex justify-between gap-4 p-4 rounded-xl bg-white dark:bg-input/30 hover:bg-gray-100 duration-200 w-full h-full border-2 border-gray-200"
            onClick={() => setLocationVisible(true)}
          >
            <div className="p-1 flex items-center gap-3">
              <MapPin className="w-8 h-8 flex-shrink-0 text-black mt-1 dark:text-white" />
              <div className="flex flex-col items-start">
                <div className="font-medium">Location</div>
                <p className="text-sm text-gray-600 dark:text-gray-200 text-justify">
                  {vetDetails && vetDetails?.user && vetDetails?.user.locations
                    ? vetDetails?.user?.locations[0].addressName
                    : "No address found, please set your address in profile page."}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 flex-shrink-0 text-black mt-1 dark:text-white" />
          </button>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Description</label>
          <Textarea
            className="min-h-[100px]"
            value={vetDetails?.description || ""}
            onChange={(e) =>
              setVetDetails({
                ...vetDetails!,
                price: parseFloat(e.target.value),
              })
            }
          />
        </div>

        {/* Species */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Species</label>
          <div className="flex flex-wrap gap-2 items-center">
            {vetDetails?.speciesHandled.map((species, index) => (
              <div className="relative"
                key={species.speciesType.speciesName}
                onMouseEnter={()=>setHover(index)}
                onMouseLeave={() => setHover(-1)}
              >
                <Button
                  variant="outline"
                  className="bg-white dark:bg-white border border-gray-400 text-black hover:bg-gray-100"
                >
                  {species.speciesType.speciesName}
                </Button>
                <ConfirmationDialogBox message="Are you sure you want to remove this species?" subMessage="The added species will be removed" onConfirm={() => handleDeleteSpecies(species.id)}>
                  <button className={`absolute -top-2 -right-2 bg-black p-1 rounded-md hover:bg-red-500 transition-all duration-200 ${hover === index ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <X className="w-3 h-3 text-white "/>
                  </button>
                </ConfirmationDialogBox>
              </div>
            ))}
            {/* 2. Gunakan komponen modal di sini */}
            {vetDetails && (
              <AddSpeciesModal
                vetId={vetDetails.id}
                onAction={(item) => {
                  setVetDetails((prev) => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      speciesHandled: [
                        ...((prev.speciesHandled ?? []) as typeof prev.speciesHandled),
                        item,
                      ],
                    };
                  });
                }}
                speciesHandled={vetDetails.speciesHandled}
              />
            )}
          </div>
        </div>

        <div>
          <button
            className="w-full bg-teal-700 hover:bg-teal-800 text-white py-2 rounded-md font-semibold duration-200"
            onClick={handleSaveChanges}
          >
            Save Changes
          </button>
        </div>
        <ErrorDialog
          errors={Object.values(errors)}
          open={isErrorVisible}
          onOpenChange={() => setIsErrorVisible(false)}
        />
        <LocationDialog
          onClose={(e) => {
            if(e){
              setVetDetails((prev) => {
                if (!prev?.user?.locations?.length) return prev;
                const updatedLocations = prev.user.locations.map((loc, idx) =>
                  idx === 0 ? { ...loc, addressName: e.addressName } : loc
                );
                return {
                  ...prev,
                  user: {
                    ...prev.user,
                    locations: updatedLocations,
                  },
                };
              });
            }
            setLocationVisible(false);
          }}
          show={locationVisible}
        />
      </div>
    </div>
  );
}
