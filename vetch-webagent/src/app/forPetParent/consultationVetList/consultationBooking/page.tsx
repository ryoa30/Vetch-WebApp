"use client";

import {
  Star,
  BadgeQuestionMark,
  ClipboardPlus,
  List,
  ChevronRight,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoading } from "@/contexts/LoadingContext";
import { VetService } from "@/lib/services/VetService";
import { IVet } from "../types";
import { ConcernDialog } from "./components/ConcernDialog";
import { PetDialog } from "./components/PetDialog";
import { capitalize, result, set, snakeCase } from "lodash";
import { UserService } from "@/lib/services/UserService";
import { useSession } from "@/contexts/SessionContext";
import PaymentDialog from "@/app/alert-dialog-box/PaymentConfirmDialogBox";
import { BookingValidator } from "@/lib/validators/BookingValidator";
import ErrorDialog from "@/app/alert-dialog-box/ErrorDialogBox";
import { BookingService } from "@/lib/services/BookingService";
import { PaymentService } from "@/lib/services/PaymentService";
import { showPaymentSnap } from "@/lib/utils/snapPayment";

export default function ConfirmBookingPage() {
  const [consultationType, setConsultationType] = useState("Online");
  const [selectedConcerns, setSelectedConcerns] = useState<any[]>([]);
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [illnessDescription, setIllnessDesription] = useState<string>("");
  const [location, setLocation] = useState<any>(null);
  const { user } = useSession();
  const [errors, setErrors] = useState<any>({});
  const [showError, setShowError] = useState(false);
  const [bookingId, setBookingId] = useState<string>("");
  const [paymentToken, setPaymentToken] = useState<string>("");

  const router = useRouter();

  const bookingValidator = new BookingValidator();
  const bookingService = useMemo(() => new BookingService(), []);
  const paymentService = useMemo(() => new PaymentService(), []);

  const [showConcern, setShowConcern] = useState(false);
  const [showPet, setShowPet] = useState(false);
  const [consultationPrice, setConsultationPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const sp = useSearchParams();
  const id = sp.get("id");
  const time = sp.get("time");
  const date = sp.get("date");
  const { setIsLoading } = useLoading();

  const vetService = useMemo(() => new VetService(), []);
  const userService = useMemo(() => new UserService(), []);
  const [vet, setVet] = useState<IVet>();

  const loadVetDetails = useCallback(async () => {
    setIsLoading(true);
    if (id) {
      try {
        const result = await vetService.getVetDetails(id);
        if (result.ok) {
          console.log(result);
          setVet(result.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    setIsLoading(false);
  }, [id, vetService, setIsLoading]);

  const loadLocation = useCallback(async () => {
    try {
      const result = await userService.getUserLocationById(user?.id || "");
      if (result.ok) {
        console.log(result);
        setLocation(result.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, [user?.id, userService]);

  // use showPaymentSnap(token, { ...callbacks }) from util

  const handleConfirmBooking = async () => {
    try {
      const validation = bookingValidator.validateBookingInfo({
        selectedPet: selectedPet,
        illnessDescription: illnessDescription,
        selectedConcerns: selectedConcerns.map((item) => item.value),
      });
      console.log(validation);
      if (validation.ok) {
        setErrors({});
      } else {
        setErrors(validation.errors);
        setShowError(true);
        return;
      }

      const resultBooking = await bookingService.createBooking(
        selectedConcerns,
        illnessDescription,
        selectedPet.id,
        location.id,
        vet?.id || "",
        date || "",
        time || "",
        totalPrice,
        consultationType
      );
      console.log(resultBooking);
      if (!resultBooking.ok) {
        throw new Error("Failed to create booking");
      }
      const resultPayment = await paymentService.getTransactionToken(
        resultBooking.data.id,
        user,
        totalPrice,
        consultationType,
        consultationPrice
      );
      console.log(resultPayment);
      if (!resultPayment.ok) {
        throw new Error("Failed to get payment token");
      }
      setBookingId(resultBooking.data.id);
      setPaymentToken(resultPayment.data);
      showPaymentSnap(
        resultPayment.data,
        { bookingId: resultBooking.data.id },
        {
          onSuccess: () => {
            console.log("masuk");
            router.push("/forPetParent/orderHistory");
          },
        }
      );
      // if(result.ok){
    } catch (error) {
      console.log(error);
      setErrors({
        general: "An error occurred while processing your booking.",
      });
      setShowError(true);
    }
  };

  useEffect(() => {
    const price = vet?.price ?? 0;
    if (consultationType === "Homecare") {
      const base = price * 1.5;
      setConsultationPrice(base);
      setTotalPrice(base + base * 0.1 + base * 0.05);
    } else {
      const base = price;
      setConsultationPrice(base);
      setTotalPrice(base + base * 0.1 + base * 0.05);
    }
  }, [consultationType, vet?.price]);

  useEffect(() => {
    loadVetDetails();
    loadLocation();
  }, [loadVetDetails, loadLocation]);

  return (
    <main className="bg-[#F5F5F5] dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="min-h-screen bg-[#FBFFE4] dark:bg-[#2E4F4A] p-8">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-semibold text-green-900 dark:text-gray-200">
            Confirm your consultation booking{" "}
            <span className="font-normal text-gray-700  dark:text-gray-200">
              | {date} at {time}
            </span>
          </h1>
          <div className="ml-10">
            <Image
              src="/img/login/foot-step.png"
              alt="Pets Illustration"
              width={400}
              height={400}
              className="object-contain"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="space-y-6 h-full">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-[#2D4236] shadow h-full">
              <div className="w-24 h-24 rounded-xl bg-gray-200 flex items-center justify-center">
                <Image
                  src={vet?.profilePicture || "/placeholder"}
                  alt="Doctor"
                  width={96}
                  height={96}
                  className="rounded-xl"
                />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold">Dr. {vet?.fullName}</h2>
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="w-4 h-4 text-green-600 fill-green-600 mr-1 stroke-black" />
                  <span className="dark:text-gray-200">
                    {vet?.ratingAvg} | {vet?.ratingCount} Reviews
                  </span>
                </div>
                <p className="text-sm font-semibold mt-2 text-green-900 dark:text-gray-200">
                  Species
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {vet?.speciesHandled &&
                    vet?.speciesHandled.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-gray-100 dark:bg-black border text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 h-full">
            <div className="items-center gap-4 p-4 rounded-xl bg-white dark:bg-[#2D4236] shadow h-full">
              <button
                disabled={bookingId != ""}
                className="flex w-full cursor-pointer flex-row items-center border-gray-200 gap-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-[#1e2923]"
                onClick={() => setShowPet(true)}
              >
                <div className="flex-shrink-0 w-12">
                  {!selectedPet && (
                    <BadgeQuestionMark className="w-10 h-10 text-black dark:text-white" />
                  )}
                  {selectedPet && (
                    <Image
                      className="dark:invert"
                      src={`/img/pet-logo/${snakeCase(
                        selectedPet.speciesName
                      )}.png`}
                      alt="pet icon"
                      width={50}
                      height={50}
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Pet</span>
                  </div>
                  {!selectedPet && (
                    <span className="text-sm text-gray-500">Select a Pet</span>
                  )}
                  {selectedPet && (
                    <span className="text-sm text-gray-500">
                      {capitalize(selectedPet.petName)}
                    </span>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-black ml-auto" />
              </button>

              <div className="w-full bg-gray-300 h-[0.5px] my-2"></div>

              <button
                disabled={bookingId != ""}
                onClick={() => setShowConcern(true)}
                className="flex w-full cursor-pointer flex-row items-center gap-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-[#1e2923]"
              >
                <div className="flex-shrink-0 w-12">
                  <ClipboardPlus className="mx-auto w-10 h-10 text-black dark:text-white" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Concerns</span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {selectedConcerns.length === 0
                      ? "Select Concerns"
                      : selectedConcerns.map(
                          (item, index) =>
                            `${item.label}${
                              index < selectedConcerns.length - 1 ? ", " : ""
                            }`
                        )}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-black ml-auto" />
              </button>

              <div className="w-full bg-gray-300 h-[0.5px] my-2"></div>

              <div className="flex flex-col">
                <button className="flex w-full cursor-pointer flex-row gap-3 items-center ">
                  <div className="flex-shrink-0 w-12">
                    <List className="mx-auto w-10 h-10 text-black dark:text-white" />
                  </div>
                  <div>
                    <div className="flex">
                      <span className="font-medium">Illness Description</span>
                    </div>
                    <span className="text-sm text-gray-400">
                      Add Consultation Reason Description
                    </span>
                  </div>
                </button>
                <Textarea
                  disabled={bookingId != ""}
                  placeholder="Enter Illness Description"
                  className="mt-2"
                  spellCheck={false}
                  value={illnessDescription}
                  onChange={(e) => setIllnessDesription(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="space-y-6 h-full">
            <div className="p-4 bg-white dark:bg-[#2D4236] rounded-xl shadow h-full">
              <p className="font-semibold mb-3 text-green-900 dark:text-gray-200">
                Consultation Type
              </p>
              <div className="flex gap-3">
                <button
                  disabled={bookingId != ""}
                  onClick={() => setConsultationType("Homecare")}
                  className={`flex-1 px-4 py-2 rounded-full font-medium ${
                    consultationType === "Homecare"
                      ? "bg-green-700 text-white dark:text-black dark:bg-white"
                      : "bg-white dark:bg-[#2D4236] shadow-md border-white"
                  }`}
                >
                  Homecare
                </button>
                <button
                  disabled={bookingId != ""}
                  onClick={() => setConsultationType("Online")}
                  className={`flex-1 px-4 py-2 rounded-full font-medium ${
                    consultationType === "Online"
                      ? "bg-green-700 text-white dark:text-black dark:bg-white"
                      : "bg-white dark:bg-[#2D4236] shadow-md border-white"
                  }`}
                >
                  Online
                </button>
              </div>
            </div>
          </div>
          {consultationType === "Homecare" && (
            <div className="space-y-6 h-full">
              <div className="items-center gap-4 p-4 rounded-xl bg-white dark:bg-[#2D4236] shadow h-full">
                <div className="p-4 flex items-center gap-3">
                  <MapPin className="w-10 h-10 text-black mt-1" />
                  <div className="flex flex-col">
                    <div className="font-medium">Location</div>
                    <p className="text-sm text-gray-600 dark:text-gray-200">
                      {location
                        ? location.addressName
                        : "No address found, please set your address in profile page."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Price and Payment Section */}
        <div className="flex dark:text-gray-200 gap-4 p-4 rounded-xl bg-white dark:bg-[#2D4236] shadow h-full">
          {/* Price Section */}
          <div className="w-full pr-4  ">
            <p className="font-semibold text-green-900 dark:text-gray-200 mb-3">
              Price
            </p>
            <div className="flex justify-between text-sm py-1">
              <span>Appointment Fee</span>
              <span>
                IDR{" "}
                {new Intl.NumberFormat("id-ID").format(
                  Number(consultationPrice)
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm py-1">
              <span>
                Tax <sup>10%</sup>
              </span>
              <span>
                IDR{" "}
                {new Intl.NumberFormat("id-ID").format(
                  Number(consultationPrice) * 0.1
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm py-1">
              <span>
                Service <sup>5%</sup>
              </span>
              <span>
                IDR{" "}
                {new Intl.NumberFormat("id-ID").format(
                  Number(consultationPrice) * 0.05
                )}
              </span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-semibold text-green-900 dark:text-gray-200">
              <span>Grand Total</span>
              <span>
                IDR {new Intl.NumberFormat("id-ID").format(Number(totalPrice))}
              </span>
            </div>
            <div className="flex justify-end mt-4">
              {bookingId === "" && (
                <PaymentDialog handleConfirmBooking={handleConfirmBooking}>
                  <button className="px-6 py-2 rounded-full bg-green-700 text-white font-semibold hover:bg-green-800">
                    Confirm and Book
                  </button>
                </PaymentDialog>
              )}
              {bookingId != "" && (
                <button
                  onClick={() =>
                    showPaymentSnap(
                      paymentToken,
                      { bookingId: bookingId },
                      {
                        onSuccess: () => {
                          console.log("masuk");
                          router.push("/forPetParent/orderHistory");
                        },
                      }
                    )
                  }
                  className="px-6 py-2 rounded-full bg-green-700 text-white font-semibold hover:bg-green-800"
                >
                  Continue Payment
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConcernDialog
        show={showConcern}
        onClose={() => setShowConcern(false)}
        selected={selectedConcerns}
        setSelected={setSelectedConcerns}
      />
      <PetDialog
        show={showPet}
        onClose={() => setShowPet(false)}
        pet={selectedPet}
        setPet={setSelectedPet}
      />
      <ErrorDialog
        open={showError}
        onOpenChange={() => setShowError(false)}
        errors={(Object.values(errors) as string[]).filter((err) => err !== "")}
      />
    </main>
  );
}
