// /lib/services/AuthService.ts
import { HttpClient } from "../http/HttpClient";
import { API_URL } from "@/constant/apiConstant";
import { IResponse } from "../http/types";

export class VetService {
  #http: HttpClient = new HttpClient({ baseUrl: API_URL.VET });

  async getVets(page: number, volume: number, query: string = "") {
    return await this.#http.get<IResponse>(
      `/?page=${page}&volume=${volume}&query=${query}`
    );
  }

  async getVetDetails(id: string){
    return await this.#http.get<IResponse>(
      `/${id}`
    )
  }

  async getVetRatings(id: string){
    return await this.#http.get<IResponse>(
      `/ratings/${id}`
    )
  }

  async getVetSchedules(id: string, day: number) {
    return await this.#http.get<IResponse>(
      `/schedule?id=${id}&day=${day}`
    );
  }
}
