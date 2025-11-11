// /lib/services/AuthService.ts
import { HttpClient } from "../http/HttpClient";
import { API_URL } from "@/constant/apiConstant";
import { IResponse } from "../http/types";

export class PaymentService {
  #http: HttpClient = new HttpClient({ baseUrl: API_URL.PAYMENT });

  async updatePaymentDetails(bookingId: string, status: string, paymentMethod: string, transactionId: string){
    return await this.#http.put<IResponse>(`/`, {bookingId, status, paymentMethod, transactionId});
  }

  async refundPayment(bookingId: string, reason: string){
    return await this.#http.post<IResponse>(`/refund`, {bookingId, reason});
  }

  async fetchTransactionToken(
    bookingId: string,
    user?: any,
    totalPrice?: number,
    serviceType?: string,
    basePrice?: number,
  ) {
    const payload = {
      user,
      totalPrice,
      serviceType,
      basePrice,
      bookingId,
    };

    console.log(payload);

    return await this.#http.post<IResponse>("/midtrans", payload);
  }
}
