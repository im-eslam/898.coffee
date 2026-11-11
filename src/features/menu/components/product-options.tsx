// import { useRef, type CSSProperties } from "react";
// import {
//   Checkbox,
//   CheckboxGroup,
//   Label,
//   Radio,
//   RadioGroup,
//   ToggleButton,
// } from "react-aria-components";
// import { useLocale, useStrings } from "@/shared/i18n";
// import { Icon } from "@/shared/icons";
// import { strings, useMoney } from "../strings";
// import type { Product } from "../types/menu-models";
// import { Badge, cx, focusRing, focusRingInset, Img, Price } from "./ui";

// interface Props {
//   product: Product;
//   selectedOptionId: string | null;
//   selectedAddOnIds: string[];
//   onSelectOption: (optionId: string) => void;
//   onSelectAddOns: (addOnIds: string[]) => void;
//   showProduct?: boolean;
//   isDisabled?: boolean;
// }

// const styles = {
//   root: "flex flex-col gap-4",

//   productHeader: "flex items-center gap-3 px-4",
//   productImage: "size-12 shrink-0 rounded-md",
//   productName: "min-w-0 flex-1 text-body font-semibold text-balance",
//   grayscale: "grayscale",

//   group: "relative flex flex-col gap-2 px-4",
//   groupLabel: "text-body font-bold",

//   segments:
//     "relative grid auto-cols-fr grid-flow-col gap-1 rounded-full bg-mist p-1 [--dir:1] rtl:[--dir:-1]",
//   segmentPill:
//     "absolute inset-y-1 start-1 rounded-full bg-brand transition-transform duration-220 ease-smooth",
//   segment: cx(
//     "group relative flex min-h-10 items-center justify-center rounded-full px-2 py-1 text-center text-navy/65 transition-colors duration-220 ease-smooth",
//     "data-selected:text-white data-disabled:opacity-50",
//     focusRing
//   ),
//   segmentText: "flex flex-col items-center leading-tight",
//   segmentName: "text-small font-medium group-data-selected:font-semibold",
//   segmentPrice: "flex items-baseline gap-1 text-caption tabular-nums",
//   segmentOldPrice:
//     "font-medium text-navy/55 line-through group-data-selected:text-white/70",

//   baristaSlot: "px-4",
//   barista: cx(
//     "group flex min-h-14 w-full items-center gap-3 rounded-lg bg-arctic px-4 py-2 text-start transition-[background-color,box-shadow] duration-200 ease-out",
//     "data-selected:bg-sand data-selected:ring-2 data-selected:ring-inset data-selected:ring-brand data-disabled:opacity-50",
//     focusRing
//   ),
//   baristaIcon: "size-6 shrink-0",
//   baristaText: "flex min-w-0 flex-1 flex-col",
//   baristaTitle: "text-small font-bold",
//   baristaSub: "text-caption font-medium",
//   baristaCheck:
//     "flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-navy transition-colors duration-200 group-data-selected:bg-brand group-data-selected:text-white",

//   addOnsGroup: "relative",
//   addOnsLabel: "px-4 pb-2 text-body font-bold",
//   addOn: cx(
//     "group relative flex min-h-14 w-full items-center gap-4 border-b border-mist px-4 py-2 text-start transition-colors duration-150",
//     "data-pressed:bg-mist data-disabled:opacity-50",
//     focusRingInset
//   ),
//   addOnBox:
//     "flex size-6 shrink-0 items-center justify-center rounded-sm border-2 border-navy transition-colors duration-150 group-data-selected:border-brand group-data-selected:bg-brand group-data-selected:text-white",
//   addOnName:
//     "min-w-0 flex-1 text-body font-medium group-data-selected:font-semibold",
//   addOnPrice: "shrink-0 text-end",

//   tick: "size-4 scale-50 opacity-0 transition-[opacity,transform] duration-150 ease-out group-data-selected:scale-100 group-data-selected:opacity-100",
// } as const;

// export function ProductOptions({
//   product,
//   selectedOptionId,
//   selectedAddOnIds,
//   onSelectOption,
//   onSelectAddOns,
//   showProduct,
//   isDisabled,
// }: Props) {
//   const sizeInputs = useRef(new Map<string, HTMLInputElement>());
//   const addOnInputs = useRef(new Map<string, HTMLInputElement>());
//   const t = useStrings(strings);
//   const locale = useLocale();
//   const money = useMoney();

//   const sizes = product.pricing.type === "sizes" ? product.pricing.options : [];
//   const baristaIds = product.baristaWay.map((addOn) => addOn.id);
//   const baristaOn =
//     baristaIds.length > 0 &&
//     baristaIds.every((id) => selectedAddOnIds.includes(id));

//   const hasSizes = sizes.length > 0;
//   const hasAddOns = product.addOns.length > 0;
//   const hasBarista = baristaIds.length > 0;
//   if (!hasSizes && !hasAddOns && !hasBarista) return null;

//   function toggleBarista() {
//     onSelectAddOns(
//       baristaOn
//         ? selectedAddOnIds.filter((id) => !baristaIds.includes(id))
//         : [...new Set([...selectedAddOnIds, ...baristaIds])]
//     );
//   }

