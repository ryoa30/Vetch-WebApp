// /lib/LoginValidator.ts
export type PetInfoInput = {
  petName: string;
  petSpecies: string;
  petColor: string;
  petGender: string;
  petWeight: number;
  petNeutered: boolean;
  petDob: Date | undefined;
};
export type PetEditInfoInput = {
  petName: string;
  petColor: string;
  petWeight: number;
};

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; errors: Record<string, string> };

export class PetValidator {
  validatePetEditInfo(
    input: Partial<PetEditInfoInput>
  ): ValidationResult<PetEditInfoInput> {
    const errors: Record<string, string> = {};

    const petName = (input.petName ?? "").trim();
    if (!petName) errors.petName = "Pet name is required";

    const petColor = (input.petColor ?? "").trim();
    if (!petColor) errors.primaryColor = "Pet color is required";

    const petWeight = input.petWeight;
    if (!petWeight) errors.weight = "Pet weight is required";
    else if (petWeight < 0.001) {
      errors.weight = "Pet weight must be at least 1 gram";
    }


    if (Object.keys(errors).length) return { ok: false, errors: errors };

    return {
      ok: true,
      data: {
        petName,
        petColor,
        petWeight: input.petWeight ?? 0,
      },
    };
  }

  validatePetInfo(
    input: Partial<PetInfoInput>
  ): ValidationResult<PetInfoInput> {
    const errors: Record<string, string> = {};

    const petName = (input.petName ?? "").trim();
    if (!petName) errors.petName = "Pet name is required";

    const petSpecies = (input.petSpecies ?? "").trim();
    if (!petSpecies) errors.species = "Pet species is required";

    const petColor = (input.petColor ?? "").trim();
    if (!petColor) errors.primaryColor = "Pet color is required";

    const petGender = (input.petGender ?? "").trim();
    if (!petGender) errors.gender = "Pet gender is required";

    const petWeight = input.petWeight;
    if (!petWeight) errors.weight = "Pet weight is required";
    else if (petWeight < 0.001) {
      errors.weight = "Pet weight must be at least 1 gram";
    }

    const petDob = input.petDob;
    if (!petDob) errors.dob = "Pet date of birth is required";
    else if (petDob > new Date()) {
      errors.dob = "Pet date of birth cannot be in the future";
    }

    if (Object.keys(errors).length) return { ok: false, errors: errors };

    return {
      ok: true,
      data: {
        petName,
        petSpecies,
        petColor,
        petGender,
        petWeight: input.petWeight ?? 0,
        petNeutered: input.petNeutered ?? false,
        petDob,
      },
    };
  }
}
