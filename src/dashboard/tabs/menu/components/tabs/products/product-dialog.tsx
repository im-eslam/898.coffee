import { useState } from "react";
import {
  Button,
  Dialog,
  Heading,
  Label,
  Modal,
  ModalOverlay,
  Radio,
  RadioGroup,
  Switch,
} from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { Icon } from "@/shared/icons";
import { useIsDesktop } from "../../../hooks/components/use-is-desktop";
import { useLoadedMenu } from "../../../hooks/use-menu-context";
import { useProductImageUpload } from "../../../hooks/use-menu-product-image";
import {
  allProducts,
  emptyProduct,
  imageOptions,
  localizedLabel,
  productPath,
  switchPricingType,
  withSizeIds,
} from "../../../util/draft";
import {
  MIN_SIZES,
  type DraftPricing,
  type DraftProduct,
  type MenuDraft,
} from "../../../types/draft";
import { ConfirmModal } from "../../ui/confirm-modal";
import { ProductImageField } from "../../ui/product-image-field";
import { RefPicker, type PickOption } from "../../ui/ref-picker";
import { SelectField } from "../../ui/select-field";
import { TextInput } from "../../ui/text-input";
import { strings, fill } from "../../../strings";
import { PricingEditor } from "./pricing-editor";

const focusRing =
  "outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-brand";

const styles = {
  overlayDesktop:
    "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4",
  overlayMobile:
    "fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50",
  panelDesktop:
    "flex max-h-[90dvh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-xl outline-none",
  panelMobile:
    "flex max-h-[92dvh] w-full flex-col rounded-t-2xl bg-white shadow-xl outline-none",
  dialog: "flex min-h-0 flex-1 flex-col outline-none",
  header:
    "flex items-start justify-between gap-3 border-b border-slate-200 px-6 py-4 sm:px-8",
  headerText: "flex min-w-0 flex-col gap-0.5",
  title: "truncate text-heading font-semibold text-slate-900",
  subtitle: "text-small text-slate-500",
  iconButton: `inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-slate-600 transition-colors data-[hovered]:bg-slate-100 ${focusRing}`,
  body: "flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto px-6 py-6 sm:px-8",
  section: "flex flex-col gap-4",
  sectionTitle: "text-body font-semibold text-slate-900",
  pair: "grid gap-4 sm:grid-cols-2",
  switch: `group inline-flex min-h-11 items-center gap-3 text-body font-medium text-slate-900 ${focusRing}`,
  track:
    "relative h-6 w-11 shrink-0 rounded-full bg-slate-300 transition-colors group-data-[selected]:bg-brand",
  thumb:
    "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform group-data-[selected]:translate-x-5 rtl:group-data-[selected]:-translate-x-5",
  radioGroup: "flex flex-col gap-3",
  label: "text-small font-medium text-slate-700",
  radios: "flex flex-wrap gap-3",
  radio: `group flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-4 text-body text-slate-800 data-[selected]:border-brand data-[selected]:bg-brand/5 ${focusRing}`,
  dot: "size-4 rounded-full border border-slate-400 group-data-[selected]:border-4 group-data-[selected]:border-brand",
  error: "text-small font-medium text-error",
  footer:
    "flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8",
  actions: "flex flex-col-reverse gap-3 sm:flex-row",
  cancel: `inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-small font-semibold text-slate-700 transition-colors data-[hovered]:bg-slate-50 ${focusRing}`,
  save: `inline-flex h-11 items-center justify-center rounded-lg bg-brand px-5 text-small font-semibold text-white transition-colors data-[hovered]:bg-navy ${focusRing}`,
  danger: `inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-error/40 bg-white px-4 text-small font-semibold text-error transition-colors data-[hovered]:bg-error/5 ${focusRing}`,
} as const;

export type ProductDialogTarget =
  { mode: "add"; categoryUid: string } | { mode: "edit"; uid: string };

interface ProductDialogProps {
  target: ProductDialogTarget | null;
  onClose: () => void;
  onSave: (product: DraftProduct, target: ProductDialogTarget) => void;
  onDelete: (uid: string) => void;
}

interface Located {
  product: DraftProduct;
  categoryUid: string;
  categoryName: string;
}

function locate(
  draft: MenuDraft,
  uid: string,
  fallback: string
): Located | null {
  for (const category of draft.categories) {
    const product = category.products.find((item) => item.uid === uid);
    if (product) {
      return {
        product,
        categoryUid: category.uid,
        categoryName: localizedLabel(category.name, fallback),
      };
    }
  }
  return null;
}

