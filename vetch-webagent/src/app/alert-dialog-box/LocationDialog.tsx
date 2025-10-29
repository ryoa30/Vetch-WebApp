import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useState,
  useEffect,
  useRef,
} from "react";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { UserValidator } from "@/lib/validators/UserValidator";
import { UserService } from "@/lib/services/UserService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/SessionContext";

interface IErrors {
  address?: string;
  addressNotes?: string;
  urbanVillage?: string;
  district?: string;
  city?: string;
  province?: string;
  postalCode?: string;
}

export function LocationDialog({
  show,
  onClose,
}: {
  show: boolean;
  onClose: (input?:any) => void;
}) {
  const {user} = useSession();
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });
  const userValidator = new UserValidator();
  const userService = new UserService();
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [errors, setErrors] = useState<IErrors>({
    address: "",
    addressNotes: "",
    urbanVillage: "",
    district: "",
    province: "",
    postalCode: "",
  });
  const [address, setAddress] = useState("");
  const [addressNotes, setAddressNotes] = useState<string>("");
  const [urbanVillage, setUrbanVillage] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [province, setProvince] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [locationCoordinates, setLocationCoordinates] = useState<string>("");

  useEffect(() => {
    if (address) {
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
        console.log("location invalid");
        setErrors(result.errors);
      } else {
        console.log("location valid");
        setErrors({});
      }
    }
  }, [address]);

  const handleFinish = async () => {
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
      setErrors(result.errors);
    } else {
      setErrors({});
      try {
        const result = await userService.updateLocation(
          user?.id || "",
          address,
          postalCode,
          city,
          district,
          urbanVillage,
          province,
          addressNotes,
          locationCoordinates
        )
        if (result.ok) {
          onClose(result.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handlePlaceChanged = () => {
    const place = autoCompleteRef.current?.getPlace();
    if (place?.geometry?.location) {
      setAddress(place.formatted_address || "");
      setProvince(
        place.address_components?.find(
          (value) => value.types[0] === "administrative_area_level_1"
        )?.long_name || ""
      );
      setCity(
        place.address_components?.find(
          (value) => value.types[0] === "administrative_area_level_2"
        )?.long_name || ""
      );
      setDistrict(
        place.address_components?.find(
          (value) => value.types[0] === "administrative_area_level_3"
        )?.long_name || ""
      );
      setUrbanVillage(
        place.address_components?.find(
          (value) => value.types[0] === "administrative_area_level_4"
        )?.long_name || ""
      );
      setPostalCode(
        place.address_components?.find(
          (value) => value.types[0] === "postal_code"
        )?.long_name || ""
      );
      setLocationCoordinates(
        `${place.geometry.location.lat()},${place.geometry.location.lng()}`
      );
      console.log("Picked:", place);
    }
  };

  useEffect(() => {
    if (!show) return;
    const { style } = document.body;
    const prev = { overflow: style.overflow };
    style.overflow = "hidden";
    return () => { style.overflow = prev.overflow; };
  }, [show]);

  return (
    <>
      <div className={`${show ? "" : "hidden"} fixed inset-0 bg-black/50 z-50`}></div>

      <Dialog open={show} onOpenChange={(open) => !open && onClose()} modal={false}>
        <DialogContent
          onInteractOutside={(e) => {
            const t = e.target as HTMLElement | null;
            if (t && t.closest(".pac-container")) e.preventDefault();
          }}
          onPointerDownOutside={(e) => {
            const t = e.target as HTMLElement | null;
            if (t && t.closest(".pac-container")) e.preventDefault();
          }}
          className="sm:max-w-lg lg:max-w-2xl bg-white overflow-y-auto dark:bg-[#1F2D2A] text-black rounded-xl shadow-lg"
        >
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#0F5544] font-semibold dark:text-white">
              Edit Location
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 w-full space-y-4 dark:text-white">
            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">
                Address<span className="text-red-500">*</span>
              </Label>
              {loadError && (
                <span className="text-red-500 text-xs">
                  Failed to load Google Maps API.
                </span>
              )}
              {isLoaded ? (
                <Autocomplete
                  onLoad={(ref) => (autoCompleteRef.current = ref)}
                  onPlaceChanged={handlePlaceChanged}
                >
                  <input
                    type="text"
                    placeholder="Search a location"
                    className="bg-transparent border-2 w-full flex justify-between p-2 rounded-md outline-0"
                  />
                </Autocomplete>
              ) : (
                <input
                  type="text"
                  placeholder="Loading Google Maps..."
                  className="bg-transparent border-2 w-full flex justify-between p-2 rounded-md outline-0"
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
                className="bg-transparent border-2"
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
                className="bg-transparent border-2"
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
                className="bg-transparent border-2"
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
                className="bg-transparent border-2"
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
                className="bg-transparent border-2"
              />
              {errors.urbanVillage && (
                <span className="text-red-500 text-xs">
                  {errors.urbanVillage}
                </span>
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
                className="w-full bg-transparent border-2"
              />
              {errors.postalCode && (
                <span className="text-red-500 text-xs">{errors.postalCode}</span>
              )}
            </div>

            <div className="flex justify-end">
              <Button className="w-32 bg-white text-black hover:bg-gray-100 border-2" onClick={handleFinish}>
                Save Location
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
