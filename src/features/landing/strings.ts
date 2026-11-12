import type { Localized } from "@/shared/i18n";

const en = {
  header: {
    taglineLead: "Good Coffee",
    taglineEmphasis: "Better Days.",
  },
  language: {
    name: "عربي",
  },
  sections: {
    primary: {
      menu: {
        title: "Menu",
        hint: "Drinks, desserts & offers",
      },
      review: {
        title: "Rate your visit",
        hint: "Shape your next sip",
      },
    },
    social: {
      title: "Follow the story",
    },
    location: {
      title: "Find your seat",
      locationName: "Main branch",
    },
  },
  footer: {
    lead: "Every visit tells",
    emphasis: "a story.",
  },
};

const ar: typeof en = {
  header: {
    taglineLead: "قهوه حلوة",
    taglineEmphasis: "أيام أحلى.",
  },
  language: {
    name: "English",
  },
  sections: {
    primary: {
      menu: {
        title: "القائمة",
        hint: "مشروبات، حلويات وعروض",
      },
      review: {
        title: "قيّم زيارتك",
        hint: "رأيك بيحدد فنجانك الجاي",
      },
    },
    social: {
      title: "تابع الحكاية",
    },
    location: {
      title: "لاقي قعدتك",
      locationName: "الفرع الرئيسي",
    },
  },
  footer: {
    lead: "كل قعدة ليها",
    emphasis: "حكاية.",
  },
};

export const strings: Localized<typeof en> = { en, ar };
