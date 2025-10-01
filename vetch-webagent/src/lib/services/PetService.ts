// /lib/services/AuthService.ts
import { HttpClient } from "../http/HttpClient";
import { API_URL } from "@/constant/apiConstant";
import { IResponse } from "../http/types";


export class PetService {
  #http: HttpClient = new HttpClient({baseUrl: API_URL.PET});

    async fetchPetsByUserId(userId) {
        return await this.#http.get<IResponse>('/'+userId);
    }

}
