"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Star, AlignLeft } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { BookingService } from "@/lib/services/BookingService";
import { useSession } from "@/contexts/SessionContext";

type RatingDialogProps = {
  show: boolean;
  booking: any | null;
  onClose: () => void;
  onSubmit: (data: { rating: number; description: string }) => void;
  title?: string;
  initialRating?: number;
  initialDescription?: string;
};

export function RatingDialog({
  show,
  onClose,
  onSubmit,
  booking,
  title = "Rate your Vet!",
  initialRating = 0,
  initialDescription = "",
}: RatingDialogProps) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);
  const [desc, setDesc] = useState(initialDescription);
  const [submitting, setSubmitting] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const {user} = useSession();
  const bookingService = new BookingService();

  useEffect(() => {
    if (!show) {
      // reset when closed
      setHover(0);
      setSubmitting(false);
    }
  }, [show]);

  const display = hover || rating;

  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      setRating((r) => Math.min(5, (r || 0) + 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setRating((r) => Math.max(0, (r || 0) - 1));
    } else if (e.key === "0") {
      setRating(0);
    } else if (/[1-5]/.test(e.key)) {
      setRating(Number(e.key));
    }
  };

  const save = async () => {
    if (!rating) return;
    try {
      setSubmitting(true);
      const result = await bookingService.rateBooking(user?.id || "", booking.vetId, booking.id, rating, desc); 
      console.log(result);
      onSubmit({ rating, description: desc.trim() });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-lg w-[95vw] bg-white dark:bg-[#1F2D2A] text-black dark:text-white rounded-lg shadow-lg [&>button:last-child]:hidden focus:outline-none"
        onKeyDown={handleKey}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
          aria-label="Close rating dialog"
        >
          <X size={20} />
        </button>

        <DialogHeader>
          <DialogTitle className="mt-4 text-xl font-semibold text-[#0F5544] dark:text-white">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div
          ref={containerRef}
          className="space-y-4 focus:outline-none"
          role="group"
          aria-label="Star rating"
          tabIndex={0}
        >
          {/* Stars */}
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {[1, 2, 3, 4, 5].map((n) => {
              const active = n <= display;
              return (
                <button
                  key={n}
                  type="button"
                  className="p-1 sm:p-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F5544] transition-transform active:scale-95"
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  onFocus={() => setHover(0)}
                  onClick={() => setRating(n)}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  aria-pressed={n <= rating}
                >
                  <Star
                    className={[
                      "w-8 h-8 sm:w-9 sm:h-9",
                      active
                        ? "text-yellow-400 stroke-yellow-500 fill-yellow-400"
                        : "text-gray-400 dark:text-gray-500 stroke-current",
                      active ? "drop-shadow" : "",
                    ].join(" ")}
                  />
                </button>
              );
            })}
          </div>

          {/* Label + Description */}
          <div className="space-y-2">
            <div className="flex gap-2">
                <AlignLeft className="w-5 h-5 text-black dark:text-white" />
                <Label className="inline-flex items-center gap-2 font-medium dark:text-white">
                <span className="i-lucide-align-left" />
                Rating Description
                </Label>
            </div>
            <Textarea
              placeholder="Share a few details about your experience…"
              className="min-h-[120px] resize-y bg-muted/30 dark:bg-white/5"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>


          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              className="rounded-full border sm:w-auto"
              onClick={onClose}
              type="button"
            >
              Cancel
            </Button>
            <Button
              onClick={save}
              disabled={!rating || submitting || desc.trim().length === 0}
              className="rounded-full px-6 py-2 border border-black bg-white text-black dark:text-white hover:bg-gray-100 dark:border-white dark:bg-transparent dark:hover:bg-white/10 sm:w-auto"
            >
              {submitting ? "Saving…" : "Rate"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
