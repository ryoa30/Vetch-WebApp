// /lib/LoginValidator.ts
export type BookingInfoInput = {
  selectedPet: any;
  illnessDescription: string;
  selectedConcerns: string[];
};

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; errors: Record<string, string> };

export class BookingValidator {
  validateBookingInfo(
    input: Partial<BookingInfoInput>
  ): ValidationResult<BookingInfoInput> {
    const errors: Record<string, string> = {};

    const selectedPet = input.selectedPet;
    if (!selectedPet) errors.selectedPet = "Pet selection is required";

    const illnessDescription = (input.illnessDescription ?? "").trim();
    if (!illnessDescription)
      errors.illnessDescription = "Illness description is required";
    else if (illnessDescription.length < 10)
      errors.illnessDescription = "Illness description must be at least 10 characters";

    const selectedConcerns = input.selectedConcerns;
    if (!selectedConcerns || selectedConcerns.length === 0)
      errors.selectedConcerns = "At least one concern must be selected";

    if (Object.keys(errors).length) return { ok: false, errors: errors };

    return {
      ok: true,
      data: {
        selectedPet,
        illnessDescription,
        selectedConcerns: input.selectedConcerns ?? [],
      },
    };
  }
}
