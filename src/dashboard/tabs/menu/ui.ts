const focusRing =
  "outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-brand";

export const ui = {
  card: "rounded-2xl border border-slate-200 bg-white p-6",
  heading: "text-heading font-semibold text-slate-900",
  sub: "text-small text-slate-500",
  label: "text-small font-medium text-slate-700",
  error: "text-small text-error",
  input:
    "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-body text-slate-900 outline-none placeholder:text-slate-400 data-[focused]:border-brand data-[focused]:ring-2 data-[focused]:ring-brand/20 data-[invalid]:border-error data-[disabled]:bg-slate-50 data-[disabled]:text-slate-500",
  textarea:
    "min-h-28 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-body text-slate-900 outline-none placeholder:text-slate-400 data-[focused]:border-brand data-[focused]:ring-2 data-[focused]:ring-brand/20 data-[invalid]:border-error",
  button: `inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-small font-semibold text-slate-700 transition-colors data-[hovered]:bg-slate-50 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 ${focusRing}`,
  primary: `inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand px-5 text-small font-semibold text-white transition-colors data-[hovered]:bg-navy data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60 ${focusRing}`,
  danger: `inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-error/40 bg-white px-4 text-small font-semibold text-error transition-colors data-[hovered]:bg-error/5 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 ${focusRing}`,
  iconButton: `inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-slate-600 transition-colors data-[hovered]:bg-slate-100 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 ${focusRing}`,
  dragHandle: `inline-flex size-11 shrink-0 cursor-grab items-center justify-center rounded-lg text-slate-400 data-[hovered]:bg-slate-100 active:cursor-grabbing ${focusRing}`,
  overlay:
    "fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 sm:items-center data-[entering]:animate-in data-[entering]:fade-in",
  modal:
    "w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl outline-none",
  popover:
    "max-h-72 w-(--trigger-width) overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg",
  option:
    "flex cursor-pointer items-center rounded-md px-3 py-2 text-body text-slate-900 outline-none data-[focused]:bg-brand/10 data-[disabled]:opacity-50",
  focusRing,
} as const;
