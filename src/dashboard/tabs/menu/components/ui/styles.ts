/** Class names shared by the shell, the states, and the tabs. */
export const focusRing =
  "outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-brand";

export const card = "rounded-2xl border border-slate-200 bg-white p-6";

export const heading = "text-heading font-semibold text-slate-900";

export const stateText = "text-body text-slate-600";

export const primaryButton = `inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand px-5 text-small font-semibold text-white transition-colors data-[hovered]:bg-navy data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60 ${focusRing}`;
