// /lib/services/AuthService.ts
import { HttpClient } from "../http/HttpClient";
import { API_URL } from "@/constant/apiConstant";
import { IResponse } from "../http/types";

export class BookingService {
  #http: HttpClient = new HttpClient({ baseUrl: API_URL.BOOKING });

  async getConcernTypes() {
    return await this.#http.get<IResponse>("/concern-types");
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
      bookingDate: new Date(date).toISOString().split('T')[0],
      bookingTime: time,
      bookingPrice: totalPrice,
      bookingType: type,
      concerns: selectedConcerns,
    };

    console.log(payload);

    return await this.#http.post<IResponse>("/", payload);
  }
}
