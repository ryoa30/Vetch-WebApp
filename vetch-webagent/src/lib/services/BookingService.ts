// /lib/services/AuthService.ts
import { HttpClient } from "../http/HttpClient";
import { API_URL } from "@/constant/apiConstant";
import { IResponse } from "../http/types";
import { formatLocalDate } from "../utils/formatDate";

export class BookingService {
  #http: HttpClient = new HttpClient({ baseUrl: API_URL.BOOKING });

  async updateBookingStatus(bookingId: string, status: string) {
    return await this.#http.put<IResponse>(`/status`, {id: bookingId, status });
  }

  async getConcernTypes() {
    return await this.#http.get<IResponse>("/concern-types");
  }

  async getBookingByUserDateTime(userId: string, date: string, time: string) {
    return await this.#http.get<IResponse>(
      `/by-user-date-time?userId=${userId}&bookingDate=${date}&bookingTime=${time}`
    );
  }

  async getBookingConsultationHomecare(userId: string, status: string){
    const resultOnline =  await this.#http.get<IResponse>(`/?userId=${userId}&type=Online&status=${status}`);
    const resultHomecare =  await this.#http.get<IResponse>(`/?userId=${userId}&type=Homecare&status=${status}`);

    console.log(resultOnline, resultHomecare);

    return {
      online: resultOnline.ok? resultOnline.data: undefined,
      homecare: resultHomecare.ok ? resultHomecare.data : undefined
    }
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
