import type { Localized } from "@/shared/i18n";

export const config = {
  badges: {
    en: {
      top: "Bestseller",
      new: "New",
      outOfStock: "Out of stock",
    },
    ar: {
      top: "الأكثر مبيعًا",
      new: "جديد",
      outOfStock: "غير متوفر",
    },
  },

  sections: {
    en: {
      signatures: {
        id: "signatures",
        label: "Signatures",
      },
      pairings: {
        id: "pairings",
        label: "Pairings",
      },
    },
    ar: {
      signatures: {
        id: "signatures",
        label: "اختياراتنا المميزة",
      },
      pairings: {
        id: "pairings",
        label: "توليفاتنا",
      },
    },
  },
};
