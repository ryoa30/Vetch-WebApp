// /lib/services/AuthService.ts
import { HttpClient } from "../http/HttpClient";
import { API_URL } from "@/constant/apiConstant";
import { IResponse } from "../http/types";


export class BookingService {
  #http: HttpClient = new HttpClient({baseUrl: API_URL.BOOKING});

    async getConcernTypes() {
        return await this.#http.get<IResponse>('/concern-types');
    }

}
