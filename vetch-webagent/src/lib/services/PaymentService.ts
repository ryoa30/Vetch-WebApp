// /lib/services/AuthService.ts
import { HttpClient } from "../http/HttpClient";
import { API_URL } from "@/constant/apiConstant";
import { IResponse } from "../http/types";

export class PaymentService {
  #http: HttpClient = new HttpClient({ baseUrl: API_URL.PAYMENT });


  async getTransactionToken(
    user: any,
    totalPrice: number,
  ) {
    const payload = {
      user,
      totalPrice
    };

    console.log(payload);

    return await this.#http.post<IResponse>("/midtrans", payload);
  }
}
