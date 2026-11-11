// import { Button } from "react-aria-components";
// import { useStrings } from "@/shared/i18n";
// import {
//   CategorySection,
//   CategorySheet,
//   Header,
//   PairingSheet,
//   PairingsSection,
//   ProductSheet,
//   PromoPopup,
//   SearchOverlay,
//   SignaturesSection,
// } from "./components";
// import { useMenu } from "./hooks/use-menu";
// import { useMenuFlow } from "./hooks/use-menu-flow";
// import { strings } from "./strings";
// import type { Menu } from "./types/menu-models";

// const styles = {
//   statusPage:
//     "flex min-h-dvh flex-col items-center justify-center gap-4 bg-white px-6 text-center",
//   spinner:
//     "size-10 animate-spin rounded-full border-2 border-arctic border-t-navy motion-reduce:animate-none",
//   statusText: "text-small font-medium text-navy/65",
//   errorTitle: "text-title font-bold",
//   retry:
//     "text-small rounded-full bg-brand px-6 py-3 font-bold text-white outline-none transition data-focus-visible:ring-2 data-focus-visible:ring-brand data-focus-visible:ring-offset-2 data-hovered:bg-brand/90 data-pressed:scale-[0.98]",
//   page: "min-h-dvh bg-white pb-8",
//   main: "divide-y-8 divide-mist",
// } as const;

// export function MenuPage() {
//   const s = useStrings(strings);
//   const menu = useMenu();

//   if (menu.status === "loading") {
//     return (
//       <main aria-busy="true" className={styles.statusPage}>
//         <div aria-hidden="true" className={styles.spinner} />
//         <p className={styles.statusText}>{s.loadingMenu}</p>
//       </main>
//     );
//   }

//   if (menu.status === "error") {
//     return (
//       <main className={styles.statusPage}>
//         <h1 className={styles.errorTitle}>{s.errorTitle}</h1>
//         <p className={styles.statusText}>
//           {menu.isNetworkError ? s.errorNetwork : s.errorServer}
//         </p>
//         <Button onPress={menu.retry} className={styles.retry}>
//           {s.retry}
//         </Button>
//       </main>
//     );
//   }

//   return <MenuReady menu={menu.menu} />;
// }

// // Split from MenuPage so the flow hook only runs once the data exists.
// function MenuReady({ menu }: { menu: Menu }) {
//   const flow = useMenuFlow(menu);

//   return (
//     <div className={styles.page}>
//       <Header
//         sections={flow.sections}
//         activeId={flow.activeId}
//         onSelect={flow.scrollTo}
//         onSearch={() => flow.setPanel("search")}
//         onCategories={() => flow.setPanel("categories")}
//       />

//       <main className={styles.main}>
//         {menu.signatures.length > 0 && (
//           <SignaturesSection
//             products={menu.signatures}
//             onOpen={flow.openProduct}
//           />
//         )}
//         {menu.pairings.length > 0 && (
//           <PairingsSection pairings={menu.pairings} onOpen={flow.openPairing} />
//         )}
//         {menu.categories.map((category) => (
//           <CategorySection
//             key={category.id}
//             category={category}
//             onOpen={flow.openProduct}
//           />
//         ))}
//       </main>

//       {flow.productSheet && (
//         <ProductSheet
//           key={flow.productSheet.id}
//           product={flow.productSheet.product}
//           isOpen={flow.panel === "product"}
//           onClose={flow.closePanel}
//           onOpenProduct={flow.openProductById}
//         />
//       )}
//       {flow.pairingSheet && (
//         <PairingSheet
//           key={flow.pairingSheet.id}
//           pairing={flow.pairingSheet.pairing}
//           isOpen={flow.panel === "pairing"}
//           onClose={flow.closePanel}
//         />
//       )}
//       <CategorySheet
//         isOpen={flow.panel === "categories"}
//         categories={menu.categories}
//         activeId={flow.activeId}
//         onClose={flow.closePanel}
//         onPick={flow.goToSection}
//       />
//       <SearchOverlay
//         menu={menu}
//         isOpen={flow.panel === "search"}
//         onClose={flow.closePanel}
//         onPickCategory={flow.goToSection}
//         onPickPairing={flow.openPairing}
//         onPickProduct={flow.openProduct}
//       />

//       <PromoPopup popup={menu.popup} busy={flow.panel !== null} />
//     </div>
//   );
// }
