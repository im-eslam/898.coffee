// import { useState } from "react";
// import { Button } from "react-aria-components";
// import { useLocale, useStrings } from "@/shared/i18n";
// import { getProductPrice, getSelectedOption, strings, sumAddOns } from "../../strings";
// import type { Product, ProductRef } from "../../types/menu-models";
// import { ProductOptions } from "../product-options";
// import {
//   Badge,
//   Chevron,
//   cx,
//   focusRing,
//   Img,
//   PriceBar,
//   PriceWithDiscount,
//   PrimaryButton,
// } from "../ui";
// import { BottomSheet } from "./bottom-sheet";

// interface Props {
//   product: Product;
//   isOpen: boolean;
//   onClose: () => void;
//   onOpenProduct: (productId: string) => void;
// }

// const styles = {
//   content: "flex flex-col gap-6",
//   hero: "relative mx-4",
//   heroImage: "aspect-square w-full rounded-lg",
//   heroBadge: "absolute end-2 top-2",
//   grayscale: "grayscale",
//   intro: "flex flex-col items-start gap-2 px-4",
//   title: "text-title font-bold text-balance",
//   description: "text-small font-medium text-pretty text-navy/65",
//   related: "flex flex-col gap-2",
//   relatedTitle: "px-4 text-body font-bold",
//   relatedRail: "no-scrollbar flex gap-2 overflow-x-auto px-4 pb-1",
// } as const;

// export function ProductSheet({
//   product,
//   isOpen,
//   onClose,
//   onOpenProduct,
// }: Props) {
//   const t = useStrings(strings);
//   const locale = useLocale();
//   const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
//     product.pricing.options[0]?.id ?? null
//   );
//   const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);

//   const inStock = product.availability === "in_stock";
//   const name = product.name[locale];
//   const description = product.description[locale];
//   const total =
//     (getSelectedOption(product.pricing, selectedOptionId)?.final ?? 0) +
//     sumAddOns(product, selectedAddOnIds);

//   // View-only: the footer just shows the price.
//   const footer = inStock ? (
//     <PriceBar total={total} />
//   ) : (
//     <PrimaryButton isDisabled>{t.outOfStock}</PrimaryButton>
//   );

//   return (
//     <BottomSheet
//       isOpen={isOpen}
//       label={name}
//       onClose={onClose}
//       footer={footer}
//     >
//       <div className={styles.content}>
//         <div className={styles.hero}>
//           <Img
//             image={product.image}
//             alt={name}
//             className={cx(styles.heroImage, !inStock && styles.grayscale)}
//           />
//           {!inStock && (
//             <span className={styles.heroBadge}>
//               <Badge kind="outOfStock" />
//             </span>
//           )}
//         </div>

//         <div className={styles.intro}>
//           {inStock && product.badge && <Badge kind={product.badge} />}
//           <h2 data-sheet-title className={styles.title}>
//             {name}
//           </h2>
//           {description && <p className={styles.description}>{description}</p>}
//         </div>

//         <ProductOptions
//           product={product}
//           selectedOptionId={selectedOptionId}
//           selectedAddOnIds={selectedAddOnIds}
//           onSelectOption={setSelectedOptionId}
//           onSelectAddOns={setSelectedAddOnIds}
//           isDisabled={!inStock}
//         />

//         {product.oftenOrderedWith.length > 0 && (
//           <section aria-label={t.oftenOrdered} className={styles.related}>
//             <h3 className={styles.relatedTitle}>{t.oftenOrdered}</h3>
//             <div className={styles.relatedRail}>
//               {product.oftenOrderedWith.map((other) => (
//                 <OftenOrderedCard
//                   key={other.id}
//                   product={other}
//                   onOpen={() => onOpenProduct(other.id)}
//                 />
//               ))}
//             </div>
//           </section>
//         )}
//       </div>
//     </BottomSheet>
//   );
// }

// const cardStyles = {
//   root: cx(
//     "flex w-28 shrink-0 flex-col gap-1 rounded-md border border-arctic bg-white p-2 text-start",
//     focusRing
//   ),
//   imageFrame: "relative",
//   image: "h-16 w-full rounded-md",
//   grayscale: "grayscale",
//   outOfStockBadge: "absolute end-1 top-1",
//   name: "line-clamp-2 min-h-[2lh] text-caption font-medium text-balance",
//   nameUnavailable: "text-navy/60",
//   footer: "flex items-center justify-between gap-1",
//   unavailable: "opacity-60",
// } as const;

// // Tapping the card (or its arrow) opens that product's own sheet.
// function OftenOrderedCard({
//   product,
//   onOpen,
// }: {
//   product: ProductRef;
//   onOpen: () => void;
// }) {
//   const t = useStrings(strings);
//   const locale = useLocale();
//   const name = product.name[locale];
//   const inStock = product.availability === "in_stock";
//   const { current, regular } = getProductPrice(product.pricing);

//   return (
//     <Button
//       aria-label={t.a11yOpenProduct(name)}
//       onPress={onOpen}
//       className={cardStyles.root}
//     >
//       <span className={cardStyles.imageFrame}>
//         <Img
//           image={product.image}
//           className={cx(cardStyles.image, !inStock && cardStyles.grayscale)}
//         />
//         {!inStock && (
//           <span className={cardStyles.outOfStockBadge}>
//             <Badge kind="outOfStock" compact />
//           </span>
//         )}
//       </span>
//       <span
//         className={cx(cardStyles.name, !inStock && cardStyles.nameUnavailable)}
//       >
//         {name}
//       </span>
//       <span className={cardStyles.footer}>
//         <span className={inStock ? undefined : cardStyles.unavailable}>
//           <PriceWithDiscount value={current} regular={regular} size="caption" />
//         </span>
//         <Chevron small />
//       </span>
//     </Button>
//   );
// }
