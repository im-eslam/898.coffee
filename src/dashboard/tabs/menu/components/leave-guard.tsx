import { useEffect, useState } from "react";
import { useStrings } from "@/shared/i18n";
import { useDraft } from "../hooks/use-draft-context";
import { strings } from "../strings";
import { ConfirmModal } from "./confirm-modal";

function findAnchor(target: EventTarget | null): HTMLAnchorElement | null {
  return target instanceof Element ? target.closest("a[href]") : null;
}

export function LeaveGuard() {
  const s = useStrings(strings);
  const { isDirty } = useDraft();
  const [pending, setPending] = useState<string | null>(null);

  useEffect(() => {
    if (!isDirty) return;

    function onBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
    }

    function onClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const anchor = findAnchor(event.target);
      if (!anchor || (anchor.target && anchor.target !== "_self")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;
      event.preventDefault();
      event.stopPropagation();
      setPending(`${url.pathname}${url.search}${url.hash}`);
    }

    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [isDirty]);

  function leave() {
    if (!pending) return;
    const target = pending;
    setPending(null);
    window.history.pushState(null, "", target);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  return (
    <ConfirmModal
      isOpen={pending !== null}
      title={s.leave.title}
      text={s.leave.text}
      confirmLabel={s.leave.leave}
      cancelLabel={s.leave.stay}
      destructive
      onConfirm={leave}
      onCancel={() => setPending(null)}
    />
  );
}
