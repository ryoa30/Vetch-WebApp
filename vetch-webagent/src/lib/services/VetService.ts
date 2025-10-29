// /lib/services/AuthService.ts
import { HttpClient } from "../http/HttpClient";
import { API_URL } from "@/constant/apiConstant";
import { IResponse } from "../http/types";
import { VetData } from "@/app/types";

export class VetService {
  #http: HttpClient = new HttpClient({ baseUrl: API_URL.VET });

  async postVetSpecies(vetId: string, speciesTypeId: string){
    return await this.#http.post<IResponse>(`/add-species`, {
      vetId,
      speciesTypeId
    });
  }

  async deleteVetSpecies(vetId: string, speciesId: string){
    return await this.#http.delete<IResponse>(`/delete-species?speciesId=${speciesId}`);
  }

  async fetchSpeciesTypes() {
    return await this.#http.get<IResponse>(`/species-types`);
  }

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

  async fetchVetDetailsByUserId(userId: string){
    return await this.#http.get<IResponse>(
      `/user/${userId}`
    )
  }

  async fetchVetsEmergency(page: number, volume: number, query: string = "", filters: any = {}, userId: string) {
    const payload = {
      page,
      volume,
      query,
      filters,
      userId
    }

    console.log("filters: ",filters);

    return await this.#http.post<IResponse>(
      `/emergency`, payload
    );
  }

  async fetchVetDetails(id: string, userId: string = ""){
    return await this.#http.get<IResponse>(
      `/${id}${userId ? `?userId=${userId}` : ""}`
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

  async fetchVetDailySchedule(id: string, day: number) {
    return await this.#http.get<IResponse>(
      `/daily-schedule?userId=${id}&day=${day}`
    );
  }

  async postVetSchedule(userId: string, time: string, day: number){
    return await this.#http.post<IResponse>(`/schedule`, {
      userId,
      day,
      time
    });
  }

  async updateVetSchedule(id:string, userId: string, time: string, day: number){
    return await this.#http.put<IResponse>(`/schedule`, {
      id,
      userId,
      day,
      time
    });
  }

  async deleteVetSchedule(id: string){
    return await this.#http.delete<IResponse>(`/schedule/${id}`);
  }

  async updateVetDetails(vet: VetData){
    // console.log("Updating vet details: ", vet);
    return await this.#http.put<IResponse>(
      `/`,
      {vet}
    )
  }

  async updateVetAvailability(userId: string, isHomecareAvailable: boolean, isEmergencyAvailable: boolean){
    return await this.#http.put<IResponse>(`/availability`, {
      userId,
      isHomecareAvailable,
      isEmergencyAvailable
    });
  }
}
