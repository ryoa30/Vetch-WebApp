// /lib/services/AuthService.ts
import { HttpClient } from "../http/HttpClient";


export class UserService {
  constructor(private http: HttpClient) {}

  async getUserByEmail(email: string) {
    return await this.http.getCatch('/email/' + email);
  }
}
