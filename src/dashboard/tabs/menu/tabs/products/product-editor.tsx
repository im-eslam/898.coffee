import { Button, Form, Radio, RadioGroup, Switch, Label } from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { Icon } from "@/shared/icons";
import { ImagePicker } from "../../components/image-picker";
import { RefPicker, type RefOption } from "../../components/ref-picker";
import { SelectField } from "../../components/select-field";
import { TextInput } from "../../components/text-input";
import { useLoadedDraft } from "../../context";
import { emptyOption } from "../../lib/factories";
import { localizedLabel } from "../../lib/labels";
import { allProducts, imageOptions } from "../../lib/selectors";
import { strings } from "../../strings";
import { ui } from "../../ui";
import type { DraftPricing, DraftProduct } from "../../types";
import { PricingEditor } from "./pricing-editor";

const styles = {
  form: "flex flex-col gap-6",
  pair: "grid gap-4 sm:grid-cols-2",
  switch: `group inline-flex min-h-11 items-center gap-3 text-body font-medium text-slate-900 ${ui.focusRing}`,
  track:
    "relative h-6 w-11 shrink-0 rounded-full bg-slate-300 transition-colors group-data-[selected]:bg-brand",
  thumb:
    "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform group-data-[selected]:translate-x-5 rtl:group-data-[selected]:-translate-x-5",
  group: "flex flex-col gap-3",
  radios: "flex flex-wrap gap-3",
  radio: `group flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-4 text-body text-slate-800 data-[selected]:border-brand data-[selected]:bg-brand/5 ${ui.focusRing}`,
  dot: "size-4 rounded-full border border-slate-400 group-data-[selected]:border-4 group-data-[selected]:border-brand",
  hint: "text-small text-slate-500",
  footer: "flex justify-end border-t border-slate-200 pt-4",
} as const;

interface ProductEditorProps {
  product: DraftProduct;
  onDeleted: () => void;
}

export function ProductEditor({ product, onDeleted }: ProductEditorProps) {
  const s = useStrings(strings);
  const { draft, update, issuesAt, removeProduct } = useLoadedDraft();

  let basePath = "";
  draft.categories.forEach((category, categoryIndex) => {
    const productIndex = category.products.findIndex(
      (item) => item.uid === product.uid
    );
    if (productIndex !== -1) {
      basePath = `categories[${categoryIndex}].products[${productIndex}]`;
    }
  });

  const messages = (path: string) =>
    issuesAt(path).map((issue) => issue.message);

  const patch = (change: (current: DraftProduct) => DraftProduct, field: string) =>
    update(
      (current) => ({
        ...current,
        categories: current.categories.map((category) => ({
          ...category,
          products: category.products.map((item) =>
            item.uid === product.uid ? change(item) : item
          ),
        })),
      }),
      `${basePath}.${field}`
    );

  const addOnOptions: RefOption[] = draft.addOns
    .filter((addOn) => addOn.id !== "")
    .map((addOn) => ({
      id: addOn.id,
      label: localizedLabel(addOn.name, s.common.unknownReference),
    }));

  const productOptions: RefOption[] = allProducts(draft)
    .filter((item) => item.id !== "" && item.id !== product.id)
    .map((item) => ({
      id: item.id,
      label: localizedLabel(item.name, s.products.unnamed),
    }));

  const setPricing = (pricing: DraftPricing) =>
    patch((current) => ({ ...current, pricing }), "pricing");

  const changePricingType = (type: DraftPricing["type"]) => {
    if (type === product.pricing.type) return;
    if (type === "single") {
      const first = product.pricing.options[0] ?? emptyOption(false);
      setPricing({ type, options: [{ ...first, name: null }] });
    } else {
      const first = product.pricing.options[0] ?? emptyOption(true);
      setPricing({
        type,
        options: [
          { ...first, name: first.name ?? { en: "", ar: "" } },
          emptyOption(true),
        ],
      });
    }
  };

  return (
    <Form
      className={styles.form}
      aria-label={s.products.editorTitle}
      validationBehavior="aria"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className={styles.pair}>
        <TextInput
          required
          label={s.editor.nameEn}
          value={product.name.en}
          errors={messages(`${basePath}.name.en`)}
          onCommit={(en) =>
            patch((item) => ({ ...item, name: { ...item.name, en } }), "name")
          }
        />
        <TextInput
          required
          rtl
          label={s.editor.nameAr}
          value={product.name.ar}
          errors={messages(`${basePath}.name.ar`)}
          onCommit={(ar) =>
            patch((item) => ({ ...item, name: { ...item.name, ar } }), "name")
          }
        />
      </div>

      <div className={styles.pair}>
        <TextInput
          required
          multiline
          label={s.editor.descriptionEn}
          value={product.description.en}
          errors={messages(`${basePath}.description.en`)}
          onCommit={(en) =>
            patch(
              (item) => ({ ...item, description: { ...item.description, en } }),
              "description"
            )
          }
        />
        <TextInput
          required
          multiline
          rtl
          label={s.editor.descriptionAr}
          value={product.description.ar}
          errors={messages(`${basePath}.description.ar`)}
          onCommit={(ar) =>
            patch(
              (item) => ({ ...item, description: { ...item.description, ar } }),
              "description"
            )
          }
        />
      </div>

      <div className={styles.pair}>
        <Switch
          className={styles.switch}
          isSelected={product.availability === "in_stock"}
          onChange={(selected) =>
            patch(
              (item) => ({
                ...item,
                availability: selected ? "in_stock" : "out_of_stock",
              }),
              "availability"
            )
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
          errors={messages(`${basePath}.badge`)}
          onChange={(id) =>
            patch(
              (item) => ({
                ...item,
                badge: id === "new" || id === "top" ? id : null,
              }),
              "badge"
            )
          }
        />
      </div>

      <ImagePicker
        label={s.editor.image}
        placeholder={s.editor.imagePlaceholder}
        hint={s.editor.imageHint}
        value={product.image}
        options={imageOptions(draft)}
        errors={messages(`${basePath}.image`)}
        onCommit={(image) => patch((item) => ({ ...item, image }), "image")}
      />

      <RefPicker
        label={s.editor.addOns}
        options={addOnOptions}
        value={product.addOns}
        onChange={(addOns) => patch((item) => ({ ...item, addOns }), "addOns")}
      />

      <RefPicker
        label={s.editor.baristaWay}
        options={addOnOptions}
        value={product.baristaWay ?? []}
        onChange={(ids) =>
          patch(
            (item) => ({ ...item, baristaWay: ids.length > 0 ? ids : null }),
            "baristaWay"
          )
        }
      />

      <RefPicker
        label={s.editor.oftenOrderedWith}
        options={productOptions}
        value={product.oftenOrderedWith}
        hint={product.id === "" ? s.editor.saveFirst : undefined}
        onChange={(oftenOrderedWith) =>
          patch((item) => ({ ...item, oftenOrderedWith }), "oftenOrderedWith")
        }
      />

      <div className={styles.group}>
        <RadioGroup
          className={styles.group}
          value={product.pricing.type}
          onChange={(value) => changePricingType(value as DraftPricing["type"])}
        >
          <Label className={ui.label}>{s.editor.pricingType}</Label>
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
          basePath={`${basePath}.pricing`}
          onChange={setPricing}
        />
      </div>

      <div className={styles.footer}>
        <Button
          className={ui.danger}
          onPress={() => {
            removeProduct(product.uid);
            onDeleted();
          }}
        >
          <Icon name="trash" className="size-4" />
          {s.editor.delete}
        </Button>
      </div>
    </Form>
  );
}
