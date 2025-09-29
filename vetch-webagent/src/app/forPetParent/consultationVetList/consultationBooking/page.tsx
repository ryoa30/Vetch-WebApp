"use client";

import { Star, QrCode, Building, Smartphone, ChevronDown, Dog, ClipboardPlus, List, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useSearchParams } from "next/navigation";
import { useLoading } from "@/contexts/LoadingContext";
import { VetService } from "@/lib/services/VetService";
import { IVet } from "../types";
import { ConcernDialog } from "./components/ConcernDialog";
import { PetDialog } from "./components/PetDialog";
import {capitalize} from "lodash"
import { UserService } from "@/lib/services/UserService";
import { useSession } from "@/contexts/SessionContext";

export default function ConfirmBookingPage() {
  const [consultationType, setConsultationType] = useState("Homecare");
  const [paymentMethod, setPaymentMethod] = useState("Gopay");
  const [selectedConcerns, setSelectedConcerns] = useState<any[]>([]);
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [location, setLocation] = useState<any>(null);
  const {user} = useSession();

  const [showConcern, setShowConcern] = useState(false);
  const [showPet, setShowPet] = useState(false);
  const [consultationPrice, setConsultationPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const sp = useSearchParams();
  const id = sp.get("id");
  const time = sp.get("time");
  const date = sp.get("date");
  const { setIsLoading } = useLoading();

  const vetService = new VetService();
  const userService = new UserService();
  const [vet, setVet] = useState<IVet>();

  const loadVetDetails = async () => {
    setIsLoading(true);
    if (id) {
      try {
        const result = await vetService.getVetDetails(id);
        if (result.ok) {
          console.log(result);
          setVet(result.data);
          if(consultationType === "Homecare"){
            setConsultationPrice(result.data.price * 1.5);
            setTotalPrice((result.data.price * 1.5) + (result.data.price * 1.5 * 0.1) + (result.data.price * 1.5 * 0.05));
          }else{
            setConsultationPrice(result.data.price);
            setTotalPrice(result.data.price + result.data.price * 0.1 + result.data.price * 0.05);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    setIsLoading(false);
  };

  const loadLocation = async () => {
    try {
      const result = await userService.getUserLocationById(user?.id || "");
      if(result.ok){
        console.log(result);
        setLocation(result.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  

  useEffect(() =>{
    if(consultationPrice != 0){
      if(consultationType === "Homecare"){
        setConsultationPrice(vet?.price ? vet.price * 1.5 : 0);
        setTotalPrice((vet?.price ? vet.price * 1.5 : 0) + (vet?.price ? vet.price * 1.5 * 0.1 : 0) + (vet?.price ? vet.price * 1.5 * 0.05 : 0));
      }else{
        setConsultationPrice(vet?.price ? vet.price : 0);
        setTotalPrice((vet?.price ? vet.price : 0) + (vet?.price ? vet.price * 0.1 : 0) + (vet?.price ? vet.price * 0.05 : 0));
      }
    }
  }, [consultationType])

  useEffect(() => {
    loadVetDetails();
    loadLocation();
  }, []);


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
                  <span className="dark:text-gray-200">{vet?.ratingAvg} | {vet?.ratingCount} Reviews</span>
                </div>
                <p className="text-sm font-semibold mt-2 text-green-900 dark:text-gray-200">
                  Species
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {vet?.speciesHandled && vet?.speciesHandled.map(
                    (tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-gray-100 dark:bg-black border text-sm"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 h-full">
            <div className="items-center gap-4 p-4 rounded-xl bg-white dark:bg-[#2D4236] shadow h-full">
              <button className="flex w-full cursor-pointer flex-row justify-between items-center border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-[#1e2923]" onClick={() => setShowPet(true)}>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    {/* <Dog className="w-5 h-5 text-black" /> */}
                    <span className="font-medium">Pet</span>
                  </div>
                  {!selectedPet && <span className="text-sm text-gray-500">Select a Pet</span>}
                  {selectedPet && <span className="text-sm text-gray-500">{capitalize(selectedPet.petName)}</span>}
                  
                </div>
                <ChevronRight className="w-5 h-5 text-black" />
              </button>

              <div className="w-full bg-gray-300 h-[0.5px] my-2"></div>

              <button onClick={()=>setShowConcern(true)} className="flex w-full cursor-pointer flex-row justify-between items-center">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0">
                        <ClipboardPlus className="w-10 h-10 text-black dark:text-white" />
                    </div>
                    <span className="font-medium">Concerns</span>
                  </div>
                  <span className="text-sm text-gray-400">{selectedConcerns.length === 0? "Select Concerns" : selectedConcerns.map((item, index) => (`${item.label}${index<selectedConcerns.length-1 ? ", ": ""}`))}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-black" />
              </button>

              <div className="w-full bg-gray-300 h-[0.5px] my-2"></div>

              <div className="flex flex-col">
                <button className="flex w-full cursor-pointer flex-row justify-between items-center">
                  <div>
                    <div className="flex">
                      <div className="flex-shrink-0">
                          <List className="w-10 h-10 text-black dark:text-white" />
                      </div>
                      <span className="font-medium">Illness Description</span>
                    </div>
                    <span className="text-sm text-gray-400">
                      Add Consultation Reason Description
                    </span>
                  </div>
                </button>
                <Textarea
                  placeholder="Enter Illness Description"
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="space-y-6 h-full">
            <div className="p-4 bg-white dark:bg-[#2D4236] rounded-xl shadow">
              <p className="font-semibold mb-3 text-green-900 dark:text-gray-200">
                Consultation Type
              </p>
              <div className="flex gap-3">
                <button
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
          {consultationType === "Homecare" &&
          <div className="space-y-6 h-full">
            <div className="items-center gap-4 p-4 rounded-xl bg-white dark:bg-[#2D4236] shadow h-full">
              <div className="p-4 flex items-start gap-3">
                {/* <MapPin className="w-5 h-5 text-black mt-1" /> */}
                <p className="text-sm text-gray-600 dark:text-gray-200">
                  {location ? location.addressName : "No address found, please set your address in profile page."}
                </p>
              </div>
            </div>
          </div>
          }
        </div>

        {/* Price and Payment Section */}
        <div className="flex dark:text-gray-200 gap-4 p-4 rounded-xl bg-white dark:bg-[#2D4236] shadow h-full">
          {/* Price Section */}
          <div className="w-2/3 pr-4 border-r ">
            <p className="font-semibold text-green-900 dark:text-gray-200 mb-3">
              Price
            </p>
            <div className="flex justify-between text-sm py-1">
              <span>Appointment Fee</span>
              <span>IDR{" "}
                    {new Intl.NumberFormat("id-ID").format(Number(consultationPrice))}</span>
            </div>
            <div className="flex justify-between text-sm py-1">
              <span>
                Tax <sup>10%</sup>
              </span>
              <span>IDR{" "}
                    {new Intl.NumberFormat("id-ID").format(Number(consultationPrice )*0.1)}</span>
            </div>
            <div className="flex justify-between text-sm py-1">
              <span>
                Service <sup>5%</sup>
              </span>
              <span>IDR{" "}
                    {new Intl.NumberFormat("id-ID").format(Number(consultationPrice )*0.05)}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-semibold text-green-900 dark:text-gray-200">
              <span>Grand Total</span>
              <span>IDR {new Intl.NumberFormat("id-ID").format(Number(totalPrice))}</span>
            </div>
            <div className="flex justify-end mt-4">
              <button className="px-6 py-2 rounded-full bg-green-700 text-white font-semibold hover:bg-green-800">
                Confirm and Book
              </button>
            </div>
          </div>

          {/* Pay Using Section */}
          <div className="w-1/3 pl-4 gap-4 p-4 rounded-xl bg-white dark:bg-[#2D4236] shadow h-full">
            <p className="font-semibold text-green-900 dark:text-gray-200 mb-3">
              Pay Using
            </p>
            <div className="space-y-3">
              {[
                { label: "QRIS", icon: <QrCode className="w-5 h-5" /> },
                {
                  label: "Virtual Account",
                  sub: "Only for BCA",
                  icon: <Building className="w-5 h-5" />,
                },
                { label: "Gopay", icon: <Smartphone className="w-5 h-5" /> },
              ].map(({ label, sub, icon }) => (
                <label
                  key={label}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${
                    paymentMethod === label
                      ? "border-green-600 bg-green-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {icon}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{label}</span>
                      {sub && (
                        <span className="text-xs text-gray-500">{sub}</span>
                      )}
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    value={label}
                    checked={paymentMethod === label}
                    onChange={() => setPaymentMethod(label)}
                    className="accent-green-600 w-4 h-4"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ConcernDialog show={showConcern} onClose={() => setShowConcern(false)} selected={selectedConcerns} setSelected={setSelectedConcerns}/>
      <PetDialog show={showPet} onClose={() => setShowPet(false)} pet={selectedPet} setPet={setSelectedPet}/>

    </main>
  );
}
