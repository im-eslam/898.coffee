import type { Localized } from "@/shared/i18n";

export const config = {
  messages: {
    en: {
      unknown: "Something went wrong. Please try again.",
      limit: "You can delete up to 100 reviews at a time.",
      deleted: "Reviews deleted",
      errors: {
        INVALID_INPUT: "Some of the input isn't valid. Check it and try again.",
        RATE_LIMITED: "Too many requests. Wait a moment and try again.",
        INTERNAL_ERROR: "The server ran into a problem. Please try again.",
        NETWORK_ERROR: "No connection. Check your network and try again.",
        TIMEOUT: "The request took too long. Please try again.",
        INVALID_RESPONSE: "The server sent an unexpected response.",
        UNKNOWN_ERROR: "Something went wrong. Please try again.",
      },
    },
    ar: {
      unknown: "حدث خطأ. حاول مرة أخرى.",
      limit: "يمكنك حذف 100 مراجعة كحد أقصى في المرة الواحدة.",
      deleted: "تم حذف المراجعات",
      errors: {
        INVALID_INPUT: "بعض البيانات غير صالحة. راجعها وحاول مرة أخرى.",
        RATE_LIMITED: "طلبات كثيرة. انتظر لحظة ثم حاول مرة أخرى.",
        INTERNAL_ERROR: "واجه الخادم مشكلة. حاول مرة أخرى.",
        NETWORK_ERROR: "لا يوجد اتصال. تحقق من الشبكة وحاول مرة أخرى.",
        TIMEOUT: "استغرق الطلب وقتاً طويلاً. حاول مرة أخرى.",
        INVALID_RESPONSE: "أرسل الخادم استجابة غير متوقعة.",
        UNKNOWN_ERROR: "حدث خطأ. حاول مرة أخرى.",
      },
    },
  },
};

type Messages = (typeof config.messages)["en"];

export function errorMessage(m: Messages, code?: string): string {
  return code && code in m.errors
    ? m.errors[code as keyof Messages["errors"]]
    : m.unknown;
}

const en = {
  page: {
    count: "{count} reviews",
    empty: "No reviews yet.",
    noResults: "No reviews match your search.",
    loadFailed: "Couldn't load reviews.",
    retry: "Try again",
    loading: "Loading reviews…",
    pagination: {
      previous: "Previous",
      next: "Next",
      info: "Page {page} of {total}",
    },
  },
  search: {
    label: "Search reviews",
    placeholder: "Search by name, contact, or message",
    clear: "Clear search",
  },
  bulk: {
    selected: "{count} selected",
    delete: "Delete selected",
    clear: "Clear selection",
  },
  card: {
    open: "Open review",
    anonymous: "Anonymous",
    noContact: "No contact",
  },
  table: {
    caption: "Reviews",
    selectAll: "Select all reviews on this page",
    selectRow: "Select review from {name}",
    name: "Name",
    contact: "Contact",
    message: "Message",
    date: "Date",
    actions: "Actions",
  },
  dialog: {
    title: "Review",
    description: "Full details of the selected review",
    close: "Close",
    delete: "Delete review",
    confirmTitle: "Delete review?",
    confirmTitleMany: "Delete {count} reviews?",
    confirmText: "This can't be undone.",
    cancel: "Cancel",
    confirmButton: "Delete",
    deleting: "Deleting…",
  },
};

export type ReviewStrings = typeof en;

const ar: ReviewStrings = {
  page: {
    count: "{count} مراجعة",
    empty: "لا توجد مراجعات بعد.",
    noResults: "لا توجد مراجعات تطابق بحثك.",
    loadFailed: "تعذر تحميل المراجعات.",
    retry: "حاول مرة أخرى",
    loading: "جارٍ تحميل المراجعات…",
    pagination: {
      previous: "السابق",
      next: "التالي",
      info: "الصفحة {page} من {total}",
    },
  },
  search: {
    label: "البحث في المراجعات",
    placeholder: "ابحث بالاسم أو وسيلة التواصل أو الرسالة",
    clear: "مسح البحث",
  },
  bulk: {
    selected: "تم تحديد {count}",
    delete: "حذف المحدد",
    clear: "إلغاء التحديد",
  },
  card: {
    open: "فتح المراجعة",
    anonymous: "مجهول",
    noContact: "لا توجد وسيلة تواصل",
  },
  table: {
    caption: "المراجعات",
    selectAll: "تحديد كل المراجعات في هذه الصفحة",
    selectRow: "تحديد المراجعة من {name}",
    name: "الاسم",
    contact: "وسيلة التواصل",
    message: "الرسالة",
    date: "التاريخ",
    actions: "الإجراءات",
  },
  dialog: {
    title: "المراجعة",
    description: "التفاصيل الكاملة للمراجعة المحددة",
    close: "إغلاق",
    delete: "حذف المراجعة",
    confirmTitle: "حذف المراجعة؟",
    confirmTitleMany: "حذف {count} مراجعات؟",
    confirmText: "لا يمكن التراجع عن هذا الإجراء.",
    cancel: "إلغاء",
    confirmButton: "حذف",
    deleting: "جارٍ الحذف…",
  },
};

export const strings: Localized<ReviewStrings> = { en, ar };

export function fill(
  text: string,
  vars: Record<string, string | number>
): string {
  return text.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(vars[key] ?? "")
  );
}
