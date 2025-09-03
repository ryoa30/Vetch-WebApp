// /contexts/AuthContext.tsx
"use client"; // 👈 context must run on the client

import { createContext, useContext, useState, ReactNode, use } from "react";

interface IOptions {
  value: string;
  label: string;
}
type RegisterPeopleContextType = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setPhone: (phone: string) => void;
  petName: string;
  setPetName: (petName: string) => void;
  petSpecies: string;
  setPetSpecies: (petSpecies: string) => void;
  petColor: string;
  setPetColor: (petColor: string) => void;
  petGender: string;
  setPetGender: (petGender: string) => void;
  petNeutered: boolean;
  setPetNeutered: (petNeutered: boolean) => void;
  petWeight: number;
  setPetWeight: (petWeight: number) => void;
  petDob: Date | undefined;
  setPetDob: (petDob: Date | undefined) => void;
  address: string;
  setAddress: (address: string) => void;
  addressNotes: string;
  setAddressNotes: (addressNotes: string) => void;
  urbanVillage: string;
  setUrbanVillage: (urbanVillage: string) => void;
  district: string;
  setDistrict: (district: string) => void;
  province: string;
  setProvince: (province: string) => void;
  postalCode: string;
  setPostalCode: (postalCode: string) => void;
};

const RegisterPeopleContext = createContext<RegisterPeopleContextType | undefined>(undefined);

export function RegisterPeopleContextProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [petName, setPetName] = useState('');
  const [petSpecies, setPetSpecies] = useState('');
  const [petColor, setPetColor] = useState('');
  const [petGender, setPetGender] = useState('male');
  const [petNeutered, setPetNeutered] = useState(false);
  const [petWeight, setPetWeight] = useState(0);
  const [petDob, setPetDob] = useState<Date | undefined>();
  const [address, setAddress] = useState('');
  const [addressNotes, setAddressNotes] = useState<string>('');
  const [urbanVillage, setUrbanVillage] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [province, setProvince] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');


  const context = {
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    phone,
    setEmail,
    setPassword,
    setConfirmPassword,
    setFirstName,
    setLastName,
    setPhone,
    petName,
    setPetName,
    petSpecies,
    setPetSpecies,
    petColor,
    setPetColor,
    petGender,
    setPetGender,
    petNeutered,
    setPetNeutered,
    petWeight,
    setPetWeight,
    petDob,
    setPetDob,
    address,
    setAddress,
    addressNotes,
    setAddressNotes,
    urbanVillage,
    setUrbanVillage,
    district,
    setDistrict,
    province,
    setProvince,
    postalCode,
    setPostalCode,
  };

  return (
    <RegisterPeopleContext.Provider value={context}>
      {children}
    </RegisterPeopleContext.Provider>
  );
}

export function useRegisterPeople() {
  const ctx = useContext(RegisterPeopleContext);
  if (!ctx) throw new Error("useRegisterPeople must be used within RegisterPeopleContextProvider");
  return ctx;
}

