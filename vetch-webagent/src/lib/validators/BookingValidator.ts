import { BookingService } from "../services/BookingService";
import { dateToUTCDate, formatLocalDate, hhmmToUTCDate } from "../utils/formatDate";

// /lib/LoginValidator.ts
export type BookingInfoInput = {
  selectedPet: any;
  illnessDescription: string;
  selectedConcerns: string[];
};

export type BookingSelectionInput = {
  userId: string;
  selectedDate: Date | null;
  selectedTime: string;
};

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; errors: Record<string, string> };

export class BookingValidator {
  private bookingService = new BookingService();


  async validateBookingSelection(input: Partial<BookingSelectionInput>) {
    const errors: Record<string, string> = {};
    console.log("Validating booking selection:", input);
    if(hhmmToUTCDate(input.selectedTime) < dateToUTCDate(new Date()) && formatLocalDate(input.selectedDate!) === formatLocalDate(new Date())){
      errors.selectedTime = "Selected date time cannot be in the past";
    }
    const booking = await this.bookingService.fetchBookingByUserDateTime(input.userId!, formatLocalDate(input.selectedDate!), input.selectedTime!);
    console.log(booking.data);

    if(booking.data){
      errors.selectedTime = "You already have a booking at this date and time";
    }

    if (Object.keys(errors).length) return { ok: false, errors: errors };

    return {
      ok: true,
    };
  }

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
      errors.illnessDescription =
        "Illness description must be at least 10 characters";

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
