// /lib/services/AuthService.ts
import { HttpClient } from "../http/HttpClient";
import { API_URL } from "@/constant/apiConstant";
import { IResponse } from "../http/types";


export class AdminService {
  #http: HttpClient = new HttpClient({baseUrl: API_URL.ADMIN});

  async fetchUncomfirmedVetCertificates(page: number, volume: number, query: string = '') {
    return await this.#http.get<IResponse>(`/vet-certificates/?page=${page}&volume=${volume}&query=${query}`);
  }

  async fetchComfirmedVetCertificates(page: number, volume: number, query: string = '') {
    return await this.#http.get<IResponse>(`/vet-confirmed-certificates/?page=${page}&volume=${volume}&query=${query}`);
  }

  async changeVetCertificateStatus(vetId: string, status: boolean) {
    return await this.#http.put<IResponse>('/vet-certificates/status', {vetId, status});
  }
  

}
