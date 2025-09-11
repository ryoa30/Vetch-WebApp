// /lib/services/AuthService.ts
import { is } from "date-fns/locale";
import { HttpClient } from "../http/HttpClient";


export class UserService {
  constructor(private http: HttpClient) {}

  async getUserByEmail(email: string) {
    return await this.http.getCatch('/email/' + email);
  }

  async validateOtp (email: string, otp: string) {
    return await this.http.post('/validate-otp', {email: email, otp: otp});
  }

  async register(context: any, role: string) {

    const petDobStr =
      context.petDob instanceof Date
        ? context.petDob.toISOString().slice(0, 10)
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

    console.log("formaData: ",formData.getAll("file"));

    return await this.http.postForm("/register", formData);

    
  }

}
