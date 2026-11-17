import { useState } from "react";
import { Button, Dialog, Heading, Modal, ModalOverlay } from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { Icon } from "@/shared/icons";
import { useIsDesktop } from "../../../hooks/components/use-is-desktop";
import { useLoadedMenu } from "../../../hooks/use-menu-context";
import { allProducts } from "../../../util/draft";
import { ProductEditor } from "./product-editor";
import { ProductList } from "./product-list";
import { strings } from "../../../strings";

const focusRing =
  "outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-brand";

const styles = {
  root: "flex flex-col gap-6 lg:grid lg:grid-cols-[2fr_3fr] lg:items-start",
  list: "min-w-0",
  heading: "text-heading font-semibold text-slate-900",
  iconButton: `inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-slate-600 transition-colors data-[hovered]:bg-slate-100 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 ${focusRing}`,
  editor: "hidden rounded-2xl border border-slate-200 bg-white p-6 lg:block",
  prompt: "text-small text-slate-500",
  overlay:
    "fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 sm:items-end",
  sheet:
    "flex max-h-[92dvh] w-full flex-col rounded-t-2xl bg-white shadow-xl outline-none",
  sheetHead:
    "flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-2",
  sheetBody: "overflow-y-auto p-4",
} as const;

export function ProductsTab() {
  const s = useStrings(strings);
  const { draft } = useLoadedMenu();
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
                <Heading slot="title" className={styles.heading}>
                  {s.products.editorTitle}
                </Heading>
                <Button
                  className={styles.iconButton}
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
