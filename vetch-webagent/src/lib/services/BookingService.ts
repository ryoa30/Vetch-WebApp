// /lib/services/AuthService.ts
import { HttpClient } from "../http/HttpClient";
import { API_URL } from "@/constant/apiConstant";
import { IResponse } from "../http/types";
import { formatLocalDate } from "../utils/formatDate";

export class BookingService {
  #http: HttpClient = new HttpClient({ baseUrl: API_URL.BOOKING });

  async rateBooking(userId: string, vetId: string, bookingId: string, rating: number, context: string) {
    return await this.#http.post<IResponse>("/rate", { userId, vetId, bookingId, rating, context });
  }

  async changeBookingStatus(bookingId: string, status: string) {
    return await this.#http.put<IResponse>(`/status`, {id: bookingId, status });
  }

  async changeBookingConclusionDate(bookingId: string, conclusion: string) {
    return await this.#http.put<IResponse>(`/conclusion`, {id: bookingId, conclusion });
  }

  async fetchConcernTypes() {
    return await this.#http.get<IResponse>("/concern-types");
  }

  async fetchBookingById(bookingId: string) {
    return await this.#http.get<IResponse>(`/byId/${bookingId}`);
  }

  async fetchBookingByUserDateTime(userId: string, date: string, time: string) {
    return await this.#http.get<IResponse>(
      `/by-user-date-time?userId=${userId}&bookingDate=${date}&bookingTime=${time}`
    );
  }

  async fetchBookingConsultationHomecare(userId: string, status: string){
    const resultOnline =  await this.#http.get<IResponse>(`/?userId=${userId}&type=Online&status=${status}`);
    const resultHomecare =  await this.#http.get<IResponse>(`/?userId=${userId}&type=Homecare&status=${status}`);
    const resultEmergency =  await this.#http.get<IResponse>(`/?userId=${userId}&type=Emergency&status=${status}`);

    console.log(resultOnline, resultHomecare, resultEmergency);

    return {
      online: resultOnline.ok? resultOnline.data: undefined,
      homecare: resultHomecare.ok ? resultHomecare.data : undefined, 
      emergency: resultEmergency.ok ? resultEmergency.data : undefined
    }
  }
  
  async fetchVetBookings(userId: string, status: string[], date?: string){
    const result =  await this.#http.get<IResponse>(`/vet/?userId=${userId}&status=${status}${date?`&date=${date}`:""}`);

    // console.log(result);

    return result;
  }

  async fetchPetMedicalHistory(petId: string, vetId?: string){
    return await this.#http.get<IResponse>(`/past-booking?petId=${petId}${vetId?`&vetId=${vetId}`:""}`);
  }
  
  async createBooking(
    selectedConcerns: any[],
    illnessDescription: string,
    petId: string,
    locationId: string,
    vetId: string,
    date: string,
    time: string,
    totalPrice: number,
    type: string
  ) {
    const payload = {
      vetId,
      petId,
      locationId,
      illnessDescription,
      bookingDate: formatLocalDate(new Date(date)),
      bookingTime: time,
      bookingPrice: totalPrice,
      bookingType: type,
      concerns: selectedConcerns,
    };

    console.log(payload);

    return await this.#http.post<IResponse>("/", payload);
  }
}
