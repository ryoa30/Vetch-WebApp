// /lib/services/AuthService.ts
import { HttpClient } from "../http/HttpClient";
import { API_URL } from "@/constant/apiConstant";
import { IResponse } from "../http/types";


export class ChatService {
  #http: HttpClient = new HttpClient({baseUrl: API_URL.CHAT});

  async getMessages(roomId: string, limit: number, before?:string) {
    return await this.#http.post<IResponse>(`/messages`, {roomId, limit, before: before? before : new Date().toISOString()});
  }

}
