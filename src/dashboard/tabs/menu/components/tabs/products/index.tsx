import { useState } from "react";
import type { DraftProduct } from "../../../types/draft";
import { useLoadedMenu } from "../../../hooks/use-menu-context";
import { ProductDialog, type ProductDialogTarget } from "./product-dialog";
import { ProductList } from "./product-list";

const styles = {
  root: "flex flex-col gap-6",
} as const;

export function ProductsTab() {
  const menu = useLoadedMenu();
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState<ProductDialogTarget | null>(null);

  const openEdit = (uid: string) => setDialog({ mode: "edit", uid });
  const openAdd = (categoryUid: string) =>
    setDialog({ mode: "add", categoryUid });
  const close = () => setDialog(null);

  const saveProduct = (product: DraftProduct, target: ProductDialogTarget) => {
    if (target.mode === "add") {
      menu.products.create(target.categoryUid, product);
      // Clear the search so the new product is visible in the list.
      setSearch("");
    } else {
      menu.products.replace(target.uid, product);
    }
    setDialog(null);
  };

  const deleteProduct = (uid: string) => {
    menu.products.remove(uid);
    setDialog(null);
  };

  return (
    <div className={styles.root}>
      <ProductList
        search={search}
        onSearch={setSearch}
        selectedUid={dialog?.mode === "edit" ? dialog.uid : null}
        onSelect={openEdit}
        onAdd={openAdd}
      />
      <ProductDialog
        target={dialog}
        onClose={close}
        onSave={saveProduct}
        onDelete={deleteProduct}
      />
    </div>
  );
}
