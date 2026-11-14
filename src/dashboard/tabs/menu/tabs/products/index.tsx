import { useState, useSyncExternalStore } from "react";
import { Button, Dialog, Heading, Modal, ModalOverlay } from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { Icon } from "@/shared/icons";
import { useLoadedDraft } from "../../context";
import { allProducts } from "../../lib/selectors";
import { strings } from "../../strings";
import { ui } from "../../ui";
import { ProductEditor } from "./product-editor";
import { ProductList } from "./product-list";

const DESKTOP_QUERY = "(min-width: 1024px)";

const styles = {
  root: "flex flex-col gap-6 lg:grid lg:grid-cols-[2fr_3fr] lg:items-start",
  list: "min-w-0",
  editor: `${ui.card} hidden lg:block`,
  prompt: "text-small text-slate-500",
  overlay: `${ui.overlay} items-end p-0 sm:items-end`,
  sheet:
    "flex max-h-[92dvh] w-full flex-col rounded-t-2xl bg-white shadow-xl outline-none",
  sheetHead:
    "flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-2",
  sheetBody: "overflow-y-auto p-4",
} as const;

function subscribe(callback: () => void) {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function useIsDesktop() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => true
  );
}

export function ProductsTab() {
  const s = useStrings(strings);
  const { draft } = useLoadedDraft();
  const isDesktop = useIsDesktop();
  const [search, setSearch] = useState("");
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const selected = allProducts(draft).find((item) => item.uid === selectedUid);

  const select = (uid: string) => {
    setSelectedUid(uid);
    setSheetOpen(true);
  };

  const clear = () => {
    setSelectedUid(null);
    setSheetOpen(false);
  };

  return (
    <div className={styles.root}>
      <div className={styles.list}>
        <ProductList
          search={search}
          onSearch={setSearch}
          selectedUid={selectedUid}
          onSelect={select}
        />
      </div>

      {isDesktop ? (
        <section className={styles.editor} aria-label={s.products.editorTitle}>
          {selected ? (
            <ProductEditor key={selected.uid} product={selected} onDeleted={clear} />
          ) : (
            <p className={styles.prompt}>{s.products.selectPrompt}</p>
          )}
        </section>
      ) : (
        <ModalOverlay
          className={styles.overlay}
          isOpen={sheetOpen && selected !== undefined}
          onOpenChange={(open) => {
            if (!open) setSheetOpen(false);
          }}
          isDismissable
        >
          <Modal className={styles.sheet}>
            <Dialog className="flex min-h-0 flex-col outline-none">
              <div className={styles.sheetHead}>
                <Heading slot="title" className={ui.heading}>
                  {s.products.editorTitle}
                </Heading>
                <Button
                  className={ui.iconButton}
                  aria-label={s.products.closeEditor}
                  onPress={() => setSheetOpen(false)}
                >
                  <Icon name="close" className="size-5" />
                </Button>
              </div>
              <div className={styles.sheetBody}>
                {selected ? (
                  <ProductEditor
                    key={selected.uid}
                    product={selected}
                    onDeleted={clear}
                  />
                ) : null}
              </div>
            </Dialog>
          </Modal>
        </ModalOverlay>
      )}
    </div>
  );
}
