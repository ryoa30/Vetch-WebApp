
export type VetInfoInput = {
  firstName: string;
  lastName: string;
  price: number;
  description: string;
}

export type ValidationResult<T> =
   { ok: true; data: T }
  | { ok: false; errors: Record<string, string> };

export class VetValidator {

  validateVetInfo(firstName:string, lastName:string, price:number, description: string): ValidationResult<VetInfoInput> {
    const errors: Record<string, string> = {};

    if(!firstName || firstName.trim() === "") {
      errors.firstName = "First name is required";
    }
    if(!lastName || lastName.trim() === "") {
        errors.lastName = "Last name is required";
    }
    if(price===undefined || price===null || isNaN(price) || price < 0) {
        errors.price = "Price must be a valid number and cannot be negative";
    }
    if(!description || description.trim().length < 10) {
        errors.description = "Description must be more than 10 characters";
    }

    if (Object.keys(errors).length) return { ok: false, errors: {...errors} };

    return {
      ok: true,
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        price,
        description: description.trim(),
      },
    };
  }
}
