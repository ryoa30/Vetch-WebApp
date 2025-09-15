export interface IVet { 
  id: string;
  userId: string;
  uploadCertificate: string;
  sipNumber: string;
  description: string;
  price: number;
  isAvailHomecare: boolean;
  isAvailEmergency: boolean;
  verified: boolean;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string;
  profilePicture: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  verifiedDate: string | null; // ISO date string or null
  isDeleted: boolean;
}