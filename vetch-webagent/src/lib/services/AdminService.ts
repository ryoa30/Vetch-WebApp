// /lib/services/AuthService.ts
import { HttpClient } from "../http/HttpClient";
import { API_URL } from "@/constant/apiConstant";


export class AdminService {
  #http: HttpClient = new HttpClient({baseUrl: API_URL.ADMIN});

  async getUncomfirmedVetCertificates(page: number, volume: number, query: string = '') {
    return await this.#http.get(`/vet-certificates/?page=${page}&volume=${volume}&query=${query}`);
  }

  async getComfirmedVetCertificates(page: number, volume: number, query: string = '') {
    return await this.#http.get(`/vet-confirmed-certificates/?page=${page}&volume=${volume}&query=${query}`);
  }

  async changeVetCertificateStatus(vetId: string, status: boolean) {
    return await this.#http.put('/vet-certificates/status', {vetId, status});
  }
  

}
