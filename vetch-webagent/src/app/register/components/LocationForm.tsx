import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FC, useEffect, useRef, useState } from "react";
import { useRegister } from "@/contexts/RegisterContext";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { UserValidator } from "@/lib/validators/UserValidator";
import { useRouter } from "next/navigation";
import { UserService } from "@/lib/services/UserService";
import { setWithExpiry } from "@/lib/utils/localStorage";
import SuccessDialog from "@/app/alert-dialog-box/SuccessDialog";
import { useLoading } from "@/contexts/LoadingContext";

interface IErrors {
  address?: string;
  addressNotes?: string;
  urbanVillage?: string;
  district?: string;
  city?: string;
  province?: string;
  postalCode?: string;
}

interface IProps {
    role: string;
}

const LocationForm:FC<IProps> = ({role}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });
  const userValidator = new UserValidator();
  const [openDialog, setOpenDialog] = useState(false);
  const userService = new UserService();
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const router = useRouter();
  const {setIsLoading} = useLoading();
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
    city,
    setCity,
    province,
    setProvince,
    district,
    setDistrict,
    urbanVillage,
    setUrbanVillage,
    postalCode,
    setPostalCode,
    setIsLocationValid,
    setLocationCoordinates,
  } = useRegister();

  const context = useRegister();
  console.log(context);

  useEffect(() => {
    if(address){
      const result = userValidator.validateLocation(
        address,
        addressNotes,
        urbanVillage,
        district,
        city,
        province,
        postalCode
      );
      if(!result.ok){
        console.log("location invalid")
        setIsLocationValid(false);
        setErrors(result.errors);
      }else{
        console.log("location valid")
        setIsLocationValid(true);
        setErrors({});
      }
    }
  }, [address])

  const handleFinish = async () => {
    setIsLoading(true);
    const result = userValidator.validateLocation(
      address,
      addressNotes,
      urbanVillage,
      district,
      city,
      province,
      postalCode
    );
    if (!result.ok) {
      setIsLocationValid(false);
      setErrors(result.errors);
    } else {
      setIsLocationValid(true);
      setErrors({});
      try {
        const result: any = await userService.register(context, role);
        if (result.ok) {
          setWithExpiry("email", context.email, 300000);
          setOpenDialog(true);
        }
      } catch (error) {
        console.log(error);
      }
    }
    setIsLoading(false);
  };
  const handlePlaceChanged = () => {
    const place = autoCompleteRef.current?.getPlace();
    if (place?.geometry?.location) {
      setAddress(place.formatted_address || "");
      setProvince(place.address_components?.find((value)=>value.types[0] === "administrative_area_level_1")?.long_name || "");
      setCity(place.address_components?.find((value)=>value.types[0] === "administrative_area_level_2")?.long_name || "");
      setDistrict(place.address_components?.find((value)=>value.types[0] === "administrative_area_level_3")?.long_name || "");
      setUrbanVillage(place.address_components?.find((value)=>value.types[0] === "administrative_area_level_4")?.long_name || "");
      setPostalCode(place.address_components?.find((value)=>value.types[0] === "postal_code")?.long_name || "");
      setLocationCoordinates(`${place.geometry.location.lat()},${place.geometry.location.lng()}`);
      console.log("Picked:", place);
    }
  };
  return (
    <div className="flex-1 w-full space-y-4">
      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">
          Address<span className="text-red-500">*</span>
        </Label>
        {/* <SearchableDropdown
          options={addresses}
          selected={address}
          setSelected={setLocationSelected}
          className="!bg-[#FBFFE4] w-full flex justify-between"
          placeholder="Select Address"
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          search={search}
          setSearch={setSearch}
        /> */}
        {loadError && (
          <span className="text-red-500 text-xs">Failed to load Google Maps API.</span>
        )}
        {isLoaded ? (
          <Autocomplete
            onLoad={(ref) => (autoCompleteRef.current = ref)}
            onPlaceChanged={handlePlaceChanged}
            className="w-full"
          >
            <input
              type="text"
              placeholder="Search a location"
              className="!bg-[#FBFFE4] w-full flex justify-between p-2 rounded-md outline-0"
            />
          </Autocomplete>
        ) : (
          <input
            type="text"
            placeholder="Loading Google Maps..."
            className="!bg-[#FBFFE4] w-full flex justify-between p-2 rounded-md outline-0"
            disabled
          />
        )}
        
        {errors.address && (
          <span className="text-red-500 text-xs">{errors.address}</span>
        )}
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
          onChange={(e) => setProvince(e.target.value)}
          id="provinsi"
          placeholder="Province"
          disabled={errors.province ? false : true}
          required
          className="!bg-[#FBFFE4]"
        />
        {errors.province && (
          <span className="text-red-500 text-xs">{errors.province}</span>
        )}
      </div>

      {/* City */}
      <div className="space-y-2">
        <Label htmlFor="city">
          City<span className="text-red-500">*</span>
        </Label>
        <Input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          id="city"
          placeholder="City"
          disabled={errors.city ? false : true}
          required
          className="!bg-[#FBFFE4]"
        />
        {errors.city && (
          <span className="text-red-500 text-xs">{errors.city}</span>
        )}
      </div>

      {/* District */}
      <div className="space-y-2">
        <Label htmlFor="district">
          District<span className="text-red-500">*</span>
        </Label>
        <Input
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          id="district"
          placeholder="District"
          disabled={errors.district ? false : true}
          required
          className="!bg-[#FBFFE4]"
        />
        {errors.district && (
          <span className="text-red-500 text-xs">{errors.district}</span>
        )}
      </div>

      {/* Urban Village */}
      <div className="space-y-2">
        <Label htmlFor="city">
          Urban Village<span className="text-red-500">*</span>
        </Label>
        <Input
          value={urbanVillage}
          onChange={(e) => setUrbanVillage(e.target.value)}
          id="urban_village"
          placeholder="Urban Village"
          disabled={errors.urbanVillage ? false : true}
          required
          className="!bg-[#FBFFE4]"
        />
        {errors.urbanVillage && (
          <span className="text-red-500 text-xs">{errors.urbanVillage}</span>
        )}
      </div>

      {/* Postal Code */}
      <div className="space-y-2">
        <Label htmlFor="postal code">
          Postal Code<span className="text-red-500">*</span>
        </Label>
        <Input
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          disabled={errors.postalCode ? false : true}
          id="postal code"
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={5}
          placeholder="Eg. 40123"
          required
          className="w-full !bg-[#FBFFE4]"
        />
        {errors.postalCode && (
          <span className="text-red-500 text-xs">{errors.postalCode}</span>
        )}
      </div>

      {/* Register Button */}
      <div className="absolute bottom-0 right-[75px]">
        <Button
          className="w-32 bg-white text-black hover:bg-[#356f61]"
          onClick={handleFinish}
        >
          Finish
        </Button>
      </div>
      <div className="absolute bottom-4 left-[65px]">
        <Button
          className="w-32 bg-white text-black hover:bg-[#356f61]"
          onClick={() => router.push(`${role === "user" ? "/register/people/pet" : "/register/vet/account"}`)}
        >
          Back
        </Button>
      </div>

      <SuccessDialog onOpenChange={()=>{setOpenDialog(false);router.push("/OTP");}} open={openDialog} message="OTP Sent to Your Email, please check your email"/>
    </div>
  );
};

export default LocationForm;
