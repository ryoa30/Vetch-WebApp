// /lib/services/AuthService.ts
import { HttpClient } from "../http/HttpClient";
import { API_URL } from "@/constant/apiConstant";
import { IResponse } from "../http/types";

export class VetService {
  #http: HttpClient = new HttpClient({ baseUrl: API_URL.VET });

  async fetchVets(page: number, volume: number, query: string = "", filters: any = {}) {
    const payload = {
      page,
      volume,
      query,
      filters
    }

    console.log("filters: ",filters);

    return await this.#http.post<IResponse>(
      `/`, payload
    );
  }

  async fetchVetDetails(id: string){
    return await this.#http.get<IResponse>(
      `/${id}`
    )
  }

  async fetchVetRatings(id: string){
    return await this.#http.get<IResponse>(
      `/ratings/${id}`
    )
  }

  async fetchVetSchedules(id: string, day: number, bookingDate: string) {
    return await this.#http.get<IResponse>(
      `/schedule?id=${id}&day=${day}&bookingDate=${bookingDate}`
    );
  }
}
