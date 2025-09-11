import React, { FC } from 'react'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserValidator } from "@/lib/validators/UserValidator";
import { useRegister } from "@/contexts/RegisterContext";

interface IErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  certificate?: string;
  sipNumber?: string;
}

interface IProps {
    onClickNext: () => void;
    role: string;
}

const AccountForm:FC<IProps> = ({onClickNext, role}) => {
    const {email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, firstName, setFirstName, lastName, setLastName, phone, setPhone, setIsAccountInfoValid, sipNumber, setSipNumber, certificate, setCertificate, isAvailEmergency, setIsAvailEmergency, isAvailHomecare, setIsAvailHomecare} = useRegister();
    
    const [errors, setErrors] = useState<IErrors>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    certificate: '',
    sipNumber: '',
    });

    const userValidator = new UserValidator();

    const handleNext = async () =>{
        const result = userValidator.validateAccountInfo({email, password, confirmPassword, firstName, lastName, phone, role, sipNumber, certificate});
        if(!result.ok){

        setErrors(result.errors);
        }else{
        const result = await userValidator.validateEmail(email);
        if(!result.ok){
            setIsAccountInfoValid(false);
            setErrors(result.errors);
        }else{
            setIsAccountInfoValid(true);
            onClickNext();
        }
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
        // Check MIME type
        if (!selected.type.startsWith("image/")) {
            setErrors({...errors, certificate: "Only image files are allowed (jpg, png, etc.)"});
            setCertificate(null);
        } else {
            setErrors({...errors, certificate: ""});
            setCertificate(selected);
        }
        }
    };

  return (
    <div className="flex-1 w-full space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email<span className="text-red-500">*</span></Label>
            <Input id="email" placeholder="Email must contains @ and verified" required className="!bg-[#FBFFE4] mb-0" value={email} onChange={(e) => setEmail(e.target.value)} />
            {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <Label htmlFor="password">Password<span className="text-red-500">*</span></Label>
            <Input id="password" type="password" placeholder="At least 8 characters & numbers" required className="!bg-[#FBFFE4]" value={password} onChange={(e) => setPassword(e.target.value)}/>
            {errors.password &&<span className="text-red-500 text-xs">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <Label htmlFor="confirmPassword">Confirm Password<span className="text-red-500">*</span></Label>
            <Input id="confirmPassword" type="password" placeholder="Must match password" required className="!bg-[#FBFFE4]" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
            {errors.confirmPassword &&<span className="text-red-500 text-xs">{errors.confirmPassword}</span>}
          </div>

          {/* Owner Name */}
          <div className="space-y-1">
            <Label>{role === "user"? "Owner" : "Vet"}&apos;s Name<span className="text-red-500">*</span></Label>
            <div className="flex gap-2">
              <div className="flex-col flex-1">
                <Input placeholder="First Name" required className="!bg-[#FBFFE4]" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                {errors.firstName &&<span className="text-red-500 text-xs">{errors.firstName}</span>}
              </div>
              <div className="flex-col flex-1">
                <Input placeholder="Last Name" required className="!bg-[#FBFFE4]" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                {errors.lastName &&<span className="text-red-500 text-xs">{errors.lastName}</span>}
              </div>
            </div>
          </div>

          {/* Owner Phone */}
          <div className="space-y-1">
            <Label htmlFor="phone">{role === "user"? "Owner" : "Vet"}&apos;s Phone<span className="text-red-500">*</span></Label>
            <Input id="phone" placeholder='Must start with "08"' required className="!bg-[#FBFFE4]" value={phone} onChange={(e) => setPhone(e.target.value)} />
            {errors.phone &&<span className="text-red-500 text-xs">{errors.phone}</span>}
          </div>

          {role === "vet" && (
              <>
                <div className="space-y-1">
                    <Label htmlFor="certificate">Upload Certificate<span className="text-red-500">*</span></Label>
                    <Input id="certificate" type="file" className="!bg-white" accept="image/*" onChange={handleChange}/>
                    {errors.certificate &&<span className="text-red-500 text-xs">{errors.certificate}</span>}

                </div>
                <div className="space-y-1">
                    <Label htmlFor="phone">SIP Number<span className="text-red-500">*</span></Label>
                    <Input id="sipNumber" placeholder='Must not be empty' required className="!bg-[#FBFFE4]" value={sipNumber} onChange={(e) => setSipNumber(e.target.value)} />
                    {errors.sipNumber &&<span className="text-red-500 text-xs">{errors.sipNumber}</span>}
                </div>

                <div className="space-y-1">
                    <Label>Are you available for Homecare?</Label>
                    <p className="text-xs text-muted-foreground">You can change this later in profile</p>
                    <RadioGroup defaultValue="" value={isAvailHomecare? "yes" : "no"} className="flex items-center gap-4 mt-1" onValueChange={(e) => setIsAvailHomecare(e === "yes")}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem className='!bg-white' value="yes" id="homecare-yes" />
                        <Label htmlFor="homecare-yes">Yes!</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem className='!bg-white' value="no" id="homecare-no" />
                        <Label htmlFor="homecare-no">No</Label>
                    </div>
                    </RadioGroup>
                </div>

                <div className="space-y-1">
                    <Label>Are you available for emergency Homecare?</Label>
                    <p className="text-xs text-muted-foreground">You must be available for homecare first</p>
                    <RadioGroup defaultValue="" disabled={!isAvailHomecare} value={isAvailEmergency? "yes" : "no"} className="flex items-center gap-4 mt-1" onValueChange={(e) => setIsAvailEmergency(e === "yes")}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem className='!bg-white' value="yes" id="emergency-yes" />
                        <Label htmlFor="emergency-yes">Yes!</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem className='!bg-white' value="no" id="emergency-no" />
                        <Label htmlFor="emergency-no">No</Label>
                    </div>
                    </RadioGroup>
                </div>
            </>
          )}

          {/* Next Button */}
          <div className="absolute bottom-4 right-16">
            {/* <Link href="/register/people/pet"> */}
              <Button className="w-32 bg-[#3D8D7A] text-white hover:bg-[#356f61]" onClick={handleNext}>
                Next
              </Button>
            {/* </Link> */}
          </div>
        </div>
  )
}

export default AccountForm
