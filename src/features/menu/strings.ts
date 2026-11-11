import type { Localized } from "@/shared/i18n";

interface BadgeStrings {
  top: string;
  new: string;
  outOfStock: string;
}

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
} satisfies {
  badges: Localized<BadgeStrings>;
};

export type BadgeLabelKind = keyof typeof config.badges.en;
