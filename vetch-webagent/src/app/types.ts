export interface UserData {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string | null;
  fullName: string;
  phoneNumber: string | null;
  profilePicture: string | null;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export interface VetData {
  id: string;
  userId: string;
  uploadCertificate: string | null;
  sipNumber: string;
  description: string;
  price: number;
  isAvailHomecare: boolean;
  isAvailEmergency: boolean;
  verified: boolean;
  verifiedDate: Date | null;
}

export interface LocationData {
  id: string;
  userId: string;
  addressName: string;
  postalCode: string;
  urbanVillage: string;
  district: string;
  city: string;
  province: string;
  addressNotes: string | null;
  coordinates: string;
  isDeleted: boolean;
}

export interface PetData {
  id: string;
  userId: string;
  petName: string;
  speciesName: string;
  gender: string;
  petDob: Date;
  neuterStatus: boolean;
  primaryColor: string;
  weight: number;
  reminderConsultation: string | null;
  reminderVaccine: string | null;
  reminderConsultationDate: Date | null;
  reminderVaccineDate: Date | null;
  isDeleted: boolean;
}

export interface SpeciesData {
  id: string;
  vetId: string;
  speciesTypeId: string;
}

export interface SpeciesTypeData {
  id: string;
  speciesName: string;
}

export interface BookingData {
  id: string;
  vetId: string;
  petId: string;
  locationId: string;
  illnessDescription: string;
  bookingDate: string;
  bookingTime: string;
  bookingPrice: number;
  bookingStatus: string;
  bookingType: string;
  bookingConclusion: string;
  isDeleted: boolean;
}

export interface PaymentData {
  id: string;
  bookingId: string;
  paymentToken: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentDate: Date;
}

export interface ConcernTypeData {
  id: string;
  concernName: string;
}

export interface ConcernDetailData {
  id: string;
  concernId: string;
  bookingId: string;
}

export interface RatingData {
  id: string;
  vetId: string;
  userId: string;
  bookingId: string;
  context: string;
  rating: number;
  ratingDate: Date;
}

export interface BlogData {
  id: string;
  categoryId: string;
  title: string;
  context: string;
  picture: string | null;
  date: Date;
  isDeleted: boolean;
}

export interface CategoryData {
  id: string;
  categoryName: string;
}

export interface ChatData {
  id: string;
  vetId: string;
  petId: string;
  chatHistory: string | null;
  videoCallHistory: string | null;
  status: string;
}

export interface ScheduleData {
  id: string;
  vetId: string;
  dayNumber: number;
  isDeleted: boolean;
  timeOfDay: string;
}

export interface NotificationSubscriptionData {
  id: string;
  userId: string;
  endpoint: string;
  keys: unknown;
}

export interface NotificationData {
  id: string;
  userId: string;
  message: string;
  confirmed: boolean;
  createdAt: Date;
}

export interface UserWithRelations extends UserData {
  locations?: LocationData[];
  pets?: PetData[];
  ratings?: RatingData[];
  notificationSubscriptions?: NotificationSubscriptionData[];
  notifications?: NotificationData[];
  vetProfile?: VetData | null;
}

export interface VetWithRelations extends VetData {
  user?: UserData;
  speciesHandled?: SpeciesData[];
  ratings?: RatingData[];
  bookings?: BookingData[];
  chats?: ChatData[];
  schedules?: ScheduleData[];
}

export interface LocationWithRelations extends LocationData {
  user?: UserData;
  bookings?: BookingData[];
}

export interface PetWithRelations extends PetData {
  user?: UserData;
  bookings?: BookingData[];
  chats?: ChatData[];
}

export interface SpeciesWithRelations extends SpeciesData {
  speciesType?: SpeciesTypeData;
  vet?: VetData;
}

export interface SpeciesTypeWithRelations extends SpeciesTypeData {
  species?: SpeciesData[];
}

export interface BookingWithRelations extends BookingData {
  vet?: VetData;
  pet?: PetData;
  location?: LocationData;
  payment?: PaymentData | null;
  concernDetails?: ConcernDetailData[];
  rating?: RatingData | null;
}

export interface PaymentWithRelations extends PaymentData {
  booking?: BookingData;
}

export interface ConcernTypeWithRelations extends ConcernTypeData {
  concernDetails?: ConcernDetailData[];
}

export interface ConcernDetailWithRelations extends ConcernDetailData {
  concern?: ConcernTypeData;
  booking?: BookingData;
}

export interface RatingWithRelations extends RatingData {
  vet?: VetData;
  user?: UserData;
  booking?: BookingData;
}

export interface BlogWithRelations extends BlogData {
  category?: CategoryData;
}

export interface CategoryWithRelations extends CategoryData {
  blogs?: BlogData[];
}

export interface ChatWithRelations extends ChatData {
  vet?: VetData;
  pet?: PetData;
}

export interface ScheduleWithRelations extends ScheduleData {
  vet?: VetData;
}

export interface NotificationSubscriptionWithRelations extends NotificationSubscriptionData {
  user?: UserData;
}

export interface NotificationWithRelations extends NotificationData {
  user?: UserData;
}

export interface VetWithSpeciesType extends VetData {
  user?: UserWithRelations;
  speciesHandled: Array<SpeciesData & { speciesType: SpeciesTypeData }>;
}

export interface VetStats {
  totalPatients: number;
  totalIncome: number ; 
  upcomingAppointment: number ;
  pendingAppointment: number ;
}


