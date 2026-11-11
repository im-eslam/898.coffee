import { useCallback, useState } from "react";
import { ROUTES, useLocation } from "@/shared/router";

type ReviewStep = "choices" | "note" | "success";

const GOOGLE_REVIEW_URL =
  "https://search.google.com/local/writereview?placeid=ChIJ6TmFLgCd9xQRJhy85GpSRQ4";

export function useReviewFlow() {
  const [location, setLocation] = useLocation();
  const [step, setStep] = useState<ReviewStep>("choices");
  const isOpen = location === ROUTES.review;

  const close = useCallback(() => {
    setStep("choices");
    if (location !== ROUTES.landing) setLocation(ROUTES.landing);
  }, [location, setLocation]);

  const openGoogleReview = useCallback(() => {
    window.open(GOOGLE_REVIEW_URL, "_blank", "noopener,noreferrer");
    close();
  }, [close]);

  const chooseNote = useCallback(() => {
    setStep("note");
  }, []);

  const complete = useCallback(() => {
    setStep("success");
  }, []);

  return {
    isOpen,
    step,
    close,
    openGoogleReview,
    chooseNote,
    complete,
  };
}
