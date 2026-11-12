import { useState } from "react";
import { Button } from "react-aria-components";
import type { Locale } from "@/shared/i18n";
import type { Product, ProductRef } from "../../types/menu";
import { resolveImageUrl } from "../../util/image";
import { getProductPrice, getProductTotal } from "../../util/pricing";
import { BaseOptions } from "./base-options";
import { Badge } from "../ui/badge";
import { Chevron } from "../ui/chevron";
import { Img } from "../ui/img";
import { MenuButton } from "../ui/menu-button";
import { Price } from "../ui/price";
import { SwapAnimation } from "../ui/swap-animation";
import { BottomSheet } from "./bottom-sheet";

interface ProductSheetStrings {
  itemDescription: string;
  outOfStock: string;
  oftenOrdered: string;
  openItem: (name: string) => string;
  size: string;
  baristaWay: string;
  baristaSub: string;
  addOns: string;
}

interface ProductSheetProps {
  product: Product;
  strings: ProductSheetStrings;
  locale: Locale;
  formatMoney: (value: number, plus?: boolean) => string;
  isOpen: boolean;
  onClose: () => void;
  onOpenProduct: (productId: string) => void;
}

const styles = {
  content: "flex flex-col gap-6",
  hero: "relative",
  heroImage: "aspect-square w-full rounded-lg",
  heroBadge: "absolute end-2 top-2",
  grayscale: "grayscale",
  intro: "flex flex-col items-start gap-2",
  description: "text-small font-medium text-pretty text-navy/65",
  related: "flex flex-col gap-2",
  relatedTitle: "text-body font-bold",
  relatedRail:
    "no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:-mx-6 md:px-6",
} as const;

export function ProductSheet({
  product,
  strings: s,
  locale,
  formatMoney,
  isOpen,
  onClose,
  onOpenProduct,
}: ProductSheetProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    product.pricing.options[0]?.id ?? null
  );
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);

  const inStock = product.availability === "in_stock";
  const name = product.name[locale];
  const description = product.description[locale];
  const total = getProductTotal(product, selectedOptionId, selectedAddOnIds);

  const footer = inStock ? (
    <Price variant="bar" value={total} formatMoney={formatMoney} />
  ) : (
    <MenuButton variant="primary" isDisabled>
      {s.outOfStock}
    </MenuButton>
  );

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      footer={footer}
      strings={{
        title: name,
        description: s.itemDescription,
      }}
    >
      <div className={styles.content}>
        <SwapAnimation value={product.id} block>
          <div className={styles.hero}>
            <Img
              src={resolveImageUrl(product.image, "full")}
              alt={name}
              className={`${styles.heroImage} ${inStock ? "" : styles.grayscale}`}
            />
            {!inStock && (
              <span className={styles.heroBadge}>
                <Badge kind="outOfStock" />
              </span>
            )}
          </div>
        </SwapAnimation>

        {(product.badge || description) && (
          <SwapAnimation value={product.id} block>
            <div className={styles.intro}>
              {inStock && product.badge && <Badge kind={product.badge} />}
              {description && (
                <p className={styles.description}>{description}</p>
              )}
            </div>
          </SwapAnimation>
        )}

        <BaseOptions
          product={product}
          strings={{
            size: s.size,
            baristaWay: s.baristaWay,
            baristaSub: s.baristaSub,
            addOns: s.addOns,
          }}
          locale={locale}
          formatMoney={formatMoney}
          selectedOptionId={selectedOptionId}
          selectedAddOnIds={selectedAddOnIds}
          onSelectOption={setSelectedOptionId}
          onSelectAddOns={setSelectedAddOnIds}
          isDisabled={!inStock}
        />

        {product.oftenOrderedWith.length > 0 && (
          <section aria-label={s.oftenOrdered} className={styles.related}>
            <h3 className={styles.relatedTitle}>{s.oftenOrdered}</h3>
            <div className={styles.relatedRail}>
              {product.oftenOrderedWith.map((other) => (
                <OftenOrderedCard
                  key={other.id}
                  product={other}
                  locale={locale}
                  formatMoney={formatMoney}
                  openLabel={s.openItem(other.name[locale])}
                  onOpen={() => onOpenProduct(other.id)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </BottomSheet>
  );
}

const cardStyles = {
  root: "relative flex w-28 shrink-0 flex-col gap-1 rounded-md border border-arctic bg-white p-2 text-start",
  frame: "relative",
  image: "h-16 w-full rounded-md",
  grayscale: "grayscale",
  outOfStockBadge: "absolute end-1 top-1",
  name: "line-clamp-2 min-h-[2lh] text-caption font-medium text-balance",
  nameUnavailable: "text-navy/60",
  footer: "flex items-center justify-between gap-1",
  unavailable: "opacity-60",
  action:
    "absolute inset-0 z-10 rounded-md outline-none [touch-action:pan-x_pan-y] data-focus-visible:outline-2 data-focus-visible:-outline-offset-2 data-focus-visible:outline-brand",
} as const;

function OftenOrderedCard({
  product,
  locale,
  formatMoney,
  openLabel,
  onOpen,
}: {
  product: ProductRef;
  locale: Locale;
  formatMoney: (value: number, plus?: boolean) => string;
  openLabel: string;
  onOpen: () => void;
}) {
  const name = product.name[locale];
  const inStock = product.availability === "in_stock";
  const { current, regular } = getProductPrice(product.pricing);

  return (
    <div className={cardStyles.root}>
      <div className={cardStyles.frame}>
        <Img
          src={resolveImageUrl(product.image, "thumb")}
          className={`${cardStyles.image} ${
            inStock ? "" : cardStyles.grayscale
          }`}
        />
        {!inStock && (
          <span className={cardStyles.outOfStockBadge}>
            <Badge kind="outOfStock" compact />
          </span>
        )}
      </div>

      <span
        className={`${cardStyles.name} ${
          inStock ? "" : cardStyles.nameUnavailable
        }`}
      >
        {name}
      </span>

      <span className={cardStyles.footer}>
        <span className={inStock ? undefined : cardStyles.unavailable}>
          <Price
            value={current}
            regular={regular}
            formatMoney={formatMoney}
            size="caption"
          />
        </span>
        <Chevron size="s" />
      </span>

      <Button
        type="button"
        aria-label={openLabel}
        onPress={onOpen}
        className={cardStyles.action}
      />
    </div>
  );
}
