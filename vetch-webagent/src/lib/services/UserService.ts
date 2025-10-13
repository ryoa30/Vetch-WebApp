// /lib/services/AuthService.ts
import { HttpClient } from "../http/HttpClient";
import { API_URL } from "@/constant/apiConstant";
import { IResponse } from "../http/types";
import { formatLocalDate } from "../utils/formatDate";
// Do not import server-only session utilities in client-land


export class UserService {
  #http: HttpClient = new HttpClient({baseUrl: API_URL.USER});

  async updateProfile (userId: string, firstName: string, lastName: string, image: File | string | null){
    const formData = new FormData();

    if(image && typeof image !== "string"){
      formData.append("file", image);
    }
    formData.append('data', JSON.stringify({
      id: userId,
      firstName: firstName,
      lastName: lastName,
      fullName: firstName + " " + lastName,
    }));

    console.log("formData", formData.getAll("data"));
    return await this.#http.putForm<IResponse>('/', formData);
    // return null;
  }

  async fetchUserById (userId: string){
    return await this.#http.get<IResponse>('/' + userId);
  }

  async fetchUserLocationById (userId: string){
    return await this.#http.get<IResponse>('/location/' + userId);
  }

  async fetchUserByEmail(email: string) {
    return await this.#http.getCatch<IResponse>('/email/' + email);
  }

  async validateOtp (email: string, otp: string) {
    return await this.#http.post<IResponse>('/validate-otp', {email: email, otp: otp});
  }

  async login(email: string, password: string, rememberMe: boolean) {
    try {
      const result = await this.#http.post<IResponse>('/login', {email: email, password: password, rememberMe: rememberMe}, { credentials: "include" });
      console.log(result);
      if(result.ok){
        // Set iron-session via server route to avoid client importing server-only code
        await fetch('/api/session/set', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          cache: 'no-store',
          body: JSON.stringify({
            accessToken: result.accessToken,
            user: {
              id: result.data.id,
              role: result.data.role,
              fullName: result.data.fullName,
              email: result.data.email,
            }
          }),
        });

        return result.data;
      }
    } catch (error) {
      alert('Invalid email or password');
      console.log(error); 
      return null;
    }
  }


  async register(context: any, role: string) {

    const petDobStr =
      context.petDob instanceof Date
        ? formatLocalDate(context.petDob)
        : undefined;

    const formData = new FormData();

    let payload = {}

    if(role === "user"){
      payload = {
        userInfo: {
          email: context.email,
          password: context.password,
          firstName: context.firstName,
          lastName: context.lastName,
          fullName: context.firstName + " " + context.lastName,
          phoneNumber: context.phone,
          role: role,
          location: {
            addressName: context.address,
            postalCode: context.postalCode,
            city: context.city,
            district: context.district,
            urbanVillage: context.urbanVillage,
            province: context.province,
            addressNotes: context.addressNotes,
            coordinates: context.locationCoordinates,
          },
        },
        petInfo: {
          petName: context.petName,
          speciesName: context.petSpecies,
          gender: context.petGender, 
          petDob: petDobStr,        
          neuterStatus: Boolean(context.petNeutered),
          primaryColor: context.petColor,
          weight: Number(context.petWeight),
        },
      };
      
    }else{
      payload = {
        userInfo: {
          email: context.email,
          password: context.password,
          firstName: context.firstName,
          lastName: context.lastName,
          fullName: context.firstName + " " + context.lastName,
          phoneNumber: context.phone,
          role: role,
          location: {
            addressName: context.address,
            postalCode: context.postalCode,
            city: "",
            district: context.district,
            urbanVillage: context.urbanVillage,
            province: context.province,
            addressNotes: context.addressNotes,
            coordinates: context.locationCoordinates,
          },
        },
        vetInfo: {
          isAvailHomecare: context.isAvailHomecare,
          isAvailEmergency: context.isAvailEmergency,
          uploadCertificate: "",
          sipNumber: context.sipNumber,
          description: "",
          price: 0
        },
      };
      // console.log(context.certificate);
      formData.append("file", context.certificate);
    }

    formData.append('data', JSON.stringify(payload));

    return await this.#http.postForm("/register", formData);

    
  }

}
