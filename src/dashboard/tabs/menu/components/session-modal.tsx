import {
  Button,
  Dialog,
  Heading,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { ROUTES } from "@/shared/router";
import { useDraft } from "../context";
import { strings } from "../strings";
import { ui } from "../ui";

const styles = {
  dialog: "flex flex-col gap-5 outline-none",
  text: "text-body text-slate-600",
  actions: "flex justify-end",
} as const;

export function SessionModal() {
  const s = useStrings(strings);
  const { sessionExpired } = useDraft();

  return (
    <ModalOverlay
      isOpen={sessionExpired}
      isDismissable={false}
      isKeyboardDismissDisabled
      className={ui.overlay}
    >
      <Modal className={ui.modal}>
        <Dialog role="alertdialog" className={styles.dialog}>
          <Heading slot="title" className={ui.heading}>
            {s.session.title}
          </Heading>
          <p className={styles.text}>{s.session.text}</p>
          <div className={styles.actions}>
            <Button
              className={ui.primary}
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