/** Edit and add share one dialog. It is a modal on desktop and a bottom sheet on phones. */
export function ProductDialog({
  target,
  onClose,
  onSave,
  onDelete,
}: ProductDialogProps) {
  const s = useStrings(strings);
  const { draft } = useLoadedMenu();
  const isDesktop = useIsDesktop();

  const found =
    target?.mode === "edit"
      ? locate(draft, target.uid, s.products.uncategorized)
      : null;
  const addCategory =
    target?.mode === "add"
      ? draft.categories.find((category) => category.uid === target.categoryUid)
      : undefined;
  const ready =
    target !== null &&
    (target.mode === "add" ? addCategory !== undefined : found !== null);

  return (
    <ModalOverlay
      isOpen={ready}
      isDismissable
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      className={isDesktop ? styles.overlayDesktop : styles.overlayMobile}
    >
      <Modal className={isDesktop ? styles.panelDesktop : styles.panelMobile}>
        <Dialog className={styles.dialog}>
          {ready && target ? (
            <ProductDialogBody
              key={
                target.mode === "add"
                  ? `add-${target.categoryUid}`
                  : `edit-${target.uid}`
              }
              mode={target.mode}
              categoryName={
                target.mode === "add"
                  ? localizedLabel(
                      addCategory?.name ?? { en: "", ar: "" },
                      s.products.uncategorized
                    )
                  : (found?.categoryName ?? "")
              }
              initial={target.mode === "edit" ? (found?.product ?? null) : null}
              path={
                target.mode === "edit" ? productPath(draft, target.uid) : ""
              }
              onSave={(product) => onSave(product, target)}
              onDelete={() => {
                if (target.mode === "edit") onDelete(target.uid);
              }}
              onCancel={onClose}
            />
          ) : null}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}

interface Problems {
  nameEn: boolean;
  nameAr: boolean;
  descEn: boolean;
  descAr: boolean;
  pricing: boolean;
}

function problemsOf(product: DraftProduct): Problems {
  const { pricing } = product;
  const pricingBad =
    pricing.type === "single"
      ? !(pricing.options[0] && pricing.options[0].price > 0)
      : pricing.options.length < MIN_SIZES ||
        pricing.options.some(
          (option) =>
            !(option.price > 0) ||
            option.name === null ||
            option.name.en.trim() === "" ||
            option.name.ar.trim() === ""
        );
  return {
    nameEn: product.name.en.trim() === "",
    nameAr: product.name.ar.trim() === "",
    descEn: product.description.en.trim() === "",
    descAr: product.description.ar.trim() === "",
    pricing: pricingBad,
  };
}

function hasProblem(problems: Problems): boolean {
  return Object.values(problems).some(Boolean);
}

/** What else references a product, so the delete confirmation can say so. */
function removalImpact(draft: MenuDraft, product: DraftProduct) {
  const id = product.id;
  if (id === "") return { pairings: 0, signature: false, related: 0 };
  return {
    pairings: draft.pairings.filter((pairing) => pairing.items.includes(id))
      .length,
    signature: draft.signatures.includes(id),
    related: allProducts(draft).filter(
      (item) => item.uid !== product.uid && item.oftenOrderedWith.includes(id)
    ).length,
  };
}

interface ProductDialogBodyProps {
  mode: "add" | "edit";
  categoryName: string;
  initial: DraftProduct | null;
  path: string;
  onSave: (product: DraftProduct) => void;
  onDelete: () => void;
  onCancel: () => void;
}

function ProductDialogBody({
  mode,
  categoryName,
  initial,
  path,
  onSave,
  onDelete,
  onCancel,
}: ProductDialogBodyProps) {
  const s = useStrings(strings);
  const { draft } = useLoadedMenu();
  // Edits stay local until Save. Cancel discards them.
  const [product, setProduct] = useState<DraftProduct>(
    () => initial ?? emptyProduct()
  );
  const [attempted, setAttempted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const edit = (change: (current: DraftProduct) => DraftProduct) =>
    setProduct(change);

  const upload = useProductImageUpload((image) =>
    edit((current) => ({ ...current, image }))
  );

  const problems = problemsOf(product);
  const requiredError = (flag: boolean) =>
    attempted && flag ? [s.common.required] : [];

  const addOnOptions: PickOption[] = draft.addOns
    .filter((addOn) => addOn.id !== "")
    .map((addOn) => ({
      id: addOn.id,
      label: localizedLabel(addOn.name, s.common.unknownReference),
      search: `${addOn.name.en} ${addOn.name.ar}`,
    }));

  const productOptions: PickOption[] = allProducts(draft)
    .filter((item) => item.id !== "" && item.uid !== product.uid)
    .map((item) => ({
      id: item.id,
      label: localizedLabel(item.name, s.products.unnamed),
      search: `${item.name.en} ${item.name.ar}`,
    }));

  const title =
    mode === "add"
      ? s.products.addTitle
      : localizedLabel(product.name, s.products.editorTitle);

  const impact = removalImpact(draft, product);
  const impactParts: string[] = [];
  if (impact.pairings === 1) impactParts.push(s.products.impactPairingOne);
  if (impact.pairings > 1) {
    impactParts.push(
      fill(s.products.impactPairingMany, { count: impact.pairings })
    );
  }
  if (impact.signature) impactParts.push(s.products.impactSignature);
  if (impact.related === 1) impactParts.push(s.products.impactRelatedOne);
  if (impact.related > 1) {
    impactParts.push(
      fill(s.products.impactRelatedMany, { count: impact.related })
    );
  }
  const removeText =
    impactParts.length === 0
      ? s.products.removeText
      : `${s.products.removeText} ${fill(s.products.removeImpact, {
          items: impactParts.join(s.products.listSeparator),
        })}`;

  const save = () => {
    setAttempted(true);
    if (hasProblem(problems)) return;
    onSave({
      ...product,
      name: { en: product.name.en.trim(), ar: product.name.ar.trim() },
      description: {
        en: product.description.en.trim(),
        ar: product.description.ar.trim(),
      },
      pricing: withSizeIds(product.pricing),
    });
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <Heading slot="title" className={styles.title}>
            {title}
          </Heading>
          {mode === "add" ? (
            <p className={styles.subtitle}>
              {fill(s.products.addInCategory, { category: categoryName })}
            </p>
          ) : null}
        </div>
        <Button
          className={styles.iconButton}
          aria-label={s.products.closeEditor}
          onPress={onCancel}
        >
          <Icon name="close" className="size-5" />
        </Button>
      </header>

      <div className={styles.body}>
        <section
          className={styles.section}
          aria-labelledby="product-section-basics"
        >
          <h3 id="product-section-basics" className={styles.sectionTitle}>
            {s.products.sectionBasics}
          </h3>
          <div className={styles.pair}>
            <TextInput
              required
              label={s.editor.nameEn}
              value={product.name.en}
              onChange={(en) =>
                edit((c) => ({ ...c, name: { ...c.name, en } }))
              }
              errors={requiredError(problems.nameEn)}
            />
            <TextInput
              required
              rtl
              label={s.editor.nameAr}
              value={product.name.ar}
              onChange={(ar) =>
                edit((c) => ({ ...c, name: { ...c.name, ar } }))
              }
              errors={requiredError(problems.nameAr)}
            />
          </div>
          <div className={styles.pair}>
            <Switch
              className={styles.switch}
              isSelected={product.availability === "in_stock"}
              onChange={(selected) =>
                edit((c) => ({
                  ...c,
                  availability: selected ? "in_stock" : "out_of_stock",
                }))
              }
            >
              <span className={styles.track} aria-hidden="true">
                <span className={styles.thumb} />
              </span>
              {s.editor.availability}
            </Switch>
            <SelectField
              label={s.editor.badge}
              value={product.badge ?? "none"}
              options={[
                { id: "none", label: s.editor.badgeNone },
                { id: "new", label: s.editor.badgeNew },
                { id: "top", label: s.editor.badgeTop },
              ]}
              onChange={(id) =>
                edit((c) => ({
                  ...c,
                  badge: id === "new" || id === "top" ? id : null,
                }))
              }
            />
          </div>
        </section>

        <section
          className={styles.section}
          aria-labelledby="product-section-details"
        >
          <h3 id="product-section-details" className={styles.sectionTitle}>
            {s.products.sectionDetails}
          </h3>
          <div className={styles.pair}>
            <TextInput
              required
              multiline
              label={s.editor.descriptionEn}
              value={product.description.en}
              onChange={(en) =>
                edit((c) => ({ ...c, description: { ...c.description, en } }))
              }
              errors={requiredError(problems.descEn)}
            />
            <TextInput
              required
              multiline
              rtl
              label={s.editor.descriptionAr}
              value={product.description.ar}
              onChange={(ar) =>
                edit((c) => ({ ...c, description: { ...c.description, ar } }))
              }
              errors={requiredError(problems.descAr)}
            />
          </div>
        </section>

        <section
          className={styles.section}
          aria-labelledby="product-section-image"
        >
          <h3 id="product-section-image" className={styles.sectionTitle}>
            {s.products.sectionImage}
          </h3>
          <ProductImageField
            label={s.editor.image}
            value={product.image}
            options={imageOptions(draft)}
            isUploading={upload.isUploading}
            errors={upload.uploadError ? [s.popup.uploadFailed] : []}
            labels={{
              chooseImage: s.popup.chooseImage,
              uploading: s.popup.uploading,
              uploadHint: s.popup.uploadHint,
              remove: s.products.removeImage,
              pickExisting: s.products.pickExisting,
              searchImages: s.products.searchImages,
              noImages: s.products.noImages,
            }}
            onUpload={(file) => void upload.upload(file)}
            onPick={(image) => edit((c) => ({ ...c, image }))}
            onRemove={() => edit((c) => ({ ...c, image: null }))}
          />
        </section>

        <section
          className={styles.section}
          aria-labelledby="product-section-pricing"
        >
          <h3 id="product-section-pricing" className={styles.sectionTitle}>
            {s.products.sectionPricing}
          </h3>
          <RadioGroup
            className={styles.radioGroup}
            value={product.pricing.type}
            onChange={(value) =>
              edit((c) => ({
                ...c,
                pricing: switchPricingType(
                  c.pricing,
                  value as DraftPricing["type"]
                ),
              }))
            }
          >
            <Label className={styles.label}>{s.editor.pricingType}</Label>
            <div className={styles.radios}>
              <Radio value="single" className={styles.radio}>
                <span className={styles.dot} aria-hidden="true" />
                {s.editor.single}
              </Radio>
              <Radio value="sizes" className={styles.radio}>
                <span className={styles.dot} aria-hidden="true" />
                {s.editor.sizes}
              </Radio>
            </div>
          </RadioGroup>
          <PricingEditor
            pricing={product.pricing}
            basePath={path ? `${path}.pricing` : "pricing"}
            onChange={(pricing) => edit((c) => ({ ...c, pricing }))}
          />
          {attempted && problems.pricing ? (
            <p className={styles.error} role="alert">
              {s.products.pricingInvalid}
            </p>
          ) : null}
        </section>

        <section
          className={styles.section}
          aria-labelledby="product-section-references"
        >
          <h3 id="product-section-references" className={styles.sectionTitle}>
            {s.products.sectionReferences}
          </h3>
          <RefPicker
            label={s.editor.addOns}
            options={addOnOptions}
            value={product.addOns}
            onChange={(addOns) => edit((c) => ({ ...c, addOns }))}
          />
          <RefPicker
            label={s.editor.baristaWay}
            options={addOnOptions}
            value={product.baristaWay}
            onChange={(baristaWay) => edit((c) => ({ ...c, baristaWay }))}
          />
          <RefPicker
            label={s.editor.oftenOrderedWith}
            options={productOptions}
            value={product.oftenOrderedWith}
            hint={product.id === "" ? s.editor.saveFirst : undefined}
            onChange={(oftenOrderedWith) =>
              edit((c) => ({ ...c, oftenOrderedWith }))
            }
          />
        </section>
      </div>

      <footer className={styles.footer}>
        {mode === "edit" ? (
          <Button
            className={styles.danger}
            onPress={() => setConfirmOpen(true)}
          >
            <Icon name="trash" className="size-4" />
            {s.editor.delete}
          </Button>
        ) : (
          <span />
        )}
        <div className={styles.actions}>
          <Button className={styles.cancel} onPress={onCancel}>
            {s.common.cancel}
          </Button>
          <Button className={styles.save} onPress={save}>
            {mode === "add" ? s.products.addConfirm : s.products.saveProduct}
          </Button>
        </div>
      </footer>

      {mode === "edit" ? (
        <ConfirmModal
          isOpen={confirmOpen}
          title={fill(s.products.removeTitle, {
            name: localizedLabel(product.name, s.products.unnamed),
          })}
          text={removeText}
          confirmLabel={s.products.removeConfirm}
          cancelLabel={s.common.cancel}
          destructive
          onConfirm={() => {
            setConfirmOpen(false);
            onDelete();
          }}
          onCancel={() => setConfirmOpen(false)}
        />
      ) : null}
    </>
  );
}
