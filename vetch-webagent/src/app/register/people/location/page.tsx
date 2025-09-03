"use client";

import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useRegisterPeople } from "@/contexts/RegisterPeopleContext";
import { LocationService } from "@/lib/services/LocationService";
import { SearchableDropdown } from "@/components/SearchableDropdown";
import { UserValidator } from "@/lib/validators/UserValidator";
import { useRouter } from "next/navigation";
import { UserService } from "@/lib/services/UserService";
import { HttpClient } from "@/lib/http/HttpClient";
import { API_URL } from "@/constant/apiConstant";
import { setWithExpiry } from "@/lib/utils/localStorage";


interface IOptions {
  value: string;
  label: string;
}

interface ILocationResponse {
  index: string;
  formattedAddress: string;
  addressLabel: string;
  postalCode: string;
  urbanVillalges: string;
  district: string;
  city: string;
  province: string;
  latitude: string;
  longitude: string;
}

interface IErrors {
  address?: string;
  addressNotes?: string;
  urbanVillage?: string;
  district?: string;
  province?: string;
  postalCode?: string;
}

const RegisterLocationPage = () => {
  // const [provinces, setProvinces] = useState<IOptions[]>([]);
  // const [cities, setCities] = useState<IOptions[]>([]);
  // const [districts, setDistricts] = useState<IOptions[]>([]);
  // const [urbanVillages, setUrbanVillages] = useState<IOptions[]>([]);
  const userValidator = new UserValidator();
  const userService = new UserService(new HttpClient({ baseUrl: API_URL.USER }));
  const locationService = new LocationService();
  const [autocomplete, setAutocomplete] = useState<ILocationResponse[]>([]);
  const [addresses, setAddresses] = useState<IOptions[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [errors, setErrors] = useState<IErrors>({
    address: "",
    addressNotes: "",
    urbanVillage: "",
    district: "",
    province: "",
    postalCode: "",
  });
  const {
    address,
    setAddress,
    addressNotes,
    setAddressNotes,
    province,
    setProvince,
    district,
    setDistrict,
    urbanVillage,
    setUrbanVillage,
    postalCode,
    setPostalCode,
    isAccountInfoValid,
    isPetInfoValid,
    setIsLocationValid
  } = useRegisterPeople();

  const context = useRegisterPeople();
  console.log(context);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search) {
        const fetchAutocomplete = async () => {
          try {
            setAddress("");
            const result = await locationService.getAutocomplete(search);
            console.log(result);
            setAutocomplete(
              result.addresses.map((item: any, index: number) => ({
                index,
                formattedAddress: item.formattedAddress,
                addressLabel: item.addressLabel,
                postalCode: item.postalCode,
                urbanVillalges: item.dependentLocality,
                district: item.city,
                province: item.state,
                latitude: item.latitude,
                longitude: item.longitude,
              }))
            );
            setAddresses(
              result.addresses.map((item: any, index: number) => ({
                value: index,
                label: item.formattedAddress,
              }))
            );
          } finally {
            setIsLoading(false);
          }
        };
        fetchAutocomplete();
      }
    }, 300); // 0.3 seconds

    return () => clearTimeout(delayDebounce); // clear if user keeps typing
  }, [search]);

  const setLocationSelected = (idx: string) =>{
    console.log(idx);
    const selectedAutocomplete = autocomplete.find((item) => item.index === idx);
    console.log(selectedAutocomplete);
    if(selectedAutocomplete){
      setAddress(selectedAutocomplete.addressLabel);
      setProvince(selectedAutocomplete.province);
      // setCity(selectedAutocomplete.city);
      setDistrict(selectedAutocomplete.district);
      setUrbanVillage(selectedAutocomplete.urbanVillalges);
      setPostalCode(selectedAutocomplete.postalCode);
    }
  }

  const handleFinish = async () => {
    const result = userValidator.validateLocation(
      address,
      addressNotes,
      urbanVillage,
      district,
      province,
      postalCode
    );
    if (!result.ok) {
      setIsLocationValid(false);
      setErrors(result.errors);
    }else{
      setIsLocationValid(true);
      setErrors({})
      try {
        const result: any = await userService.register(context);
        if(result.ok) {
          setWithExpiry('email', context.email, 300000);
          router.push('/OTP');
        }
      } catch (error) {
        console.log(error);
      }
    }

  }
  
  useEffect(()=> {
    
    if(!isAccountInfoValid) {
      router.push('/register/people/account');
    }else if(!isPetInfoValid) {
      router.push('/register/people/pet');
    }
  }, [])

  return (
    <div className="relative w-full max-w-4xl -mt-4 bg-[#B3D8A8] rounded-xl p-6 md:p-16 flex flex-col md:flex-row items-center gap-8">
      <Image
        src="/img/register/paw.png"
        alt="Paw Icon"
        width={50}
        height={50}
        className="absolute top-4 right-4 opacity-80"
      />

      {/* Form Section */}
      <div className="flex-1 w-full space-y-4">
        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address">
            Address<span className="text-red-500">*</span>
          </Label>
          <SearchableDropdown
            options={addresses}
            selected={address}
            setSelected={setLocationSelected}
            className="!bg-[#FBFFE4] w-full flex justify-between"
            placeholder="Select Address"
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            search={search}
            setSearch={setSearch}
          />
          {errors.address && <span className="text-red-500 text-xs">{errors.address}</span>}

        </div>
        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="addressNotes">Address Notes (Apt,suite,etc)</Label>
          <Input
            value={addressNotes}
            onChange={(e) => setAddressNotes(e.target.value)}
            id="addressNotes"
            placeholder="Eg. (White Building, Room Number 12, etc)"
            required
            className="!bg-[#FBFFE4]"
          />
          
        </div>
        {/* Province */}
        <div className="space-y-2">
          <Label htmlFor="provinsi">
            Province<span className="text-red-500">*</span>
          </Label>
          <Input
            value={province}
            id="provinsi"
            placeholder="Province"
            disabled
            required
            className="!bg-[#FBFFE4]"
          />
          {errors.province && <span className="text-red-500 text-xs">{errors.province}</span>}
          {/* <Select
            value={province.value ?? ""}
            onValueChange={(value) => {
              setProvince(
                provinces.find((p) => p.value === value) || {
                  value: "",
                  label: "",
                }
              );
              setCity({ value: "", label: "" });
              setDistrict({ value: "", label: "" });
              setUrbanVillage({ value: "", label: "" });
            }}
          >
            <SelectTrigger id="provinsi" className=" w-full !bg-[#FBFFE4]">
              <SelectValue placeholder="Select your province" />
            </SelectTrigger>
            <SelectContent side="bottom" avoidCollisions={false}>
              {provinces.length <= 0 && (
                <SelectItem key="empty" value="empty" disabled>
                  No Options
                </SelectItem>
              )}
              {provinces.map((province) => (
                <SelectItem key={province.value} value={province.value}>
                  {province.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}
        </div>

        {/*  */}

        {/* District */}
        <div className="space-y-2">
          <Label htmlFor="district">
            District<span className="text-red-500">*</span>
          </Label>
          {/* <Select
            value={district.value ?? ""}
            onValueChange={(value) => {
              setDistrict(
                districts.find((p) => p.value === value) || {
                  value: "",
                  label: "",
                }
              );
              setUrbanVillage({ value: "", label: "" });
            }}
          >
            <SelectTrigger id="district" className=" w-full !bg-[#FBFFE4]">
              <SelectValue placeholder="Select your District" />
            </SelectTrigger>
            <SelectContent side="bottom" avoidCollisions={false}>
              {districts.length <= 0 && (
                <SelectItem key="empty" value="empty" disabled>
                  No Options
                </SelectItem>
              )}
              {districts.map((district) => (
                <SelectItem key={district.value} value={district.value}>
                  {district.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}
          <Input
            value={district}
            id="district"
            placeholder="District"
            disabled
            required
            className="!bg-[#FBFFE4]"
          />
          {errors.district && <span className="text-red-500 text-xs">{errors.district}</span>}
        </div>

        {/* Urban Village */}
        <div className="space-y-2">
          <Label htmlFor="city">
            Urban Village<span className="text-red-500">*</span>
          </Label>
          {/* <Select
            value={urbanVillage.value ?? ""}
            onValueChange={(value) =>
              setUrbanVillage(
                urbanVillages.find((p) => p.value === value) || {
                  value: "",
                  label: "",
                }
              )
            }
          >
            <SelectTrigger id="city" className=" w-full !bg-[#FBFFE4]">
              <SelectValue placeholder="Select your Urban Village" />
            </SelectTrigger>
            <SelectContent side="bottom" avoidCollisions={false}>
              {urbanVillages.length <= 0 && (
                <SelectItem key="empty" value="empty" disabled>
                  No Options
                </SelectItem>
              )}
              {urbanVillages.map((urbanVillage) => (
                <SelectItem key={urbanVillage.value} value={urbanVillage.value}>
                  {urbanVillage.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}
          <Input
            value={urbanVillage}
            id="urban_village"
            placeholder="Urban Village"
            disabled
            required
            className="!bg-[#FBFFE4]"
          />
          {errors.urbanVillage && <span className="text-red-500 text-xs">{errors.urbanVillage}</span>}
        </div>

        {/* Postal Code */}
        <div className="space-y-2">
          <Label htmlFor="postal code">
            Postal Code<span className="text-red-500">*</span>
          </Label>
          <Input
            value={postalCode}
            disabled
            id="postal code"
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={5}
            placeholder="Eg. 40123"
            required
            className="w-full !bg-[#FBFFE4]"
          />
          {errors.postalCode && <span className="text-red-500 text-xs">{errors.postalCode}</span>}
        </div>

        {/* Register Button */}
        <div className="absolute bottom-0 right-[75px]">
          <Button className="w-32 bg-white text-black hover:bg-[#356f61]"
            onClick={handleFinish}>
            Finish
          </Button>
        </div>
        <div className="absolute bottom-4 left-[65px]">
            <Button className="w-32 bg-white text-black hover:bg-[#356f61]">
              Back
            </Button>
        </div>
      </div>

      {/* Vet Image */}
      <div className="hidden md:block">
        <Image
          src="/img/register/location-vet.png"
          alt="Vet Illustration"
          width={200}
          height={200}
          priority
        />
      </div>
    </div>
  );
};

export default RegisterLocationPage;