//   const sizeIndex = Math.max(
//     0,
//     sizes.findIndex((option) => option.id === selectedOptionId)
//   );
//   const name = product.name[locale];
//   const pillStyle = {
//     "--n": sizes.length,
//     "--i": sizeIndex,
//     width: "calc((100% - 0.5rem - 0.25rem * (var(--n) - 1)) / var(--n))",
//     transform: "translateX(calc(var(--dir) * var(--i) * (100% + 0.25rem)))",
//   } as CSSProperties;

//   return (
//     <section aria-label={name} className={styles.root}>
//       {showProduct && (
//         <div className={styles.productHeader}>
//           <Img
//             image={product.image}
//             className={cx(
//               styles.productImage,
//               product.availability === "out_of_stock" && styles.grayscale
//             )}
//           />
//           <h3 className={styles.productName}>{name}</h3>
//           {product.availability === "out_of_stock" && (
//             <Badge kind="outOfStock" compact />
//           )}
//         </div>
//       )}

//       {hasSizes && (
//         <RadioGroup
//           value={selectedOptionId ?? undefined}
//           onChange={onSelectOption}
//           orientation="horizontal"
//           isDisabled={isDisabled}
//           className={styles.group}
//         >
//           <Label className={styles.groupLabel}>{t.size}</Label>
//           <div className={styles.segments}>
//             <span
//               aria-hidden="true"
//               className={styles.segmentPill}
//               style={pillStyle}
//             />
//             {sizes.map((option) => (
//               <Radio
//                 key={option.id}
//                 value={option.id}
//                 className={styles.segment}
//                 inputRef={(input) => {
//                   if (input) sizeInputs.current.set(option.id, input);
//                   else sizeInputs.current.delete(option.id);
//                 }}
//                 onPress={(event) =>
//                   focusOptionWithoutScrolling(
//                     event.pointerType,
//                     sizeInputs.current.get(option.id)
//                   )
//                 }
//               >
//                 <span className={styles.segmentText}>
//                   <span className={styles.segmentName}>
//                     {option.name?.[locale]}
//                   </span>
//                   <span className={styles.segmentPrice}>
//                     {option.discount > 0 && (
//                       <span className={styles.segmentOldPrice}>
//                         {Math.round(option.price)}
//                       </span>
//                     )}
//                     <span>{money(option.final)}</span>
//                   </span>
//                 </span>
//               </Radio>
//             ))}
//           </div>
//         </RadioGroup>
//       )}

//       {hasBarista && (
//         <div className={styles.baristaSlot}>
//           <ToggleButton
//             isSelected={baristaOn}
//             onChange={toggleBarista}
//             isDisabled={isDisabled}
//             className={styles.barista}
//           >
//             <Icon name="sparkle" className={styles.baristaIcon} />
//             <span className={styles.baristaText}>
//               <span className={styles.baristaTitle}>{t.baristaWay}</span>
//               <span className={styles.baristaSub}>{t.baristaSub}</span>
//             </span>
//             <span aria-hidden="true" className={styles.baristaCheck}>
//               <Icon name="check" className={styles.tick} />
//             </span>
//           </ToggleButton>
//         </div>
//       )}

//       {hasAddOns && (
//         <CheckboxGroup
//           className={styles.addOnsGroup}
//           value={selectedAddOnIds}
//           onChange={onSelectAddOns}
//           isDisabled={isDisabled}
//         >
//           <Label className={styles.addOnsLabel}>{t.addOns}</Label>
//           {product.addOns.map((addOn) => (
//             <Checkbox
//               key={addOn.id}
//               value={addOn.id}
//               className={styles.addOn}
//               inputRef={(input) => {
//                 if (input) addOnInputs.current.set(addOn.id, input);
//                 else addOnInputs.current.delete(addOn.id);
//               }}
//               onPress={(event) =>
//                 focusOptionWithoutScrolling(
//                   event.pointerType,
//                   addOnInputs.current.get(addOn.id)
//                 )
//               }
//             >
//               <span aria-hidden="true" className={styles.addOnBox}>
//                 <Icon name="check" className={styles.tick} />
//               </span>
//               <span className={styles.addOnName}>{addOn.name[locale]}</span>
//               <span className={styles.addOnPrice}>
//                 <Price value={addOn.price} plus size="small" />
//               </span>
//             </Checkbox>
//           ))}
//         </CheckboxGroup>
//       )}
//     </section>
//   );
// }

// function focusOptionWithoutScrolling(
//   pointerType: "mouse" | "pen" | "touch" | "keyboard" | "virtual",
//   input: HTMLInputElement | undefined
// ) {
//   if (
//     !input ||
//     (pointerType !== "mouse" && pointerType !== "pen" && pointerType !== "touch")
//   ) {
//     return;
//   }

//   const focus = input.focus;
//   input.focus = (options) =>
//     focus.call(input, { ...options, preventScroll: true });
//   queueMicrotask(() => {
//     input.focus = focus;
//   });
// }
