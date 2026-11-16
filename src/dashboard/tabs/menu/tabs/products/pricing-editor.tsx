import { Button } from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { Icon } from "@/shared/icons";
import { NumberInput } from "../../components/number-input";
import { TextInput } from "../../components/text-input";
import { useLoadedDraft } from "../../hooks/use-draft-context";
import { emptyOption } from "../../lib/factories";
import { fill, strings } from "../../strings";
import {
  MAX_SIZES,
  MIN_SIZES,
  type DraftOption,
  type DraftPricing,
} from "../../types/draft";

const focusRing =
  "outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-brand";

const styles = {
  root: "flex flex-col gap-4",
  single: "grid items-end gap-4 sm:grid-cols-3",
  list: "flex flex-col gap-3",
  row: "flex flex-col gap-3 rounded-xl border border-slate-200 p-3",
  rowHead: "flex items-center justify-between gap-2",
  rowTitle: "text-small font-semibold text-slate-700",
  rowFields: "grid gap-3 sm:grid-cols-2",
  final: "flex h-11 items-center text-body font-semibold text-slate-900",
  iconButton: `inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-slate-600 transition-colors data-[hovered]:bg-slate-100 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 ${focusRing}`,
  button: `inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-small font-semibold text-slate-700 transition-colors data-[hovered]:bg-slate-50 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 ${focusRing}`,
} as const;

interface PricingEditorProps {
  pricing: DraftPricing;
  basePath: string;
  onChange: (pricing: DraftPricing) => void;
}

function withPrice(option: DraftOption, price: number): DraftOption {
  return { ...option, price, final: price - option.discount };
}

function withDiscount(option: DraftOption, discount: number): DraftOption {
  return { ...option, discount, final: option.price - discount };
}

export function PricingEditor({ pricing, basePath, onChange }: PricingEditorProps) {
  const s = useStrings(strings);
  const { draft, issuesAt } = useLoadedDraft();

  const messages = (path: string) =>
    issuesAt(path).map((issue) => issue.message);

  const setOption = (index: number, option: DraftOption) =>
    onChange({
      ...pricing,
      options: pricing.options.map((item, position) =>
        position === index ? option : item
      ),
    });

  const finalText = (option: DraftOption) =>
    fill(s.pricing.final, {
      value: `${option.price - option.discount} ${draft.currency}`,
    });

  if (pricing.type === "single") {
    const option = pricing.options[0];
    if (!option) return null;
    const path = `${basePath}.options[0]`;
    return (
      <div className={styles.single}>
        <NumberInput
          label={s.pricing.price}
          value={option.price}
          errors={messages(`${path}.price`)}
          onCommit={(price) => setOption(0, withPrice(option, price))}
        />
        <NumberInput
          label={s.pricing.discount}
          value={option.discount}
          errors={messages(`${path}.discount`)}
          onCommit={(discount) => setOption(0, withDiscount(option, discount))}
        />
        <p className={styles.final}>{finalText(option)}</p>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <ul className={styles.list} aria-label={s.pricing.sizesLabel}>
        {pricing.options.map((option, index) => {
          const path = `${basePath}.options[${index}]`;
          const title = fill(s.pricing.sizeRow, { index: index + 1 });
          const name = option.name ?? { en: "", ar: "" };
          return (
            <li key={option.uid}>
              <section className={styles.row} aria-label={title}>
                <div className={styles.rowHead}>
                  <h4 className={styles.rowTitle}>{title}</h4>
                  <Button
                    className={styles.iconButton}
                    isDisabled={pricing.options.length <= MIN_SIZES}
                    aria-label={`${s.pricing.removeSize}: ${title}`}
                    onPress={() =>
                      onChange({
                        ...pricing,
                        options: pricing.options.filter(
                          (item) => item.uid !== option.uid
                        ),
                      })
                    }
                  >
                    <Icon name="trash" className="size-5" />
                  </Button>
                </div>
                <div className={styles.rowFields}>
                  <TextInput
                    required
                    label={s.pricing.sizeNameEn}
                    value={name.en}
                    errors={messages(`${path}.name`)}
                    onCommit={(en) =>
                      setOption(index, { ...option, name: { ...name, en } })
                    }
                  />
                  <TextInput
                    required
                    rtl
                    label={s.pricing.sizeNameAr}
                    value={name.ar}
                    onCommit={(ar) =>
                      setOption(index, { ...option, name: { ...name, ar } })
                    }
                  />
                </div>
                <div className={styles.single}>
                  <NumberInput
                    label={s.pricing.price}
                    value={option.price}
                    errors={messages(`${path}.price`)}
                    onCommit={(price) => setOption(index, withPrice(option, price))}
                  />
                  <NumberInput
                    label={s.pricing.discount}
                    value={option.discount}
                    errors={messages(`${path}.discount`)}
                    onCommit={(discount) =>
                      setOption(index, withDiscount(option, discount))
                    }
                  />
                  <p className={styles.final}>{finalText(option)}</p>
                </div>
              </section>
            </li>
          );
        })}
      </ul>
      <div>
        <Button
          className={styles.button}
          isDisabled={pricing.options.length >= MAX_SIZES}
          onPress={() =>
            onChange({
              ...pricing,
              options: [...pricing.options, emptyOption(true)],
            })
          }
        >
          <Icon name="plus" className="size-4" />
          {s.pricing.addSize}
        </Button>
      </div>
    </div>
  );
}
