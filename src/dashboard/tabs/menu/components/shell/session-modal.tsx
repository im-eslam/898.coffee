import { Button, Dialog, Heading, Modal, ModalOverlay } from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { ROUTES } from "@/shared/router";
import { useMenuContext } from "../../hooks/use-menu-context";
import { strings } from "../../strings";

const focusRing =
  "outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-brand";

const styles = {
  overlay:
    "fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 sm:items-center data-[entering]:animate-in data-[entering]:fade-in",
  modal:
    "w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl outline-none",
  dialog: "flex flex-col gap-5 outline-none",
  heading: "text-heading font-semibold text-slate-900",
  text: "text-body text-slate-600",
  actions: "flex justify-end",
  primary: `inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand px-5 text-small font-semibold text-white transition-colors data-[hovered]:bg-navy data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60 ${focusRing}`,
} as const;

export function SessionModal() {
  const s = useStrings(strings);
  const { status } = useMenuContext();
  const sessionExpired = status.sessionExpired;

  return (
    <ModalOverlay
      isOpen={sessionExpired}
      isDismissable={false}
      isKeyboardDismissDisabled
      className={styles.overlay}
    >
      <Modal className={styles.modal}>
        <Dialog role="alertdialog" className={styles.dialog}>
          <Heading slot="title" className={styles.heading}>
            {s.session.title}
          </Heading>
          <p className={styles.text}>{s.session.text}</p>
          <div className={styles.actions}>
            <Button
              className={styles.primary}
              onPress={() => window.location.assign(ROUTES.dashboardLogin)}
            >
              {s.session.signIn}
            </Button>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
