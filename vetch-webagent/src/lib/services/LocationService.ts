// /lib/services/AuthService.ts
import { HttpClient } from "../http/HttpClient";
import { API_URL } from "../../constant/apiConstant";
import { IResponse } from "../http/types";


export class LocationService {
  private http: HttpClient;
  constructor() {
    this.http = new HttpClient({ baseUrl: API_URL.LOCATION });
  }

  async getAutocomplete(query: string) {
    return await this.http.get<IResponse>(`/autocomplete?query=${query}`);
  }

  async getProvinces() {
    return await this.http.get<IResponse>('/province');
  }
  async getCities(province_code: string) {
    return await this.http.get<IResponse>(`/regencies/${province_code}`);
  }

  async getDistricts(regency_code: string) {
    return await this.http.get<IResponse>(`/districts/${regency_code}`);
  }

  async getVillages(district_code: string) {
    return await this.http.get<IResponse>(`/villages/${district_code}`);
  }
}
