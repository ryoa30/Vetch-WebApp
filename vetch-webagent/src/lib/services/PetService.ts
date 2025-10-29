// /lib/services/AuthService.ts
import { HttpClient } from "../http/HttpClient";
import { API_URL } from "@/constant/apiConstant";
import { IResponse } from "../http/types";


export class PetService {
  #http: HttpClient = new HttpClient({baseUrl: API_URL.PET});
    async createPet(data: any) {
      return await this.#http.post<IResponse>('/', data);
    }

    async deletePet(petId: string) {
      return await this.#http.delete<IResponse>('/'+petId);
    }

    async updatePet(data: any) {
        return await this.#http.put<IResponse>('/', data);
    }

    async fetchPetsByUserId(userId) {
        return await this.#http.get<IResponse>('/'+userId);
    }

    async fetchPetsByVetId(vetId) {
        return await this.#http.get<IResponse>('/vet/'+vetId);
    }

}
