import { HttpClient } from "../http/HttpClient";
import { UserService } from "../services/UserService";
import {API_URL} from "../../constant/apiConstant"

// /lib/LoginValidator.ts
export type AccountInfoInput = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
};
export type LocationInput = {
  address: string;
  addressNotes: string;
  urbanVillage: string;
  district: string;
  province: string;
  postalCode: string;
};

export type ValidationResult<T> =
   { ok: true; data: T }
  | { ok: false; errors: Record<string, string> };

export class UserValidator {
  #userService = new UserService(new HttpClient({baseUrl: API_URL.USER}));

  validateAccountInfo(input: Partial<AccountInfoInput>): ValidationResult<AccountInfoInput> {
    const errors: Record<string, string> = {};

    const email = (input.email ?? "").trim();
    if (!email) errors.email = "Email is required";
    else if (!email.includes("@")) errors.email = "Email must contains @";

    const password = input.password ?? "";
    if (!password) errors.password = "Password is required";
    else if (password.length < 8) errors.password = "Min 8 characters";

    const confirmPassword = input.confirmPassword ?? "";
    if (!confirmPassword) errors.confirmPassword = "Confirm password is required";
    else if (confirmPassword !== password) errors.confirmPassword = "Password must match";

    const firstName = (input.firstName ?? "").trim();
    if (!firstName) errors.firstName = "First name is required";

    const lastName = (input.lastName ?? "").trim();
    if (!lastName) errors.lastName = "Last name is required";

    const phone = (input.phone ?? "").trim();
    if (!phone) errors.phone = "Phone is required";
    else if(!phone.startsWith("08")) errors.phone = "Phone must start with 08";


    if (Object.keys(errors).length) return { ok: false, errors: errors };

    return {
      ok: true,
      data: {
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        phone
      },
    };
  }

  async validateEmail(email: string): Promise<ValidationResult<string>> {

    const getEmail = await this.#userService.getUserByEmail(email);
    console.log(getEmail);

    if(getEmail){
      return { ok: false, errors: {email: "Email already exist"} };
    }

    return { ok: true, data: email };
  }

  validateLocation(address: string, addressNotes: string, urbanVillage: string, district: string, province: string, postalCode: string): ValidationResult<LocationInput> {
    const errors: Record<string, string> = {};

    if (!address) errors.address = "Address is required";

    if (Object.keys(errors).length) return { ok: false, errors: errors };

    return {
      ok: true,
      data: {
        address,
        addressNotes,
        urbanVillage,
        district,
        province,
        postalCode,
      },
    };
  }
}
