export interface IVet {
    id: string;
    userId: string;
    price: number;
    fullName: string;
    description: string;
    schedules: ISchedules[];
    profilePicture: string;
    ratingCount: number;
    ratingAvg: number;
    isAvailHomecare?:boolean;
    isAvailEmergency?:boolean;
    sipNumber?: string;
    speciesHandled?: string[];
}

export interface ISchedules {
    id: string;
    dayNumber: string;
    timeOfDay: string;
}