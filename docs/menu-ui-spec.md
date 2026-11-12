# Public Menu UI specification

Source is the checked-out implementation. Component file paths below are repository-relative. “NOT FOUND” means the named value was not defined in the inspected source; no replacement is inferred.

## 1. Overview and UI feel

The menu is a warm, cream-and-charcoal catalogue with restrained teal accents, rounded pill controls, softly rounded white cards, image-led product browsing, and generous section spacing. Mobile prioritizes horizontal signature/pairing rails and stacked product rows; larger screens turn those rails into grids. English and Arabic share the layout, with RTL direction, Arabic copy, and Arabic typography applied at the document level.

## 2. Design tokens

### Colors

HEX values below are from `src/index.css`’s `@theme`. Alpha is listed separately so a translucent Tailwind utility can be reconstructed without inventing a different base color.

| Name / source token             | Resolved color                                                                             | Opacity forms used by Menu                                                         | Where used                                                                                                                                               |
| ------------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cream` / `--color-cream`       | `#F3EBDD`                                                                                  | Base 100%                                                                          | Page/body/header and sheet backgrounds; titles and badges                                                                                                |
| `charcoal` / `--color-charcoal` | `#292721`                                                                                  | `/60`, `/70`, `/80`                                                                | Main text, selected nav pill; sheet handle                                                                                                               |
| `sand` / `--color-sand`         | `#D8C8B2`                                                                                  | `/20`, `/30`, `/40`, `/50`, `/60`, `/70`; `ring-sand/60` etc. apply the same alpha | Card rings/borders, card backgrounds, hover/pressed surfaces, loading background                                                                         |
| `taupe` / `--color-taupe`       | `#7A756B`                                                                                  | Base 100%                                                                          | Secondary copy and idle tabs                                                                                                                             |
| `brand` / `--color-brand`       | `#005569`                                                                                  | `/5`, `/10`                                                                        | Primary controls, selected options, focus outlines, active carousel dot                                                                                  |
| `navy` / `--color-navy`         | `#00323F`                                                                                  | `/30`, `/55`, `/60`, `/65`, `/80`                                                  | Secondary copy, badge text, prices and icon surfaces                                                                                                     |
| `arctic` / `--color-arctic`     | `#CFE3E8`                                                                                  | `/40`, `/60`                                                                       | Card image placeholders, borders, dots, selected/offer surfaces                                                                                          |
| `success` / `--color-success`   | `#4A7C59`                                                                                  | None                                                                               | Defined in theme; not used by the inspected Menu UI                                                                                                      |
| `error` / `--color-error`       | `#B0412E`                                                                                  | None                                                                               | Defined in theme; not used by the inspected Menu UI                                                                                                      |
| `scrim` / `--color-scrim`       | Original: `rgb(41 39 33 / 0.6)`; base `#292721` at 60%                                     | Already 60% alpha                                                                  | Search and popup backdrops; sheet overlay                                                                                                                |
| white                           | `#FFFFFF`                                                                                  | `/60`, `/70`, `/80`, `/85`; solid white also used                                  | Cards, language control, close buttons, text on brand                                                                                                    |
| black                           | `#000000`                                                                                  | Solid                                                                              | Tab-list mask gradient stops only; not a visible surface or text color                                                                                   |
| transparent                     | Transparent                                                                                | N/A                                                                                | Transparent button/sheet surfaces                                                                                                                        |
| `currentColor`                  | Inherited from element; usually `#292721` for body text                                    | N/A                                                                                | SVG icon strokes, global focus outline                                                                                                                   |
| `color-mix` base                | `color-mix(in srgb, #F3EBDD 60%, #D8C8B2)` = `#E8DDCC` in sRGB                             | Used directly                                                                      | Fixed patterned loading/error background; see `Background`                                                                                               |
| `mist`                          | **NOT FOUND**: no `--color-mist` in `src/index.css`; no other definition found under `src` | `bg-mist`, `bg-mist/60` are referenced                                             | Search input/clear/rows, category rows, size and add-on interaction surfaces. These utility names have no corresponding theme token in inspected source. |

`MenuButton` uses `bg-brand/5` and `bg-brand/10`, equal to brand at 5% and 10%. Opacity examples in rendered class strings: `bg-white/70` = white at 70%; `text-navy/65` = navy at 65%; `bg-scrim` uses the scrim token’s own 60% alpha; `border-sand/30` = sand at 30%. The `mist` modifiers cannot be resolved because the color itself is undefined.

### Typography

| Token / utility                | Font family                                                      |                       Size |                                   Line height | Weights used                          |
| ------------------------------ | ---------------------------------------------------------------- | -------------------------: | --------------------------------------------: | ------------------------------------- |
| `font-latin`                   | `"Montserrat Variable", system-ui, sans-serif`                   |                          — |                                             — | Variable 100–900; body default is 500 |
| `font-arabic`                  | `"Montserrat Variable", "Cairo Variable", system-ui, sans-serif` |                          — |                                             — | Variable 100–900                      |
| `text-title`                   | Inherited locale family                                          |            24px (`1.5rem`) |     31.2px Latin (`1.3`); 36px Arabic (`1.5`) | 700                                   |
| `text-heading`                 | Inherited locale family                                          |          18px (`1.125rem`) |   23.94px Latin (`1.33`); 27px Arabic (`1.5`) | 500, 600, 700                         |
| `text-body`                    | Inherited locale family                                          |              16px (`1rem`) |     24px Latin (`1.5`); 27.2px Arabic (`1.7`) | 500, 600, 700                         |
| `text-small`                   | Inherited locale family                                          |          14px (`0.875rem`) | 20.02px Latin (`1.43`); 22.4px Arabic (`1.6`) | 500, 600, 700                         |
| `text-caption`                 | Inherited locale family                                          |           12px (`0.75rem`) |   16.08px Latin (`1.34`); 18px Arabic (`1.5`) | 500, 600, 700                         |
| `text-[clamp(5rem,30vw,8rem)]` | Inherited locale family                                          | `clamp(80px, 30vw, 128px)` |                            `leading-none` (1) | 700                                   |

`src/main.tsx` imports both Montserrat CSS (`src/index.css`’s `@font-face`) and `@fontsource-variable/cairo`. In Arabic, `src/index.css` sets the Arabic line-height overrides and `[lang="ar"]` family. Body default weight is 500. Explicit weights in Menu classes are `font-medium` (500), `font-semibold` (600), and `font-bold` (700). Other typography modifiers include `text-balance`, `text-pretty`, `tabular-nums`, `tracking-tight`, `line-clamp-*`, `line-through`, and `whitespace-*`; they do not define additional font-size tokens.

### Spacing and sizing

The project uses Tailwind v4 utilities (dependency `tailwindcss` 4.3.4) with the default spacing scale; the `@theme` block does not redefine spacing. One spacing unit is 4px. Spacing values actually used by Menu classes: `0.5`=2px, `1`=4px, `1.5`=6px, `2`=8px, `3`=12px, `3.5`=14px, `4`=16px, `5`=20px, `6`=24px, `8`=32px, `10`=40px, `12`=48px, `14`=56px, `16`=64px, `18`=72px, `20`=80px, `24`=96px, `26`=104px, `28`=112px, `32`=128px, and `999`=3996px. Frequently repeated page dimensions are 56px header row (`h-14`), 48px nav row (`h-12`), 16px standard gutter (`px-4`), 24px desktop gutter (`md:px-6`), 32px page bottom padding (`pb-8`), and 24px section vertical padding (`py-6`).

Additional exact sizing used includes `size-2` (8px), `size-3` (12px), `size-3.5` (14px), `size-4` (16px), `size-5` (20px), `size-6` (24px), `size-7` (28px), `size-8` (32px), `size-10` (40px), `size-12` (48px), `size-24` (96px), `w-28` (112px), `w-32`/`h-32` (128px), `h-16` (64px), `h-20` (80px), `h-7` (28px), `min-h-18` (72px), `min-w-64` (256px), `min-w-72` (288px), and `min-w-12` (48px). Arbitrary sizing includes `w-[72%]`, `w-[80%]`, `max-h-[80dvh]`, `md:h-[min(40rem,80dvh)]`, `max-w-[min(28rem,calc(100vw-2rem))]`, `pb-[max(1rem,env(safe-area-inset-bottom))]`, and the `w-999` Vaul handle hit-area utility.

### Radii, shadows, borders

| Token / class                        |                              Value | Use                                                           |
| ------------------------------------ | ---------------------------------: | ------------------------------------------------------------- |
| `rounded-sm`                         |               Tailwind default 2px | Checkmark boxes                                               |
| `rounded-md` / `--radius-md`         |                               14px | Card controls, image thumbnails, category rows                |
| `rounded-lg` / `--radius-lg`         |                               20px | Menu cards, product hero, search modal, sheet content corners |
| `rounded-t-sheet` / `--radius-sheet` |                   32px top corners | Bottom sheet                                                  |
| `rounded-full`                       |                             9999px | Pills, circular controls, dots                                |
| `--shadow-sheet` / `shadow-sheet`    | `0 -8px 32px rgb(41 39 33 / 0.22)` | Desktop search modal                                          |

Borders use the Tailwind default 1px (`border`, `border-t`), 2px (`border-2`), and 0.5px (`border-b-[0.5px]`, `border-t-[0.5px]`). `ring-1` is 1px. No other named shadow token is defined in `src/index.css`.

### Z-index layers

| Value | Class   | Menu use                                                                   |
| ----: | ------- | -------------------------------------------------------------------------- |
|   -10 | `-z-10` | Fixed decorative background                                                |
|     0 | `z-0`   | Bottom-sheet handle row                                                    |
|    10 | `z-10`  | Card action hit areas; search modal over its scrim; selected nav indicator |
|    40 | `z-40`  | Sticky page header                                                         |
|    50 | `z-50`  | Bottom-sheet overlay/content and modal overlays                            |

### Motion tokens

| Token / class                                  | Duration and easing                  | Animated property / usage                                                                                                      |
| ---------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `--duration-interactive`                       | 200ms                                | Component transitions on color, transform, border, opacity, or image opacity as specified by their transition-property utility |
| `--ease-smooth`                                | `cubic-bezier(0.16, 1, 0.3, 1)`      | Interactive transitions and reveal/pop entrance; loading liquid                                                                |
| `--ease-exit`                                  | `cubic-bezier(0.3, 0, 0, 1)`         | Reveal/pop exit                                                                                                                |
| `--ease-sheet-enter`                           | `cubic-bezier(0.22, 1, 0.36, 1)`     | Scrim/sheet entrance                                                                                                           |
| `--ease-sheet-exit`                            | `cubic-bezier(0.4, 0, 1, 1)`         | Scrim/sheet exit                                                                                                               |
| `fade-in` / `fade-out`                         | 150ms ease-out / ease-in             | Opacity; search overlay/modal                                                                                                  |
| `scrim-in` / `scrim-out`                       | 300ms sheet-enter / 250ms sheet-exit | Scrim opacity / background-color; popup                                                                                        |
| `slide-up` / `slide-down`                      | 400ms sheet-enter / 300ms sheet-exit | `transform: translateY`; defined for drawer animation                                                                          |
| `reveal-in` / `reveal-out`                     | 240ms smooth / 180ms exit            | Opacity and translateY(8px); promo dialog and expanded products                                                                |
| `pop-in` / `pop-out`                           | 200ms smooth / 150ms exit            | Opacity and scale(0.7); defined in theme                                                                                       |
| `duration-150`, `duration-200`, `duration-300` | 150/200/300ms                        | Explicit component transitions                                                                                                 |
| Header tab centering                           | 300ms cubic ease-out `1 - (1 - t)^3` | `scrollLeft` via `requestAnimationFrame`                                                                                       |
| Price rolling digits                           | 300ms smooth                         | `transform: translateY(...)`                                                                                                   |
| `loading-cup-fill`                             | 2.5s, infinite, smooth               | `clip-path: inset(...)` liquid fill                                                                                            |
| `animate-swap-in`                              | **NOT FOUND**                        | Referenced by `SwapAnimation`; no matching `@theme` animation or keyframes found under `src`                                   |

`motion-reduce` disables component transitions/animations where included. The global Vaul selector forces `transition-timing-function: var(--ease-sheet-enter)` and `animation-duration: var(--duration-interactive) !important` on `[data-vaul-drawer]` and `[data-vaul-overlay]`; record this override in addition to the theme’s slide animation definitions.

### Breakpoints and max widths

| Breakpoint / width                   |                             Value | Where used                                                   |
| ------------------------------------ | --------------------------------: | ------------------------------------------------------------ |
| `sm`                                 |  40rem / 640px (Tailwind default) | Signature card padding; compact button text size             |
| `md`                                 |  48rem / 768px (Tailwind default) | Desktop header gutters, grids, modal and sheet sizing        |
| `lg`                                 | 64rem / 1024px (Tailwind default) | Four-column signature and three-column pairing/product grids |
| `max-w-5xl`                          |                    64rem / 1024px | Header and section content                                   |
| `max-w-120`                          |                     30rem / 480px | Mobile-width search panel and sheet content                  |
| `max-w-140`                          |                     35rem / 560px | Desktop search panel and sheet content                       |
| `max-w-md` / `max-w-sm` / `max-w-xs` |             28rem / 24rem / 20rem | State text content                                           |
| `max-w-96`                           |                     24rem / 384px | Signature cards                                              |
| Arbitrary                            |  `min(28rem, calc(100vw - 2rem))` | Promo image                                                  |
| Arbitrary                            |               `min(40rem, 80dvh)` | Desktop search panel height                                  |

No `xl` or `2xl` breakpoint utility is used in the Menu source.

## 3. Page layout

### Wireframes

Mobile (one column; header remains at viewport top):

```text
+--------------------------------------+
| [back]  [brand]       [search] [lang] | 56px
| [categories] [scrolling section tabs] | 48px
+--------------------------------------+ <- sticky header, total 104px
| Signatures                           |
| subtitle                             |
| [card] [card] -> horizontal rail     |
|             dots                     |
| Pairings                             |
| subtitle                             |
| [pairing] [pairing] -> horizontal    |
|             dots                     |
| Category heading                     |
| [product row]                        |
| [product row]                        |
| [Show all ...]                       |
| ...                                  |
+--------------------------------------+
```

Desktop (content max 1024px; grids replace carousels):

```text
+----------------------------------------------------------+
| [back] [brand]                         [search] [language]|
| [categories] [section tabs centered in scroll viewport]  |
+----------------------------------------------------------+ sticky 104px
|       Signatures + subtitle                               |
|       [card]       [card]       [card]       [card]        |
|       Pairings + subtitle                                 |
|       [pairing]    [pairing]    [pairing]                 |
|       Category heading                                    |
|       [product row] [product row] [product row]            |
|       [product row] [product row] [product row]            |
+----------------------------------------------------------+
```

### Container, background, and safe areas

- `MenuReady` page wrapper: `relative isolate min-h-dvh pb-8`. It has no explicit max-width or horizontal padding; the header and section contents establish their own centered `max-w-5xl` widths.
- Header wrapper: `sticky top-0 z-40 bg-cream transform-gpu`. It sticks to the viewport top, covers content with cream, and contains both header rows.
- Header rows: 56px top bar (`h-14`) and 48px navigation (`h-12`), so the nominal sticky header height is **104px**. The measured `headerRef` height is used at runtime rather than assuming a fixed pixel value.
- The main flow is a flex column. Signatures and pairings render only when their arrays are nonempty; categories render in menu order.
- Sections use `scroll-mt-26` (104px). Navigation does not use native anchor scrolling; it computes a `window.scrollTo` target from measured header height plus a 16px gap.
- Sheet footer reserves bottom safe-area space with `pb-[max(1rem,env(safe-area-inset-bottom))]`. No page-level safe-area padding is specified.
- Search is full-screen on narrow viewports; from `md` it is a centered, top-offset panel. The sheet is bottom-fixed, max-height 88dvh, and centered/max-width constrained on desktop.
- Loading/error state backgrounds are fixed viewport decorations (`fixed inset-0`) behind their content.

### Vertical order and scroll offset

1. Sticky top bar: back link, brand mark, search, language toggle.
2. Sticky horizontal section navigation: categories launcher plus tabs.
3. Optional signatures section.
4. Optional pairings section.
5. One products section per category, in data order.
6. Mounted modal layers: search, category sheet, conditional product/pairing sheets, then promo popup.

`useMenuNavigation` chooses the active section as the last existing section whose top is at or above `headerHeight + 16px + 2px`; if none have crossed it, the first is active. At the page bottom it forces the final section active. Header height falls back to 104px if no element is measurable. Programmatic selection computes `max(0, scrollY + section.top - (headerHeight + 16px))`, sets the selected id, then uses smooth `window.scrollTo`. A tap pins the active tab for up to 2 seconds; wheel/touchmove/keydown outside the header releases that pin, and `scrollend` releases it immediately.

## 4. Component catalog

For all class blocks, each right-hand quoted value is the exact class string from the component. `data-*` selectors are React Aria/Vaul state selectors, not additional bespoke React state. State matrices use `n/a` where the component has no such state.

Prop notation: imported `Locale` and model names refer to the exact TypeScript types; bare `locale` means `Locale`; bare `formatMoney` means `(value: number, plus?: boolean) => string`; zero-argument callbacks (`onClose`, `onSearch`, `onLanguageChange`, `onRetry`, `onCategories`, `onPress`) mean `() => void`; `onSelect`/`onPick`/`onPickCategory` mean `(id: string) => void`; `onPickPairing` means `(pairing: Pairing) => void`; `onPickProduct` means `(product: Product) => void`; `onOpenProduct` means `(productId: string) => void`; `onSelectOption` means `(optionId: string) => void`; `onSelectAddOns` means `(update: SetStateAction<string[]>) => void`. `onOpen` is typed to its component’s item (`Product` for product cards/sections, `Pairing` for pairing cards/sections), except `OftenOrderedCard` takes `() => void`. A `?` marks an optional prop; all other listed props are required.

### MenuPage

- **Path/purpose:** `src/features/menu/index.tsx`; fetch/status switch for the public menu route.
- **Props:** none.
- **DOM:** loading/error branch: `<main><LoadingState|ErrorState /></main>`; ready branch returns `<MenuReady />`.
- **Layout/classes:** page and header wrapper styles are listed under `MenuReady`. Loading/error components fill at least a dynamic viewport height.

**State matrix**

| Default                                 | Hover | Pressed/active                 | Focus-visible             | Selected | Disabled | Out-of-stock | Loading          | Empty                                                             |
| --------------------------------------- | ----- | ------------------------------ | ------------------------- | -------- | -------- | ------------ | ---------------- | ----------------------------------------------------------------- |
| Fetching state is initial               | n/a   | n/a                            | n/a                       | n/a      | n/a      | n/a          | `<LoadingState>` | n/a                                                               |
| On success, mounts `MenuReady`          | n/a   | n/a                            | n/a                       | n/a      | n/a      | n/a          | n/a              | Empty menu still renders ready page; conditional sections omitted |
| On error, `<ErrorState>` receives retry | n/a   | Retry button has pressed state | Global/button focus style | n/a      | n/a      | n/a          | n/a              | n/a                                                               |

- **Accessibility/RTL:** loading/error are inside `<main>`; page-specific h1 is visually hidden in `MenuReady`. Locale state sets global document direction; section components receive locale.

### MenuReady

- **Path/purpose:** `src/features/menu/index.tsx`; private ready-state layout, section rendering, and overlay wiring.
- **Props:** `menu: Menu` (required).
- **DOM:** `<div><header><HeaderBar/><HeaderNav/></header><main><h1.sr-only/>[sections]</main>[SearchOverlay][CategorySheet][ProductSheet?][PairingSheet?][PromoPopup]</div>`.
- **Layout/classes:**

```text
page: "relative isolate min-h-dvh pb-8"
header: "sticky top-0 z-40 bg-cream transform-gpu"
main: "flex flex-col"
srOnly: "sr-only"
```

- **Colors:** page background comes from global `body` (`#F3EBDD`); sticky header `bg-cream`=`#F3EBDD`.

**State matrix**

| Default   | Hover | Pressed/active                            | Focus-visible  | Selected       | Disabled | Out-of-stock | Loading                    | Empty                                                             |
| --------- | ----- | ----------------------------------------- | -------------- | -------------- | -------- | ------------ | -------------------------- | ----------------------------------------------------------------- |
| Page flow | n/a   | Active section tracked by navigation hook | In descendants | Current nav id | n/a      | Per-item     | Separate `MenuPage` branch | Empty arrays omit signatures/pairings; categories map as supplied |

- **Animation/accessibility/RTL:** `isolate` scopes z layers; `<header>` is sticky. `<h1>` gets `s.page.title` but is `sr-only`. `dir` is set on `HeaderNav` and each menu section; `documentElement.dir` is set by shared i18n. No explicit language key or number locale changes beyond those described in §5.

### HeaderBar

- **Path/purpose:** `src/features/menu/components/header/header-bar.tsx`; back, brand, search, and language actions.
- **Props:** `strings` (required: `{back, search, languageName, languageLang: string}`), `backHref: AppRoute`, `onSearch: () => void`, `onLanguageChange: () => void`, `className?: string`.
- **DOM:** `<div><Link><Icon arrow/><span.sr-only/></Link><div><img/></div><div spacer/><Button search><Icon/></Button><Button language><span lang/></Button></div>`.
- **Layout/classes:**

```text
row: "mx-auto flex h-14 w-full max-w-5xl items-center gap-1 ps-4 pe-2 md:ps-6 md:pe-4"
back: "-ms-3 flex size-12 shrink-0 items-center justify-center rounded-full text-charcoal transition-colors duration-(--duration-interactive) ease-smooth hover:bg-sand/40 active:bg-sand/60 motion-reduce:transition-none"
backIcon: "size-5 rotate-180 rtl:rotate-0"
brand: "flex min-w-0 items-center"
logo: "h-7 w-auto"
spacer: "flex-1"
search: "flex size-12 shrink-0 items-center justify-center rounded-full text-charcoal transition-colors duration-(--duration-interactive) ease-smooth data-hovered:bg-sand/40 data-pressed:bg-sand/60 motion-reduce:transition-none"
icon: "size-5"
language: "group flex h-12 shrink-0 items-center justify-center rounded-full"
languageSurface: "flex h-10 min-w-12 items-center justify-center rounded-full border border-sand bg-white/60 px-3.5 text-small font-bold text-charcoal transition-[transform,background-color,border-color] duration-(--duration-interactive) ease-smooth group-data-hovered:border-taupe group-data-hovered:bg-white group-data-pressed:scale-[0.97] motion-reduce:transition-none"
```

- **Colors:** back/search text `#292721`; sand hover/pressed at 40%/60%; language border `#D8C8B2`, white surface 60% then white on hover, charcoal text; logo file `src/assets/mark.svg`.

**State matrix**

| Default       | Hover                                                                                                  | Pressed/active                                                                    | Focus-visible                                                              | Selected | Disabled          | Out-of-stock | Loading | Empty |
| ------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | -------- | ----------------- | ------------ | ------- | ----- |
| Classes above | Back `hover:bg-sand/40`; React Aria search `data-hovered:bg-sand/40`; language group changes border/bg | Back `active:bg-sand/60`; search `data-pressed:bg-sand/60`; language scales `.97` | Global `:focus-visible` outline; no local focus selector on these controls | n/a      | No disabled props | n/a          | n/a     | n/a   |

- **Motion/accessibility/RTL:** 200ms smooth color/transform transitions; reduced-motion disables. Search uses `aria-label`; other button has text content in its surface; back text is screen-reader-only. Search/language use React Aria `Button` and `onPress`; back is shared Wouter `Link`. Back arrow is rotated 180° in LTR and 0° in RTL; row uses logical padding.

### HeaderNav

- **Path/purpose:** `src/features/menu/components/header/header-nav.tsx`; category launcher and accessible, scrollable tabs.
- **Props:** `strings: {categories: string}`, `sections: NavSection[]`, `activeId: string`, `direction: "ltr" | "rtl"`, `onSelect: (id: string) => void`, `onCategories: () => void`, `className?: string`.
- **DOM:** `<div dir><div><Button category><Icon menu/></Button></div><nav><SharedElementTransition><Tabs><TabList><Tab><span/><SelectionIndicator/></Tab>…</TabList></Tabs></SharedElementTransition></nav></div>`.
- **Layout/classes:**

```text
row: "mx-auto flex h-12 w-full max-w-5xl items-center"
menuSlot: "shrink-0 ps-1 md:ps-3"
categories: "flex size-12 shrink-0 items-center justify-center rounded-full text-charcoal transition-colors duration-(--duration-interactive) ease-smooth data-hovered:bg-sand/40 data-pressed:bg-sand/60"
icon: "size-5"
nav: "relative h-12 min-w-0 flex-1"
tabs: "flex h-full w-full items-center"
tabList: "no-scrollbar relative flex h-12 w-full touch-pan-x items-center gap-1 overflow-x-auto overscroll-x-contain px-4 [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)]"
tab: "group relative flex h-10 shrink-0 cursor-pointer items-center justify-center rounded-full px-4 text-small outline-none text-taupe data-hovered:text-charcoal data-selected:text-cream"
tabText: "relative z-10 font-medium group-data-selected:font-semibold"
indicator: "absolute inset-0 z-0 rounded-full bg-charcoal transition-[translate,width] duration-300 ease-smooth"
```

- **Colors:** idle text `#7A756B`, hovered `#292721`, selected text `#F3EBDD`, selected indicator `#292721`, category button charcoal with sand hover/press.

**State matrix**

| Default             | Hover                        | Pressed/active                                                        | Focus-visible                               | Selected                                                                        | Disabled          | Out-of-stock | Loading | Empty                                   |
| ------------------- | ---------------------------- | --------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------- | ----------------- | ------------ | ------- | --------------------------------------- |
| Idle tab uses taupe | `data-hovered:text-charcoal` | Category button `data-pressed:bg-sand/60`; tabs have no pressed class | `outline-none`; no local focus-visible rule | Tab `data-selected:text-cream`; text becomes semibold and indicator is charcoal | No disabled props | n/a          | n/a     | Empty section list yields empty TabList |

- **Motion/accessibility/RTL:** React Aria `Tabs`, `TabList`, `Tab`, `SelectionIndicator`, and `Button`; `selectedKey` is `activeId`; labels use `aria-label`. Selection centers active tab by measuring its center vs tab-list center then tweening `scrollLeft` for 300ms with cubic ease-out; first `touchstart` cancels the animation. `dir` follows locale; the mask gradient itself remains left-to-right and is not RTL-mirrored. Tabs retain React Aria keyboard behavior; no custom key handler is added.

### SignaturesSection

- **Path/purpose:** `src/features/menu/components/sections/signatures-section.tsx`; featured-product carousel on mobile and grid at `md`.
- **Props:** `products: Product[]`, `locale: Locale`, `strings: {title: string; sub?: string}`, `formatMoney`, `onOpen`, `className?`.
- **DOM:** `<section id="signatures" dir aria-label><div><div><Heading/></div><div rail><SignatureCard…/></div>{dots}</div></section>`.
- **Layout/classes:**

```text
section: "scroll-mt-26 py-6"
inner: "mx-auto flex w-full max-w-5xl flex-col gap-4"
head: "px-4 md:px-6"
rail: "no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-4 pt-px pb-1 scroll-ps-4 md:grid md:snap-none md:grid-cols-3 md:overflow-visible md:px-6 md:pt-0 lg:grid-cols-4"
card: "w-[72%] min-w-64 max-w-96 snap-start md:w-auto md:min-w-0 md:max-w-none"
dots: "flex justify-center gap-2 md:hidden"
dot: "size-2 rounded-full transition-colors duration-(--duration-interactive) ease-smooth motion-reduce:transition-none"
dotActive: "bg-brand"
dotIdle: "bg-arctic"
```

- **Colors:** active dot `#005569`, idle dot `#CFE3E8`; cards set in `SignatureCard`.

**State matrix**

| Default   | Hover                | Pressed/active   | Focus-visible      | Selected                         | Disabled | Out-of-stock | Loading | Empty                                                    |
| --------- | -------------------- | ---------------- | ------------------ | -------------------------------- | -------- | ------------ | ------- | -------------------------------------------------------- |
| Rail/grid | Child card hover n/a | Child activation | Child button focus | Active dot follows `activeIndex` | n/a      | Per card     | n/a     | Section is not mounted by `MenuReady` when no signatures |

- **Motion/accessibility/RTL:** `useCarousel` measures scroll and item bounds; dots are `aria-hidden`. Section direction is locale-dependent. At `md` rail becomes three columns; `lg` four columns, and dots are hidden.

### SignatureCard

- **Path/purpose:** `src/features/menu/components/sections/signature-card.tsx`; featured image, badge, description, price and full-card action.
- **Props:** `product: Product`, `locale`, `formatMoney`, `onOpen`, `priority?: boolean`, `className?: string`.
- **DOM:** `<div data-carousel-card><div frame><Img/><Badge?/></div><div text><span name/><span description?/></div><div bottom><Price?/ ><Chevron/></div><Button action/></div>`.
- **Layout/classes:**

```text
root: "relative flex shrink-0 flex-col gap-3 rounded-lg bg-white/70 p-3 ring-1 ring-sand/60 sm:p-4"
frame: "relative"
image: "aspect-square w-full rounded-md"
grayscale: "grayscale"
badge: "absolute end-2 bottom-2"
text: "flex min-w-0 flex-col gap-1"
name: "line-clamp-2 text-heading font-bold text-balance text-charcoal"
description: "line-clamp-2 text-caption font-medium text-pretty text-navy/65"
bottom: "mt-auto flex items-center gap-2 pt-1"
unavailable: "opacity-60"
chevron: "ms-auto"
action: "absolute inset-0 z-10 rounded-lg outline-none data-focus-visible:outline-2 data-focus-visible:outline-offset-2 data-focus-visible:outline-brand"
```

- **Colors:** card white at 70%, sand ring at 60%; heading charcoal; description navy at 65%; stock bottom opacity 60%; focus outline brand.

**State matrix**

| Default    | Hover          | Pressed/active              | Focus-visible                                 | Selected | Disabled            | Out-of-stock                                                 | Loading                 | Empty                                                                         |
| ---------- | -------------- | --------------------------- | --------------------------------------------- | -------- | ------------------- | ------------------------------------------------------------ | ----------------------- | ----------------------------------------------------------------------------- |
| Card above | No hover class | Button has no pressed style | Action `data-focus-visible` brand 2px outline | n/a      | Button not disabled | Image grayscale; uses `outOfStock` badge; bottom opacity 60% | Image opacity crossfade | Missing image shows placeholder only; missing description/badge/price omitted |

- **Motion/accessibility/RTL:** Card button spans card, labelled by localized product name. Image receives `priority` for first item; `Img` uses eager/high fetch priority then. Chevron is decorative. Badge follows stock before product badge. Logical `end`/`ms` positions mirror; square image does not.

### PairingsSection

- **Path/purpose:** `src/features/menu/components/sections/pairings-section.tsx`; pairing offer rail/grid.
- **Props:** `pairings: Pairing[]`, `locale`, `strings: {title, sub?, savings: (amount: string) => string}`, `formatMoney`, `onOpen`, `className?`.
- **DOM:** `<section id="pairings" dir aria-label><div><header><Heading/></header><div rail><PairingCard…/></div>{dots}</div></section>`.
- **Layout/classes:**

```text
section: "scroll-mt-26 pt-6 pb-5"
inner: "mx-auto flex w-full max-w-5xl flex-col gap-4"
head: "px-4 md:px-6"
rail: "no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-4 pt-px pb-1 scroll-ps-4 md:grid md:snap-none md:grid-cols-2 md:overflow-visible md:px-6 md:pt-0 lg:grid-cols-3"
card: "w-[80%] min-w-72 snap-start md:w-auto md:min-w-0"
dots: "flex justify-center gap-2 md:hidden"
dot: "size-2 rounded-full transition-colors duration-(--duration-interactive) ease-smooth motion-reduce:transition-none"
dotActive: "bg-brand"
dotIdle: "bg-arctic"
```

- **Colors:** active dot brand `#005569`; idle dot arctic `#CFE3E8`; card colors in `PairingCard`.

**State matrix**

| Default   | Hover               | Pressed/active   | Focus-visible       | Selected                 | Disabled | Out-of-stock               | Loading | Empty                                |
| --------- | ------------------- | ---------------- | ------------------- | ------------------------ | -------- | -------------------------- | ------- | ------------------------------------ |
| Rail/grid | Child card has none | Child activation | Child focus outline | Dot follows active index | n/a      | Child card stock treatment | n/a     | Section not mounted when no pairings |

- **Motion/accessibility/RTL:** Carousel measurement and dot logic use `useCarousel`; dots `aria-hidden`. At `md` two columns, `lg` three; Arabic sets `dir="rtl"`.

### PairingCard

- **Path/purpose:** `src/features/menu/components/sections/pairing-card.tsx`; combined product imagery, savings chip, aggregate price, and action.
- **Props:** `pairing: Pairing`, `locale`, `formatMoney`, `savingsLabel`, `onOpen`, `className?`.
- **DOM:** `<div data-carousel-card><div pictures><Img…/><span.plus><Icon/></span>?<div savings><Badge/></div>?</div><div names><span…/></div><div bottom><Price/><Chevron/></div><Button action/></div>`.
- **Layout/classes:**

```text
root: "relative flex shrink-0 flex-col gap-2 rounded-lg bg-white/70 p-2 ring-1 ring-sand/60"
pictures: "relative flex aspect-2/1 w-full gap-1"
picture: "min-w-0 flex-1 rounded-md"
grayscale: "grayscale"
plus: "absolute inset-0 m-auto flex size-8 items-center justify-center rounded-full border-2 border-white bg-brand text-white"
plusIcon: "size-4"
savings: "absolute end-2 top-2"
names: "flex min-w-0 flex-col px-2 text-small font-semibold text-balance text-charcoal"
bottom: "mt-auto flex items-center gap-2 px-2 pt-1 pb-2"
unavailable: "opacity-60"
chevron: "ms-auto"
action: "absolute inset-0 z-10 rounded-lg outline-none data-focus-visible:outline-2 data-focus-visible:-outline-offset-2 data-focus-visible:outline-brand"
```

- **Colors:** white 70% card, sand 60% ring, brand/white plus control; charcoal names; availability opacity 60%; savings chip uses badge colors.

**State matrix**

| Default | Hover          | Pressed/active   | Focus-visible            | Selected | Disabled            | Out-of-stock                                                                 | Loading                   | Empty                                                                                |
| ------- | -------------- | ---------------- | ------------------------ | -------- | ------------------- | ---------------------------------------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------ |
| Card    | No hover style | No pressed style | Button 2px brand outline | n/a      | Button not disabled | Unavailable image(s) grayscale; whole price row opacity 60%; no savings chip | Image `Img` loading state | Missing images use placeholders; empty `items` still yields names/price from pairing |

- **Motion/accessibility/RTL:** Action button is labelled with item names joined by `" + "`; plus icon is hidden from assistive technology. Savings displays only when discount > 0 and all items available. Logical `end`/`ms` mirror; image ordering follows data order.

### ProductsSection

- **Path/purpose:** `src/features/menu/components/sections/products-section.tsx`; category heading and product grid with progressive expansion.
- **Props:** `category: Category`, `locale`, `strings: {showAll: (name: string, count: number) => string}`, `formatMoney`, `onOpen`, `className?`.
- **DOM:** `<section id="category-{id}" dir aria-label><div><Heading/><div grid><ProductCard…/><div reveal><ProductCard/></div>?<MenuButton showAll/>?</div></div></section>`.
- **Layout/classes:**

```text
section: "scroll-mt-26 py-6"
inner: "mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 md:px-6"
grid: "grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3"
showAll: "md:col-span-full md:mx-auto md:w-auto md:min-w-72"
reveal: "animate-reveal-in motion-reduce:animate-none"
```

- **Colors:** child product cards; secondary button uses brand outline/text.

**State matrix**

| Default                   | Hover          | Pressed/active            | Focus-visible  | Selected          | Disabled | Out-of-stock | Loading                        | Empty                                                 |
| ------------------------- | -------------- | ------------------------- | -------------- | ----------------- | -------- | ------------ | ------------------------------ | ----------------------------------------------------- |
| First four products shown | Child controls | Show-all React Aria press | Child controls | `showAll` boolean | n/a      | Child card   | Reveal animation when expanded | No products: heading and empty grid; show-all omitted |

- **Motion/accessibility/RTL:** Expanding reveals the remainder with 240ms `reveal-in`; delay is `min(index, 6) * 40ms`, capped at 240ms. Show-all disappears after activation. Section direction follows locale; `aria-label` is localized category name. Grid is 1/2/3 columns at default/`md`/`lg`.

### ProductCard

- **Path/purpose:** `src/features/menu/components/sections/product-card.tsx`; compact category product row and full-row open action.
- **Props:** `product: Product`, `locale`, `formatMoney`, `onOpen`.
- **DOM:** `<div><Img/><div><span name/><span description?/ ><div><Price?/ ><Chevron/></div></div><div badge?/ ><Button action/></div>`.
- **Layout/classes:**

```text
root: "relative flex h-full w-full gap-3 rounded-lg bg-white/70 p-3 ring-1 ring-sand/60"
image: "size-24 shrink-0 rounded-md"
grayscale: "grayscale"
content: "flex min-w-0 flex-1 flex-col gap-0.5"
name: "line-clamp-2 text-body font-semibold text-balance text-charcoal"
description: "line-clamp-2 text-caption font-medium text-navy/65"
bottom: "mt-auto flex items-center justify-between gap-2 pt-1"
unavailable: "opacity-60"
chevron: "-my-1 ms-auto"
badge: "absolute -top-2.5 end-4"
action: "absolute inset-0 z-10 rounded-lg outline-none data-focus-visible:outline-2 data-focus-visible:-outline-offset-2 data-focus-visible:outline-brand"
```

- **Colors:** white 70%, sand ring 60%, charcoal name, navy description 65%, focus outline brand.

**State matrix**

| Default | Hover          | Pressed/active   | Focus-visible                 | Selected | Disabled            | Out-of-stock                                                | Loading               | Empty                                                                      |
| ------- | -------------- | ---------------- | ----------------------------- | -------- | ------------------- | ----------------------------------------------------------- | --------------------- | -------------------------------------------------------------------------- |
| Row     | No hover class | No pressed class | Full action outline brand 2px | n/a      | Button not disabled | Image grayscale; badge says out-of-stock; price opacity 60% | Img opacity crossfade | Missing image/description/badge/price omitted or placeholder as applicable |

- **Motion/accessibility/RTL:** Action button is labelled by localized name. Badge is positioned at logical `end`; chevron uses `ms-auto`. Product row is full-width responsive grid item.

### SearchOverlay

- **Path/purpose:** `src/features/menu/components/overlays/search-overlay.tsx`; modal search field, query feedback, and grouped category/offer/product results.
- **Props:** `menu: Menu`, `locale: Locale`, `strings: SearchOverlayStrings`, `formatMoney`, `isOpen: boolean`, `onClose`, `onPickCategory`, `onPickPairing`, `onPickProduct`.
- **DOM:** `<ModalOverlay><div.scrim/><Modal><Dialog><h2.sr-only/><SearchPanel/></Dialog></Modal></ModalOverlay>`. SearchPanel contains `<SearchField><Label/><Icon/><Input/><Button clear/></SearchField>`, live count, prompt/no-match message, then category, offer, and item sections. Internal components: `SearchPanel`, `ResultRow`, `CategoryRow`, `PairingRow`, `ProductRow`.
- **Layout/classes:**

```text
overlay: "fixed inset-0 z-50 flex justify-center overscroll-none md:items-start md:p-6 md:pt-[8dvh] data-entering:animate-fade-in data-exiting:animate-fade-out motion-reduce:animate-none"
scrim: "pointer-events-none absolute inset-0 bg-scrim"
modal: "relative z-10 flex h-full w-full max-w-120 flex-col overflow-hidden bg-white outline-none data-entering:animate-fade-in data-exiting:animate-fade-out motion-reduce:animate-none md:h-[min(40rem,80dvh)] md:max-w-140 md:rounded-lg md:shadow-sheet"
dialog: "flex min-h-0 flex-1 flex-col outline-none"
topBar: "flex items-center gap-1 border-b border-arctic ps-4 pe-2 md:ps-6 md:pe-4"
field: "group relative my-2 flex h-12 min-w-0 flex-1 items-center"
fieldLabel: "sr-only"
fieldIcon: "pointer-events-none absolute start-4 size-5"
input: "h-12 w-full appearance-none rounded-full border border-arctic bg-mist ps-12 pe-11 text-body outline-none transition-colors duration-150 placeholder:text-navy/55 focus:bg-white data-focus-visible:border-navy [&::-webkit-search-cancel-button]:hidden"
clear: "absolute end-1 flex size-10 items-center justify-center rounded-full outline-none group-data-empty:hidden data-hovered:bg-mist data-pressed:bg-arctic data-focus-visible:outline-2 data-focus-visible:outline-brand"
clearIcon: "size-4"
liveRegion: "sr-only"
results: "min-h-0 flex-1 overflow-y-auto overscroll-contain pb-6"
message: "flex flex-col items-center gap-3 px-6 py-12 text-center text-small font-medium text-pretty text-navy/65"
messageIcon: "size-8"
groupHeading: "px-4 py-2 text-caption font-semibold text-navy/65"
rowWrap: "border-b-[0.5px] border-sand/30"
row: "flex w-full items-center gap-3 px-4 text-start outline-none data-hovered:bg-mist/60 data-pressed:bg-mist data-focus-visible:-outline-offset-2 data-focus-visible:outline-2 data-focus-visible:outline-brand"
rowCategory: "min-h-12"
rowRich: "min-h-18 py-2"
rowName: "min-w-0 flex-1 text-body font-medium text-balance"
rowCount: "shrink-0 text-caption font-medium tabular-nums text-navy/65"
pairThumbs: "flex shrink-0 gap-1"
pairThumb: "size-8 rounded-md"
productThumb: "size-12 shrink-0 rounded-md"
productText: "flex min-w-0 flex-1 flex-col items-start"
productName: "text-body font-medium text-balance"
productDescription: "line-clamp-1 text-caption font-medium text-navy/65"
unavailable: "opacity-60"
grayscale: "grayscale"
```

- **Colors:** white modal; arctic top/border; `bg-mist`/its opacity variants are unresolved (see §2); navy placeholder/text opacity classes; scrim is `rgb(41 39 33 / 0.6)`; rows use sand border at 30%.

**State matrix**

| Default                  | Hover                                                        | Pressed/active                                              | Focus-visible                                   | Selected                  | Disabled          | Out-of-stock                                                                | Loading                 | Empty                                                        |
| ------------------------ | ------------------------------------------------------------ | ----------------------------------------------------------- | ----------------------------------------------- | ------------------------- | ----------------- | --------------------------------------------------------------------------- | ----------------------- | ------------------------------------------------------------ |
| Empty query shows prompt | Rows `data-hovered:bg-mist/60`; clear `data-hovered:bg-mist` | Rows `data-pressed:bg-mist`; clear `data-pressed:bg-arctic` | Input border navy; clear and rows brand outline | No result selection style | No disabled props | Product/pairing thumbnails grayscale; product badge and price opacity shown | No search loading state | Query with `total===0` shows no-match text; no result groups |

- **Animation/accessibility/RTL:** React Aria `ModalOverlay` is dismissable; `Dialog` is labelled by hidden heading; search input has `autoFocus`; count is `aria-live="polite"`. Query state is created in `SearchPanel`, which mounts only while the modal is open, so every open starts empty. Panel is full height on mobile; desktop from `md` starts at 8dvh, has max 40rem/80dvh height and 560px max width. Scroll is contained in results. Logical positions mirror in RTL. Search classification/grouping is specified in §5.

### SearchPanel

- **Path/purpose:** Internal function in `src/features/menu/components/overlays/search-overlay.tsx`; initializes query and renders prompt/results groups.
- **Props:** `SearchOverlayProps` without `isOpen`; `menu`, `locale`, `strings`, `formatMoney`, close and three pick callbacks.
- **DOM/layout:** SearchField header, `aria-live` count paragraph, scrollable results and zero/three grouped sections; all classes are those under `SearchOverlay`.

**State matrix**

| Default        | Hover                 | Pressed/active        | Focus-visible                                   | Selected | Disabled | Out-of-stock      | Loading | Empty                                                              |
| -------------- | --------------------- | --------------------- | ----------------------------------------------- | -------- | -------- | ----------------- | ------- | ------------------------------------------------------------------ |
| Query is empty | Clear/result controls | Clear/result controls | Auto-focused input; controls have focus classes | n/a      | n/a      | Delegated to rows | n/a     | Prompt before input; no-match after nonempty input with zero total |

- **Accessibility/RTL:** Group headings label sections. Group order is categories, offers, items. Locale determines indexed text and layout direction. Results wrappers and labels use semantic sections.

### ResultRow

- **Path/purpose:** Internal function in `src/features/menu/components/overlays/search-overlay.tsx`; common button row and bottom divider.
- **Props:** `onPress: () => void`, `className: string`, `children: ReactNode`.
- **DOM/layout:** `<div.rowWrap><Button class={row + className}>{children}</Button></div>`; row wrap and row classes are exact `SearchOverlay` styles above.

**State matrix**

| Default    | Hover                     | Pressed/active         | Focus-visible                  | Selected | Disabled            | Out-of-stock          | Loading | Empty |
| ---------- | ------------------------- | ---------------------- | ------------------------------ | -------- | ------------------- | --------------------- | ------- | ----- |
| `row` base | `data-hovered:bg-mist/60` | `data-pressed:bg-mist` | 2px brand outline, offset -2px | n/a      | Button not disabled | Child content decides | n/a     | n/a   |

- **Accessibility/RTL:** React Aria button `onPress`; no separate aria label, so contents provide its name. Padding is physical `px-4`; text direction follows inherited locale.

### CategoryRow

- **Path/purpose:** Internal function in `src/features/menu/components/overlays/search-overlay.tsx`; category name and product count.
- **Props:** `category: Category`, `locale`, `onPress`.
- **DOM/layout:** `ResultRow` with localized name and product count; uses `rowCategory`, `rowName`, `rowCount`.

**State matrix**

| Default         | Hover            | Pressed/active     | Focus-visible    | Selected          | Disabled | Out-of-stock | Loading | Empty |
| --------------- | ---------------- | ------------------ | ---------------- | ----------------- | -------- | ------------ | ------- | ----- |
| Min height 48px | Shared row hover | Shared row pressed | Shared row focus | No selected style | n/a      | n/a          | n/a     | n/a   |

- **Accessibility/RTL:** Button accessible name includes category and count; count uses tabular numerals.

### PairingRow

- **Path/purpose:** Internal function in `src/features/menu/components/overlays/search-overlay.tsx`; pairing thumbnails, joined name, and final/regular price.
- **Props:** `pairing: Pairing`, `locale`, `formatMoney`, `onPress`.
- **DOM/layout:** `ResultRow` contains thumbnail rail, joined title, price. Uses `rowRich`, `pairThumbs`, `pairThumb`, `grayscale`, `unavailable`.

**State matrix**

| Default                       | Hover            | Pressed/active     | Focus-visible    | Selected | Disabled | Out-of-stock                                                                            | Loading                   | Empty                                               |
| ----------------------------- | ---------------- | ------------------ | ---------------- | -------- | -------- | --------------------------------------------------------------------------------------- | ------------------------- | --------------------------------------------------- |
| Two-line row, 32px thumbnails | Shared row hover | Shared row pressed | Shared row focus | n/a      | n/a      | If any pairing item is unavailable, all pair thumbnails grayscale and price opacity 60% | Img placeholder/crossfade | Pairing `items` array can be empty in parser output |

- **Accessibility/RTL:** Joined names become button text; thumbnail images default to empty alt. Logical flow follows inherited direction; source data order is retained.

### ProductRow

- **Path/purpose:** Internal function in `src/features/menu/components/overlays/search-overlay.tsx`; product search result.
- **Props:** `product: Product`, `locale`, `formatMoney`, `onPress`.
- **DOM/layout:** `ResultRow` with 48px thumbnail, name, optional one-line description and out-of-stock badge, optional price.

**State matrix**

| Default                   | Hover            | Pressed/active     | Focus-visible    | Selected | Disabled | Out-of-stock                                  | Loading   | Empty                                                        |
| ------------------------- | ---------------- | ------------------ | ---------------- | -------- | -------- | --------------------------------------------- | --------- | ------------------------------------------------------------ |
| Name and optional details | Shared row hover | Shared row pressed | Shared row focus | n/a      | n/a      | Thumbnail grayscale; badge; price opacity 60% | Img state | Missing description/price omitted; missing image placeholder |

- **Accessibility/RTL:** Result row is a React Aria button. Image is decorative by default; name gives button text. Description is clamped to one line.

### CategorySheet

- **Path/purpose:** `src/features/menu/components/sheets/category-sheet.tsx`; bottom-sheet category picker.
- **Props:** `strings: {close, categories, categoriesDescription}`, `locale`, `isOpen`, `categories`, `activeId`, `onClose`, `onPick(categoryId)`.
- **DOM:** `<BottomSheet><div list><Button aria-current?><span name/><span count/></Button>…</div></BottomSheet>`.
- **Layout/classes:**

```text
list: "flex flex-col gap-1"
item: "flex min-h-12 w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-start outline-none data-focus-visible:-outline-offset-2 data-focus-visible:outline-2 data-focus-visible:outline-brand data-hovered:bg-mist/60 data-pressed:bg-mist"
itemActive: "bg-arctic"
name: "min-w-0 text-body text-balance"
nameActive: "font-semibold"
nameIdle: "font-medium"
count: "shrink-0 text-caption font-medium tabular-nums text-navy/65"
```

- **Colors:** active item arctic `#CFE3E8`; hover/pressed mist unresolved; focus outline brand; count navy 65%.

**State matrix**

| Default       | Hover                     | Pressed/active         | Focus-visible | Selected                                     | Disabled              | Out-of-stock | Loading | Empty                                      |
| ------------- | ------------------------- | ---------------------- | ------------- | -------------------------------------------- | --------------------- | ------------ | ------- | ------------------------------------------ |
| Category rows | `data-hovered:bg-mist/60` | `data-pressed:bg-mist` | Brand outline | `aria-current="true"`, `bg-arctic`, semibold | No disabled condition | n/a          | n/a     | Empty category list gives empty sheet list |

- **Accessibility/RTL:** Each row is a React Aria button; active row uses `aria-current="true"`. Counts are tabular. BottomSheet title/description provide dialog labels. Logical text alignment is `text-start`.

### ProductSheet

- **Path/purpose:** `src/features/menu/components/sheets/product-sheet.tsx`; product details, options, related items, and sticky price footer.
- **Props:** `product: Product`, `strings: {itemDescription, outOfStock, oftenOrdered, openItem(name), size, baristaWay, baristaSub, addOns}`, `locale`, `formatMoney`, `isOpen: boolean`, `onClose`, `onOpenProduct(productId)`.
- **DOM:** `<BottomSheet footer><div content><SwapAnimation><div hero><Img/><Badge out-of-stock?/ ></div></SwapAnimation><SwapAnimation intro?>...<BaseOptions/><section related?><div rail><OftenOrderedCard…/></div></section>?</div></BottomSheet>`.
- **Layout/classes:**

```text
content: "flex flex-col gap-6"
hero: "relative"
heroImage: "aspect-square w-full rounded-lg"
heroBadge: "absolute end-2 top-2"
grayscale: "grayscale"
intro: "flex flex-col items-start gap-2"
description: "text-small font-medium text-pretty text-navy/65"
related: "flex flex-col gap-2"
relatedTitle: "text-body font-bold"
relatedRail: "no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:-mx-6 md:px-6"
```

- **Colors:** product image placeholder `arctic/40`; description navy 65%; stock image grayscale and badge; footer price bar brand/white or disabled button.

**State matrix**

| Default                                             | Hover          | Pressed/active | Focus-visible  | Selected                                       | Disabled                              | Out-of-stock                                                                 | Loading                    | Empty                                                                                           |
| --------------------------------------------------- | -------------- | -------------- | -------------- | ---------------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------- |
| First size selected if present; no add-ons selected | Child controls | Child controls | Child controls | Size/add-on selections retained in local state | BaseOptions disabled when unavailable | Footer shows disabled “Out of stock”; hero grayscale/badge; options disabled | Hero image opacity loading | Description/intro and related section omitted when no data; BaseOptions omitted when no choices |

- **Motion/accessibility/RTL:** BottomSheet provides dialog/drag behavior. Product-sheet state resets because parent keys it by an incrementing open key. `SwapAnimation` wraps hero/intro on product id; intro omitted without badge and description. Often-ordered section is labelled and horizontally scrollable. Footer is fixed within sheet; no add-to-cart action is present in this component. Locale controls name/description/options.

### OftenOrderedCard

- **Path/purpose:** Internal function in `src/features/menu/components/sheets/product-sheet.tsx`; related product mini-card.
- **Props:** `product: ProductRef`, `locale`, `formatMoney`, `openLabel`, `onOpen`.
- **DOM:** `<div><div frame><Img/><Badge out-of-stock?/ ></div><span name/><span footer><Price/><Chevron/></span><Button action/></div>`.
- **Layout/classes:**

```text
root: "relative flex w-28 shrink-0 flex-col gap-1 rounded-md border border-arctic bg-white p-2 text-start"
frame: "relative"
image: "h-16 w-full rounded-md"
grayscale: "grayscale"
outOfStockBadge: "absolute end-1 top-1"
name: "line-clamp-2 min-h-[2lh] text-caption font-medium text-balance"
nameUnavailable: "text-navy/60"
footer: "flex items-center justify-between gap-1"
unavailable: "opacity-60"
action: "absolute inset-0 z-10 rounded-md outline-none data-focus-visible:outline-2 data-focus-visible:-outline-offset-2 data-focus-visible:outline-brand"
```

- **Colors:** white background, arctic border, unavailable text navy 60%, opacity 60%, focus outline brand.

**State matrix**

| Default    | Hover          | Pressed/active   | Focus-visible | Selected | Disabled | Out-of-stock                                          | Loading   | Empty                                                                      |
| ---------- | -------------- | ---------------- | ------------- | -------- | -------- | ----------------------------------------------------- | --------- | -------------------------------------------------------------------------- |
| 112px card | No hover style | No pressed style | Brand outline | n/a      | n/a      | Grayscale image, out-of-stock badge, muted name/price | Img state | Missing image placeholder; price falls back to 0 if pricing options absent |

- **Accessibility/RTL:** Full-card button uses localized `openLabel`; Chevron is decorative. Direction follows parent.

### PairingSheet

- **Path/purpose:** `src/features/menu/components/sheets/pairing-sheet.tsx`; pairing detail sheet with separate options state per item.
- **Props:** `pairing: Pairing`, `strings: {itemDescription, outOfStock, saveChip(amount), size, baristaWay, baristaSub, addOns}`, `locale`, `formatMoney`, `isOpen: boolean`, `onClose`.
- **DOM:** `<BottomSheet footer><div content><div pictures><Img…/></div><div intro><Badge…/></div>?<BaseOptions… per product/></div></BottomSheet>`.
- **Layout/classes:**

```text
content: "flex flex-col gap-6"
pictures: "flex gap-2"
picture: "aspect-square flex-1 rounded-lg"
grayscale: "grayscale"
intro: "flex flex-col items-start gap-2"
```

- **Colors:** image placeholder arctic/40; discount chip arctic/navy; unavailable uses out-of-stock badge and disabled footer; option component styles are under `BaseOptions`.

**State matrix**

| Default                                            | Hover         | Pressed/active | Focus-visible | Selected                         | Disabled                                     | Out-of-stock                                                                                                | Loading     | Empty                                                                  |
| -------------------------------------------------- | ------------- | -------------- | ------------- | -------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| First price option per pairing item; add-ons empty | Child options | Child options  | Child options | Per-item selected option/add-ons | BaseOptions disabled if any item unavailable | Unavailable product image grayscale; sheet displays out-of-stock badge and disabled footer; no savings chip | Img loading | Empty items yields blank pictures/options and total from pairing price |

- **Motion/accessibility/RTL:** Vaul BottomSheet. Parent supplies an incrementing `key` on each open, so pairing local state initializes fresh; separate option/add-on arrays per product. Total is base pairing final plus each item’s size upgrade and selected add-ons. Images preserve item order.

### BaseOptions

- **Path/purpose:** `src/features/menu/components/sheets/base-options.tsx`; reusable size radio group, barista toggle, and add-on checkbox group.
- **Props:** `product`, `strings: {size, baristaWay, baristaSub, addOns}`, `locale`, `formatMoney`, `selectedOptionId: string|null`, `selectedAddOnIds: string[]`, `onSelectOption`, `onSelectAddOns`, `showProduct?: boolean`, `isDisabled?: boolean`.
- **DOM:** optional product header; optional `<RadioGroup><Label/><div><Radio…/></div></RadioGroup>`; optional `<ToggleButton>`; optional `<CheckboxGroup><Label/><Checkbox…/></CheckboxGroup>`. Returns `null` when no sizes/barista/add-ons.
- **Layout/classes:**

```text
root: "flex flex-col gap-4"
productHeader: "flex items-center gap-3"
productImage: "size-12 shrink-0 rounded-md"
productName: "min-w-0 flex-1 text-body font-semibold text-balance"
grayscale: "grayscale"
group: "flex flex-col gap-2"
groupLabel: "text-body font-bold"
sizes: "grid auto-cols-fr grid-flow-col gap-2"
size: "flex min-h-12 flex-col items-center justify-center rounded-full border border-sand/70 px-2 py-1 text-center outline-none transition-colors duration-200 motion-reduce:transition-none data-hovered:bg-mist data-selected:border-brand data-selected:bg-brand data-selected:text-white data-disabled:opacity-50 data-focus-visible:outline-2 data-focus-visible:outline-offset-2 data-focus-visible:outline-brand"
sizeName: "text-small font-medium"
sizePrice: "text-caption tabular-nums"
oldPrice: "me-1 line-through opacity-70"
barista: "group flex min-h-14 w-full items-center gap-3 rounded-lg border-2 border-taupe bg-transparent px-4 py-2 text-start text-charcoal outline-none transition-[background-color,border-color,color] duration-200 motion-reduce:transition-none data-hovered:bg-sand/20 data-selected:border-brand data-selected:bg-brand data-selected:text-white data-disabled:opacity-50 data-focus-visible:outline-2 data-focus-visible:outline-offset-2 data-focus-visible:outline-brand"
baristaIcon: "size-6 shrink-0"
baristaText: "flex min-w-0 flex-1 flex-col"
baristaTitle: "text-small font-bold"
baristaSub: "text-caption font-medium text-taupe group-data-selected:text-white/80"
baristaCheck: "flex size-6 shrink-0 items-center justify-center rounded-sm border-2 border-taupe/60 transition-colors duration-200 group-data-selected:border-white/80 group-data-selected:bg-white group-data-selected:text-brand motion-reduce:transition-none"
addOnsLabel: "pb-2 text-body font-bold"
addOn: "group flex min-h-14 w-full items-center gap-4 border-b-[0.5px] border-sand/30 py-2 text-start outline-none transition-colors duration-200 last:border-b-0 data-hovered:bg-mist/60 data-disabled:opacity-50 data-focus-visible:outline-2 data-focus-visible:outline-brand motion-reduce:transition-none"
addOnBox: "flex size-6 shrink-0 items-center justify-center rounded-sm border-2 border-taupe/60 transition-colors duration-200 group-data-selected:border-brand group-data-selected:bg-brand group-data-selected:text-white motion-reduce:transition-none"
addOnName: "min-w-0 flex-1 text-body font-medium group-data-selected:font-semibold"
addOnPrice: "shrink-0 text-end"
tick: "size-4 scale-50 opacity-0 transition-[opacity,transform] duration-150 group-data-selected:scale-100 group-data-selected:opacity-100 motion-reduce:transition-none"
```

- **Colors:** option border sand 70%; selected brand/white; hover mist unresolved; barista idle taupe border/text, sand hover; selected brand/white with subtext white 80%; checkbox taupe/60 idle, brand/white selected; add-on divider sand/30.

**State matrix**

| Default                            | Hover                                       | Pressed/active                                                               | Focus-visible                                              | Selected                                                                                  | Disabled                                                      | Out-of-stock                                                        | Loading | Empty                                                           |
| ---------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------- | ------- | --------------------------------------------------------------- |
| Radio/add-on default; check hidden | radio mist; barista sand/20; add-on mist/60 | RAC press behavior, no dedicated pressed class except inherited option state | Brand 2px outline for radio/toggle; checkbox brand outline | `data-selected` radio brand pill; toggle brand surface; checkbox checkmark grows/fades in | `data-disabled:opacity-50`; parent marks all options disabled | `product.availability` controls disabled prop when called by sheets | n/a     | Entire component returns null if all three option groups absent |

- **Accessibility/RTL:** React Aria `RadioGroup`, `Radio`, `ToggleButton`, `CheckboxGroup`, `Checkbox`, and `Label` supply semantics and keyboard behavior. Radio labels include size and price; checkbox label includes add-on name and plus price. Barista option checks all its IDs selected. In RTL, logical `me-1` and `text-end` mirror; icon order remains source order.

### BottomSheet

- **Path/purpose:** `src/features/menu/components/sheets/bottom-sheet.tsx`; shared Vaul drawer frame with title, drag handle, optional fixed footer.
- **Props:** `strings: {title, description}`, `isOpen`, `onClose`, `footer?: ReactNode`, `children`.
- **DOM:** `<VaulDrawer.Root><Portal><Overlay/><Content><MenuButton close/><div handleRow><Handle/></div><div body><Title/><Description/>{children}</div>{footer?}</Content></Portal></Root>`.
- **Layout/classes:**

```text
overlay: "fixed inset-0 z-50 bg-scrim transition-opacity duration-(--duration-interactive) ease-smooth data-[state=open]:opacity-100 data-[state=closed]:!pointer-events-none data-[state=closed]:opacity-0 motion-reduce:transition-none"
content: "fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[88dvh] w-full max-w-120 flex-col overflow-clip rounded-t-sheet border-t border-sand/50 bg-cream text-charcoal outline-none md:max-w-140"
close: "absolute end-2 top-1 z-10"
handleRow: "relative z-0 flex h-10 w-full shrink-0 items-center justify-center"
handle: "cursor-grab touch-none rounded-full !bg-charcoal/60 [&_[data-vaul-handle-hitarea]]:!h-20 [&_[data-vaul-handle-hitarea]]:!w-999 hover:!bg-charcoal/70 active:cursor-grabbing active:!bg-charcoal/80"
body: "flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 pb-6 md:px-6"
header: "mb-5 pe-12"
title: "text-title font-bold text-balance text-charcoal"
description: "sr-only"
footer: "shrink-0 border-t-[0.5px] border-sand/40 bg-cream px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] md:px-6"
```

- **Colors:** scrim uses `#292721` 60%; content/ footer cream; text charcoal; top border sand 50%; footer divider sand 40%; handle charcoal 60%/70%/80%.

**State matrix**

| Default                   | Hover                     | Pressed/active                      | Focus-visible             | Selected | Disabled | Out-of-stock       | Loading           | Empty                                                 |
| ------------------------- | ------------------------- | ----------------------------------- | ------------------------- | -------- | -------- | ------------------ | ----------------- | ----------------------------------------------------- |
| Closed/open from `isOpen` | Handle hover charcoal/70% | Handle cursor grabbing/charcoal/80% | Close button focus styles | n/a      | n/a      | Child/footer state | Vaul drawer state | Footer omitted when absent; body content may be empty |

- **Animation/accessibility/RTL:** Vaul `Drawer.Root`, `Portal`, `Overlay`, `Content`, `Handle`, `Title`, `Description`; `handleOnly`, no background scaling, no input repositioning. `onOpenChange(false)` invokes `onClose`. Handle is the only drag area. Content is bottom-fixed and body scroll is contained. Explicit app close button plus Vaul dismiss gestures close it. Dialog/focus-trap/scroll-lock implementation is delegated to Vaul; no custom focus handler is present. `end`/`pe` are logical RTL positions.

### PromoPopup

- **Path/purpose:** `src/features/menu/components/overlays/promo-popup.tsx`; delayed, image-only dismissible promotion.
- **Props:** `popup: Popup`, `busy: boolean`.
- **DOM:** conditional `<ModalOverlay><Modal><Dialog><img/><MenuButton close/></Dialog></Modal></ModalOverlay>`.
- **Layout/classes:**

```text
overlay: "fixed inset-0 z-50 flex items-center justify-center bg-scrim p-4 data-entering:animate-scrim-in data-exiting:animate-scrim-out motion-reduce:animate-none"
modal: "relative outline-none data-entering:animate-reveal-in data-exiting:animate-reveal-out motion-reduce:animate-none"
dialog: "outline-none"
image: "block h-auto max-h-[80dvh] w-auto max-w-[min(28rem,calc(100vw-2rem))] rounded-lg bg-white object-contain"
close: "absolute end-1 top-1 z-10"
```

- **Colors:** scrim `#292721` at 60%; image fallback background white; close button uses MenuButton close styling.

**State matrix**

| Default            | Hover       | Pressed/active | Focus-visible                       | Selected | Disabled | Out-of-stock | Loading                                     | Empty                                     |
| ------------------ | ----------- | -------------- | ----------------------------------- | -------- | -------- | ------------ | ------------------------------------------- | ----------------------------------------- |
| Closed until ready | Close child | Close child    | Modal/button library focus handling | n/a      | n/a      | n/a          | Waits for image load and delay concurrently | Returns null if disabled or image is null |

- **Animation/accessibility/RTL:** React Aria `ModalOverlay`, `Modal`, `Dialog`; `isDismissable`. Open only after image loads and timer elapsed, while not dismissed and `busy` is false. Load error suppresses popup. Close button and overlay dismissal set dismissed config key. Escape/outside dismissal comes from React Aria modal behavior; image `alt=""`, close button is accessible via MenuButton’s close icon? **NOT FOUND:** this popup does not pass a visible or aria-label string to its close `MenuButton`; the button’s icon is aria-hidden and no text child is rendered. Logical `end` positions close control.

### LoadingState

- **Path/purpose:** `src/features/menu/components/states/loading-state.tsx`; initial load status.
- **Props:** `strings: {title: string; description?: string}`, `className?`.
- **DOM:** `<section><Background/><style keyframes/><div content><div aria-hidden iconWrapper><Icon cup/><Icon cup/></div><h2/><p?/ ></div></section>`.
- **Layout/classes:**

```text
section: "relative isolate flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-12 text-center"
content: "relative z-10 flex w-full max-w-md flex-col items-center"
iconWrapper: "relative w-32 h-32 mb-8 flex items-center justify-center"
iconBase: "absolute inset-0 text-sand"
iconFill: "absolute inset-0 text-brand loading-cup-fill motion-reduce:animate-none"
title: "text-title font-bold text-charcoal text-balance"
description: "mt-3 max-w-sm text-body text-taupe text-balance"
```

- **Colors:** base cup sand `#D8C8B2`; animated cup brand `#005569`; heading charcoal; description taupe.

**State matrix**

| Default                            | Hover | Pressed/active | Focus-visible | Selected | Disabled | Out-of-stock | Loading                     | Empty                           |
| ---------------------------------- | ----- | -------------- | ------------- | -------- | -------- | ------------ | --------------------------- | ------------------------------- |
| Centered loading illustration/copy | n/a   | n/a            | n/a           | n/a      | n/a      | n/a          | Liquid clip-path loop, 2.5s | Description omitted when falsey |

- **Motion/accessibility/RTL:** CSS keyframes in component: clip path is empty at 0–15% and 85–100%, full at 45–55%; animation uses smooth easing. Reduced motion freezes cup fill. Both cup icons are hidden as one decorative wrapper; section fills at least dynamic viewport height.

### ErrorState

- **Path/purpose:** `src/features/menu/components/states/error-state.tsx`; generic/network error copy and retry action.
- **Props:** `strings: {title, description, retry: string}`, `onRetry`, `className?`.
- **DOM:** `<section><Background/><div><p>Error</p><h2/><p/><Button/></div></section>`.
- **Layout/classes:**

```text
section: "relative isolate flex min-h-dvh flex-col items-center justify-center min-h-[60dvh] overflow-hidden px-6 py-12 text-center"
content: "relative z-10 flex w-full max-w-md flex-col items-center"
code: "text-[clamp(5rem,30vw,8rem)] leading-none font-bold tracking-tight text-brand"
title: "mt-5 text-title font-bold text-charcoal text-balance"
description: "mt-3 max-w-xs text-body text-taupe text-balance"
button: "mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-brand px-8 text-small font-bold text-cream transition-colors duration-(--duration-interactive) ease-smooth hover:bg-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand data-[pressed]:opacity-80 motion-reduce:transition-none"
```

- **Colors:** brand `Error` code and button; charcoal title; taupe description; cream button text; hover navy.

**State matrix**

| Default                   | Hover                  | Pressed/active              | Focus-visible     | Selected | Disabled     | Out-of-stock | Loading                 | Empty                |
| ------------------------- | ---------------------- | --------------------------- | ----------------- | -------- | ------------ | ------------ | ----------------------- | -------------------- |
| Error code/copy and retry | Button `hover:bg-navy` | `data-[pressed]:opacity-80` | 2px brand outline | n/a      | Not disabled | n/a          | Separate loading branch | Strings are required |

- **Motion/accessibility/RTL:** Retry is React Aria `Button` with `onPress`. `min-h-dvh` and `min-h-[60dvh]` are both present; which declaration wins depends on generated CSS ordering, so source does not establish a deliberate 60dvh minimum. No custom direction; document locale font/dir applies.

### Background

- **Path/purpose:** `src/features/menu/components/states/background.tsx`; decorative fixed SVG pattern and gradient veil.
- **Props:** `className?: string`.
- **DOM:** `<div aria-hidden style backgroundColor><div band style height><svg><defs><pattern><g><rect/path/circle…/></g></pattern></defs><rect/></svg><div style backgroundImage/></div></div>`.
- **Layout/classes:**

```text
root: "pointer-events-none fixed inset-0 -z-10 overflow-hidden"
band: "absolute inset-x-0 top-0"
layer: "absolute inset-0 size-full"
```

- **Inline values:** base is `color-mix(in srgb, var(--color-cream) 60%, var(--color-sand))`; approximate sRGB `#E8DDCC`. Band height 75dvh. Veil glow size 70% 42%, center 50% 30%, strength 90%, fade starts at 50%. SVG tile 120px scaled to 90px; pattern is 3 columns; x/y offsets -30/-10; six semicircle radii `[12,21,30,39,48,57]`, stroke 4px.
- **Opacity:** highlight .9, wave .5, arch .9, rings .14, quarter base .6, quarter highlight .55, moon base .35, moon disc .7, moon half .12, pill .8. Pattern uses theme cream/sand/arctic/brand values listed in §2.

**State matrix**

| Default                  | Hover | Pressed/active | Focus-visible | Selected | Disabled              | Out-of-stock | Loading               | Empty |
| ------------------------ | ----- | -------------- | ------------- | -------- | --------------------- | ------------ | --------------------- | ----- |
| Decorative fixed artwork | n/a   | n/a            | n/a           | n/a      | `pointer-events-none` | n/a          | Used by loading/error | n/a   |

- **Accessibility/RTL:** `aria-hidden="true"` and pointer-events disabled; generated unique SVG pattern id via `useId`. Pattern itself is not mirrored in RTL.

### Badge

- **Path/purpose:** `src/features/menu/components/ui/badge.tsx`; localized label badges and arbitrary detail/savings content.
- **Props:** label kind `top | new | outOfStock` accepts `compact?`, `outlined?`, `className?` and no children; content kind `detail | savings` (default detail) requires `children: ReactNode`.
- **DOM:** `<span><span star icon?>{label or children}</span>`.
- **Layout/classes:**

```text
base: "inline-flex max-w-full items-center gap-1 rounded-full text-caption"
regular: "min-h-6 px-3 py-1"
compact: "min-h-5 px-2 py-0.5"
label: "shrink-0 leading-none whitespace-nowrap"
content: "text-balance tabular-nums"
outlined: "ring-1 ring-white"
stockOutline: "ring-1 ring-navy/30"
star: "size-3 shrink-0"
```

Kind styles: `detail: "bg-cream font-medium text-charcoal"`; `savings: "bg-arctic font-semibold text-navy"`; `top: "bg-sand font-semibold text-charcoal"`; `new: "bg-brand font-semibold text-white"`; `outOfStock: "bg-white/85 font-semibold text-navy"`.

**State matrix**

| Default               | Hover | Pressed/active | Focus-visible | Selected | Disabled | Out-of-stock                            | Loading | Empty                                                        |
| --------------------- | ----- | -------------- | ------------- | -------- | -------- | --------------------------------------- | ------- | ------------------------------------------------------------ |
| Kind-specific surface | n/a   | n/a            | n/a           | n/a      | n/a      | Localized label, white/85, navy/30 ring | n/a     | Content badge requires children; labels have built-in string |

- **Accessibility/RTL:** `<span>` not interactive; top badge includes decorative star, localized labels come from `config.badges`. No explicit aria-label. Logical parent positioning handles RTL.

### Chevron

- **Path/purpose:** `src/features/menu/components/ui/chevron.tsx`; decorative arrow in a circular arctic surface.
- **Props:** `size?: "s" | "m" | "l"` default `l`; `className?`.
- **DOM:** `<span aria-hidden><Icon name="arrow"/></span>`.
- **Classes:** root `"flex shrink-0 items-center justify-center rounded-full bg-arctic/60 text-brand"`; sizes: `s` root `"size-6"`/icon `"size-3"`; `m` root `"size-7"`/icon `"size-4"`; `l` root `"size-8"`/icon `"size-4"`.

**State matrix**

| Default                 | Hover | Pressed/active | Focus-visible | Selected | Disabled | Out-of-stock | Loading | Empty |
| ----------------------- | ----- | -------------- | ------------- | -------- | -------- | ------------ | ------- | ----- |
| Arctic 60%, brand arrow | n/a   | n/a            | n/a           | n/a      | n/a      | n/a          | n/a     | n/a   |

- **Accessibility/RTL:** Entire chevron is aria-hidden; shared Icon mirrors the arrow in RTL.

### Heading

- **Path/purpose:** `src/features/menu/components/ui/heading.tsx`; section/subheading and sheet title renderer.
- **Props:** `children: ReactNode`, `className?`; section variant optional/default with `sub?`, or required `variant: "sheet"`.
- **DOM:** section variant `<div><h2/><p?/ ></div>`; sheet variant `<h2 data-sheet-title/>`.
- **Classes:** section `"flex flex-col gap-1"`; title `"text-title font-bold text-balance text-charcoal"`; sub `"text-small font-medium text-navy/80"`.

**State matrix**

| Default                  | Hover | Pressed/active | Focus-visible | Selected | Disabled | Out-of-stock | Loading | Empty                      |
| ------------------------ | ----- | -------------- | ------------- | -------- | -------- | ------------ | ------- | -------------------------- |
| Title; optional subtitle | n/a   | n/a            | n/a           | n/a      | n/a      | n/a          | n/a     | Subtitle omitted if falsey |

- **Accessibility/RTL:** Section title is h2; sheet title is h2 with `data-sheet-title`, referenced by Vaul Drawer Title in the base. Text balance and inherited direction apply.

### Img

- **Path/purpose:** `src/features/menu/components/ui/img.tsx`; loading/broken-image placeholder frame.
- **Props:** `image: string|null`, `alt?` default `""`, `priority?`, `className?`.
- **DOM:** `<div frame>{image && state!=="broken" ? <img/> : null}</div>`.
- **Classes:** frame `"relative overflow-hidden bg-arctic/40"`; photo `"absolute inset-0 size-full object-cover transition-opacity duration-(--duration-interactive) ease-smooth motion-reduce:transition-none"`; shown `"opacity-100"`; hidden `"opacity-0"`.

**State matrix**

| Default                | Hover | Pressed/active | Focus-visible | Selected | Disabled | Out-of-stock             | Loading                              | Empty                                                  |
| ---------------------- | ----- | -------------- | ------------- | -------- | -------- | ------------------------ | ------------------------------------ | ------------------------------------------------------ |
| Placeholder background | n/a   | n/a            | n/a           | n/a      | n/a      | Parent applies grayscale | Image opacity 0; on load opacity 100 | `null` image shows frame only; broken image is removed |

- **Motion/accessibility/RTL:** Eager/high priority only for `priority`; otherwise lazy; async decode and `draggable=false`. A changed URL resets state to loading. Alt is caller-provided, defaults empty.

### MenuButton

- **Path/purpose:** `src/features/menu/components/ui/menu-button.tsx`; shared primary, secondary, and close controls.
- **Props:** shared `onPress?`, `isDisabled?`, `className?`; primary optional variant/default with `children`, `type?`, `width?`, `compact?`, `short?`; secondary required variant and text props; close required variant, `size?: "s"|"m"`.
- **DOM:** text variant React Aria `<Button>{children}</Button>`; close variant `<Button><span aria-hidden><Icon close/></span></Button>`.
- **Classes:**

```text
base: "flex shrink-0 items-center justify-center rounded-full transition-[transform,background-color,border-color] duration-(--duration-interactive) ease-smooth data-disabled:cursor-default data-disabled:opacity-50 motion-reduce:transition-none"
primary: "bg-brand text-center font-bold text-white data-hovered:bg-navy data-pressed:scale-[0.98]"
secondary: "h-12 gap-2 border border-brand bg-transparent px-4 text-center text-small font-semibold text-brand data-hovered:bg-brand/5 data-pressed:scale-[0.98] data-pressed:bg-brand/10"
focus: "outline-none data-focus-visible:outline-2 data-focus-visible:outline-offset-2 data-focus-visible:outline-brand"
full: "w-full"
auto: "w-auto"
tall: "h-14"
short: "h-12"
regular: "px-4 text-heading"
compact: "px-3 text-body sm:text-heading"
close: "group size-12 outline-none"
closeSurface: "flex items-center justify-center rounded-full bg-white/85 text-navy transition-[transform,background-color] duration-(--duration-interactive) ease-smooth group-data-hovered:bg-white group-data-pressed:scale-90 group-data-focus-visible:outline-2 group-data-focus-visible:outline-offset-2 group-data-focus-visible:outline-brand motion-reduce:transition-none"
```

Close `s` surface/icon `"size-7 ring-1 ring-arctic"` / `"size-3.5"`; `m` surface/icon `"size-10"` / `"size-5"`.

**State matrix**

| Default                           | Hover                                        | Pressed/active                                                  | Focus-visible                                         | Selected | Disabled                                       | Out-of-stock                                           | Loading | Empty                          |
| --------------------------------- | -------------------------------------------- | --------------------------------------------------------------- | ----------------------------------------------------- | -------- | ---------------------------------------------- | ------------------------------------------------------ | ------- | ------------------------------ |
| Variant dimensions/surfaces above | Primary navy; secondary brand/5; close white | Primary/secondary scale .98; secondary brand/10; close scale .9 | Brand 2px outline for text controls and close surface | n/a      | `data-disabled` cursor-default and opacity 50% | Product-sheet caller can disable primary footer button | n/a     | Text variants require children |

- **Motion/accessibility/RTL:** All variants React Aria `Button`, press uses `onPress`; close icon is aria-hidden and no label prop exists. Callers must provide accessible context/label; search, promo, and BottomSheet close usage does not set an aria-label in this component. Logical layout inherits locale.

### Price

- **Path/purpose:** `src/features/menu/components/ui/price.tsx`; inline formatted price, optional struck-through regular price, or full-width total bar.
- **Props:** `value: number`, `formatMoney`, `regular?: number|null`, `variant?: "inline"|"bar"`, `size?: "caption"|"small"|"body"|"heading"`, `plus?: boolean`, `rolling?: boolean` (default true only for bar), `showCurrency?: boolean` (default true), `className?: string`.
- **DOM:** Inline `<span><span><bdi or Rolling/>{regular? <bdi/>}</span></span>`; bar `<div><bdi or Rolling/></div>`. Rolling includes hidden text and aria-hidden visual digits.
- **Classes:**

```text
number: "font-bold tabular-nums"
discount: "inline-flex flex-wrap items-baseline gap-x-1.5"
struck: "text-caption font-medium text-navy/65 tabular-nums line-through"
bar: "flex h-14 w-full items-center justify-center rounded-full bg-brand px-4 text-center text-heading font-bold text-white"
rolling: "relative inline-flex items-baseline tabular-nums"
visual: "inline-flex items-baseline"
plain: "whitespace-pre"
numberGroup: "inline-flex"
slot: "inline-block h-[1lh] overflow-clip"
column: "flex flex-col transition-transform duration-300 ease-smooth motion-reduce:transition-none"
digit: "block h-[1lh]"
srOnly: "sr-only"
```

Size classes are selected by prop: `caption: "text-caption"`, `small: "text-small"`, `body: "text-body"`, `heading: "text-heading"`.

**State matrix**

| Default            | Hover | Pressed/active | Focus-visible | Selected | Disabled | Out-of-stock              | Loading                             | Empty                                                                |
| ------------------ | ----- | -------------- | ------------- | -------- | -------- | ------------------------- | ----------------------------------- | -------------------------------------------------------------------- |
| Bold tabular price | n/a   | n/a            | n/a           | n/a      | n/a      | Parent wraps with opacity | Rolling digits animate when enabled | `value` still formats as 0 if caller receives missing pricing option |

- **Accessibility/RTL:** Rolling visual is aria-hidden; complete formatted value is screen-reader-only. Inline text is wrapped in `<bdi>`; rolling number groups force `dir="ltr"`. Formatter rounds to integer and uses `Intl.NumberFormat` with locale and `numberingSystem: "latn"`, then appends currency if nonempty.

### SwapAnimation

- **Path/purpose:** `src/features/menu/components/ui/swap-animation.tsx`; keyed wrapper intended to mark changed content.
- **Props:** `value: string|number|boolean`, `children`, `block?` default false, `className?`.
- **DOM:** keyed `<span>{children}</span>`.
- **Classes:** `inline: "inline-flex"`; `block: "block w-full"`; `changed: "animate-swap-in motion-reduce:animate-none"`.

**State matrix**

| Default                 | Hover | Pressed/active | Focus-visible | Selected | Disabled | Out-of-stock | Loading | Empty |
| ----------------------- | ----- | -------------- | ------------- | -------- | -------- | ------------ | ------- | ----- |
| Inline or block wrapper | n/a   | n/a            | n/a           | n/a      | n/a      | n/a          | n/a     | n/a   |

- **Animation/gap:** value change sets internal `changed=true`; referenced `animate-swap-in` is **NOT FOUND** in theme/keyframes. No reset of `changed` to false is present. Used by ProductSheet hero and intro.

### Icon

- **Path/purpose:** `src/shared/icons/index.tsx` and `src/shared/icons/data.ts`; shared inline stroke SVG used by menu controls.
- **Props:** `name: IconName`, `size?: number` default 24, `className?`.
- **DOM:** `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d=…/></svg>`.
- **Layout/color:** default 24×24; color inherited; per-use sizing classes appear in component blocks above. Paths are authored for `arrow`, `cup`, `star`, `check`, `close`, `menu`, `search`, `plus`, `sparkle` (shared icon registry also contains instagram, pin, chat, minus, trash).

**State matrix**

| Default              | Hover        | Pressed/active | Focus-visible | Selected     | Disabled     | Out-of-stock | Loading                            | Empty |
| -------------------- | ------------ | -------------- | ------------- | ------------ | ------------ | ------------ | ---------------------------------- | ----- |
| Current-color stroke | Parent state | Parent state   | Parent state  | Parent state | Parent state | Parent state | Cup fill overlay changes clip-path | n/a   |

- **Accessibility/RTL:** Always `aria-hidden`; only `arrow` is in `FLIP_IN_RTL` (`rtl:-scale-x-100`). Other glyphs are not mirrored.

### Link

- **Path/purpose:** `src/shared/router/index.tsx`; app route wrapper around Wouter Link.
- **Props:** `href: AppRoute`, `children: ReactNode`, `className?: string`, `onClick?: () => void`.
- **DOM/layout:** `<WouterLink href className onClick>{children}</WouterLink>`; HeaderBar supplies back class from its own styles.

**State matrix**

| Default          | Hover                     | Pressed/active             | Focus-visible        | Selected | Disabled         | Out-of-stock | Loading | Empty                 |
| ---------------- | ------------------------- | -------------------------- | -------------------- | -------- | ---------------- | ------------ | ------- | --------------------- |
| Header back link | Header `hover:bg-sand/40` | Header `active:bg-sand/60` | Global focus outline | n/a      | No disabled prop | n/a          | n/a     | Children are required |

- **Accessibility/RTL:** Native anchor semantics/navigation are supplied by Wouter; screen-reader text is passed by HeaderBar. `ROUTES.landing` is `/`, and Menu route is `/menu`.

## 5. Behavior and interactions

The inspected Menu dependency chain is `src/features/menu/index.tsx`; hooks `src/features/menu/hooks/use-data.ts`, `use-menu.ts`, `use-menu-flow.ts`, `use-menu-navigation.ts`, `components/use-carousel.ts`, and `components/use-search.ts`; utility files `src/features/menu/util/pricing.ts` and `section-ids.ts`; API files `src/features/menu/api/menu.ts`, `menu-parser.ts`, and `menu-definition.ts`; and `src/features/menu/strings.ts` / `types/menu-models.ts`. Shared behavior comes from `src/shared/i18n/index.ts`, `engine.ts`, and `data.ts`; `src/shared/icons/index.tsx` and `data.ts`; `src/shared/router/index.tsx` and `data.ts`; `src/shared/api/index.ts` and `data.ts`; `src/App.tsx`; and `src/main.tsx`. `App` mounts `ReviewPage` outside the route switch, but its drawer opens only when the current route is `/review`; the public Menu route is `/menu`.

### Navigation, scroll spy, and tabs

1. `useMenu` creates section IDs in display order: predefined `signatures`, predefined `pairings`, then `category-${category.id}`. Signatures/pairings are included only if their arrays are nonempty.
2. `useMenuNavigation` initializes active ID from the first section; with no sections it is `""`. It gathers existing section elements each update, schedules scroll work by `requestAnimationFrame`, and observes body resize with `ResizeObserver`.
3. Active section is the last section whose `getBoundingClientRect().top <= measuredHeaderHeight + 16 + 2`. Header height is measured from `headerRef`; fallback is 104px. At scroll bottom, the last section wins. Scroll, resize, and body resize schedule recalculation.
4. Selecting a tab invokes `selectSection`: close any current panel, find target, compute `max(0, scrollY + target.top - offset)` where `offset = header height + 16px`, set active ID immediately, pin it, and call `window.scrollTo({top, behavior:"smooth"})`.
5. Pin lasts 2s maximum; a wheel, touchmove, or keydown outside the sticky header releases it. Native `scrollend` releases it immediately. Clicking an already aligned section within 1px does not pin.
6. HeaderNav centers the selected tab in the horizontal tab viewport by calculating the midpoint difference and interpolating `scrollLeft` for 300ms with cubic ease-out. Touchstart cancels the animation so the user can take over. Tabs stay horizontally scrollable and have no custom manual keyboard implementation.

### Carousels

- Both section rails use `snap-x snap-mandatory`; cards have `snap-start`. At `md` rails become grid (`snap-none`, overflow visible) and dots disappear.
- `useCarousel` measures each `[data-carousel-card]` against the rail’s padded leading edge (left for LTR, right for RTL), selects the nearest leading edge, and selects the last item when the last card reaches the end within 2px.
- It recalculates on rail scroll, resize, rail/item `ResizeObserver`, and after document fonts load; duplicate index updates are avoided. Active dot is a colored span, not a button, and the dot group is `aria-hidden`.
- Each dot corresponds to a product/pairing card, not a page or group of cards.

### Sheets and overlays

- **Search:** Header search sets `panel="search"`. React Aria `ModalOverlay` is dismissable; `onOpenChange(false)` calls `close`. Search dialog mounts a fresh SearchPanel/query each time. Auto-focus is set on input. Results scroll internally. No custom animation/drag handler or scroll-lock code is in the feature; modal behavior is delegated to React Aria.
- **Categories:** Categories button sets `panel="categories"`. Vaul drawer is bottom-fixed, max-height 88dvh, has contained scroll and drag handle only. Close button, Vaul `onOpenChange(false)`, or choosing an item closes it. Selecting a category then computes its section id and scrolls there.
- **Product/pairing:** Opening sets selection and increments a numeric key, then selects the corresponding panel. Closing changes panel to null while the selected object remains in state so Vaul can finish exit. A newly opened sheet receives the new key and initializes option state fresh. The footer is a price total, not a purchase/add-to-cart action.
- **Vaul details:** `handleOnly`, `shouldScaleBackground={false}`, `repositionInputs={false}`. App CSS overrides Vaul drawer/overlay timing to the interactive 200ms and sheet-enter easing. The menu classes do not attach the theme’s `animate-slide-up/down` directly; exact Vaul transform/drag thresholds are **NOT FOUND** in menu source.
- **Promo:** React Aria dismissable modal. A popup opens only if enabled, has an image, image loaded successfully, its delay timer elapsed, it has not been dismissed for the current config key, and no panel is busy. Overlay close/Escape/outside dismiss marks the current `[enabled,image,delay]` key dismissed. `busy` delays visibility while another panel is open; it does not mark dismissed. Popup image failure silently prevents opening; no error UI/retry exists.
- There is no custom focus-trap or focus-return implementation in the menu source. React Aria modal components and Vaul own their respective modal focus behavior. The menu does not manually alter document scroll locking.

### Search

- Index is rebuilt when menu or locale changes. Categories index localized category name; pairings index each localized item name; products index localized product name and description.
- Products are gathered only from category product arrays and deduplicated by product ID. A standalone signature product not included in a category is therefore not in product search unless it also appears in a category.
- Query matching is normalized substring matching: `toLocaleLowerCase(locale)`, remove Arabic tatweel U+0640 and marks U+064B–U+065F/U+0670, convert Arabic alef variants U+0622/U+0623/U+0625 to plain alef U+0627, collapse whitespace to one space, trim, then `field.includes(query)`. No stemming, tokenization, transliteration, or other Arabic letter folding is present.
- Query uses `useDeferredValue`; displayed count uses category + pairing + product result counts. Groups appear only if they have results, in fixed order Categories → Offers → Items.
- Empty normalized query shows prompt and blank live count. Nonempty query with zero results shows localized no-match text. Matching results replace these messages; the live region announces the localized item count. The clear Button is nested inside React Aria `SearchField` and has no explicit `onPress` in feature source; there is no separate clear handler.

### Language and number formatting

- Header language action switches `en`/`ar` in shared i18n and persists `PrefLang:locale` in localStorage. On init, saved `en`/`ar` wins; otherwise navigator language starting with `ar` chooses Arabic; all else chooses English. Storage access failures fall back to English during init; setLocale still updates current state and notifies listeners.
- `I18nProvider` wraps the app with current locale. Shared engine sets `<html lang>` and `<html dir>`; CSS switches font family and line-height for `[lang="ar"]`. Menu section/nav components also receive explicit `dir`.
- UI strings and category/product/add-on names/descriptions choose their `en` or `ar` value. Arrow Icon alone flips in RTL; other icons and SVG background pattern do not.
- `createMoneyFormatter` uses `Intl.NumberFormat(locale, {maximumFractionDigits:0, numberingSystem:"latn"})`, rounds values to integers, appends the provided currency code with a space, and prepends `+` when requested. Thus digits are explicitly Latin for both locales; currency placement remains after the amount.

### Loading, errors, and retry

- `useData` starts `status:"loading"`, calls `fetchMenu`, parses through `MenuParser`, and reports failure with `reportError({feature:"menu", operation:"load"})`.
- The request endpoint is `/menu` through shared `getJson` with base URL `/api` and 10,000ms timeout. `fetchMenu` retries known API errors once immediately; unknown non-`ApiError` failures are thrown without that retry. Concurrent hook instances share `pendingMenuRequest`.
- Error state is “network” only for `NETWORK_ERROR` or `TIMEOUT`; those map to network title/description/retry text. Server errors and all other failures map to generic text. Retry sets loading and increments an attempt counter to rerun loading.
- Loading shows animated cup and loading copy. Error shows the literal “Error” display, localized title/description, and retry button. No network-specific illustration or progress percent is present.

## 6. Strings

`src/features/menu/strings.ts` contains the complete Menu-owned English/Arabic string data below. Dynamic values are shown as `{name}`, `{count}`, `{amount}`, or `{query}`; count pluralization rules are noted.

| Key                                | English                                         | Arabic                                                                |
| ---------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------- |
| `config.badges.top`                | Bestseller                                      | الأكثر مبيعًا                                                         |
| `config.badges.new`                | New                                             | جديد                                                                  |
| `config.badges.outOfStock`         | Out of stock                                    | غير متوفر                                                             |
| `config.sections.signatures.label` | Signatures                                      | اختياراتنا المميزة                                                    |
| `config.sections.pairings.label`   | Pairings                                        | توليفاتنا                                                             |
| `page.title`                       | Menu                                            | القائمة                                                               |
| `header.back`                      | Back                                            | رجوع                                                                  |
| `header.search`                    | Search the menu                                 | ابحث في القائمة                                                       |
| `header.categories`                | Browse categories                               | تصفح الأقسام                                                          |
| `header.language.name` / `.lang`   | `ع` / `ar`                                      | `En` / `en`                                                           |
| `loading.title`                    | Brewing the menu                                | نجهّز القائمة                                                         |
| `loading.description`              | Just a moment while we get everything ready.    | لحظات ونكون جاهزين.                                                   |
| `errors.network.title`             | Can't reach the menu                            | تعذّر الوصول إلى القائمة                                              |
| `errors.network.description`       | Check your connection and try again.            | تحقق من اتصالك بالإنترنت وحاول مرة أخرى.                              |
| `errors.network.retry`             | Try again                                       | حاول مرة أخرى                                                         |
| `errors.generic.title`             | Something went wrong                            | حدث خطأ ما                                                            |
| `errors.generic.description`       | We couldn't load the menu. Please try again.    | تعذّر تحميل القائمة. حاول مرة أخرى.                                   |
| `errors.generic.retry`             | Try again                                       | حاول مرة أخرى                                                         |
| `signatures.sub`                   | Our most loved picks                            | الأكثر حبًا لدى ضيوفنا                                                |
| `pairings.sub`                     | Better together, for less                       | أطيب معًا وبسعر أقل                                                   |
| `pairings.savings(amount)`         | Save {amount}                                   | وفّر {amount}                                                         |
| `products.showAll(name,count)`     | Show all {name} ({count})                       | عرض كل {name} ({count})                                               |
| `sheets.close`                     | Close                                           | إغلاق                                                                 |
| `sheets.categories`                | Categories                                      | الأقسام                                                               |
| `sheets.categoriesDescription`     | Jump to a section of the menu                   | انتقل إلى قسم من القائمة                                              |
| `sheets.itemDescription`           | Item details and options                        | تفاصيل الصنف وخياراته                                                 |
| `sheets.outOfStock`                | Out of stock                                    | غير متوفر                                                             |
| `sheets.oftenOrdered`              | Often ordered with                              | يُطلب غالبًا مع                                                       |
| `sheets.openItem(name)`            | Open {name}                                     | افتح {name}                                                           |
| `sheets.size`                      | Size                                            | الحجم                                                                 |
| `sheets.baristaWay`                | The barista's way                               | طريقة الباريستا                                                       |
| `sheets.baristaSub`                | Made the way our barista recommends             | يُحضّر كما يوصي الباريستا                                             |
| `sheets.addOns`                    | Add-ons                                         | إضافات                                                                |
| `sheets.saveChip(amount)`          | Save {amount}                                   | وفّر {amount}                                                         |
| `search.label`                     | Search the menu                                 | ابحث في القائمة                                                       |
| `search.placeholder`               | Search drinks, food and offers                  | ابحث عن مشروب أو طعام أو عرض                                          |
| `search.clear`                     | Clear search                                    | مسح البحث                                                             |
| `search.close`                     | Close search                                    | إغلاق البحث                                                           |
| `search.prompt`                    | Start typing to search the menu                 | ابدأ الكتابة للبحث في القائمة                                         |
| `search.noMatch(query)`            | No results for "{query}"                        | لا نتائج لـ "{query}"                                                 |
| `search.itemsCount(count)`         | `{count} item` for 1, otherwise `{count} items` | 1: عنصر واحد; 2: عنصران; 3–10: `{count} عناصر`; >10: `{count} عنصرًا` |
| Hardcoded error-state code         | Error                                           | Error                                                                 |
| `search.groupCategories`           | Categories                                      | الأقسام                                                               |
| `search.groupOffers`               | Offers                                          | العروض                                                                |
| `search.groupItems`                | Items                                           | الأصناف                                                               |

Product/category/add-on names, descriptions, size labels and category data are localized from API data (`Localized<string>`), not hardcoded in the Menu string table. Badge top/new/out-of-stock labels are selected via shared `config.badges`.

## 7. Data shape

Types are declared in `src/features/menu/types/menu-models.ts`; raw API types are in `src/features/menu/api/menu-definition.ts`. `Localized<T>` is `{en:T; ar:T}`.

| Type             | Compact shape                                                                                                                                                                                             | Missing/null behavior in the UI/parser                                                                                                                                                                                                                                                      |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Menu`           | `{updatedAt:string; currency:string; badges:BadgeKind[]; categories:Category[]; signatures:Product[]; pairings:Pairing[]; popup:Popup; productMap:Record<string,Product>; addOnMap:Record<string,AddOn>}` | `signatures`/`pairings` empty arrays omit sections. `categories` render as given. Popup hidden if disabled or image null. `updatedAt`, `badges`, `addOnMap` are not directly displayed by Menu components; `productMap` resolves often-ordered products.                                    |
| `Category`       | `{id:string; name:Localized<string>; products:Product[]}`                                                                                                                                                 | Empty product array still renders category heading and empty grid. Count uses array length. No missing/null guard for id/name.                                                                                                                                                              |
| `Product`        | `ProductRef & {description:Localized<string>; addOns:AddOn[]; baristaWay:AddOn[]; oftenOrderedWith:ProductRef[]}`                                                                                         | Null image gives empty placeholder. Description omitted if empty. Badge null omits badge when available. Out-of-stock overrides product badge with out-of-stock label; image is grayscale and price muted; sheet disables options and replaces total bar with disabled out-of-stock button. |
| `ProductRef`     | `{id:string; name:Localized<string>; image:string                                                                                                                                                         | null; availability:Availability; badge:BadgeKind                                                                                                                                                                                                                                            | null; pricing:Pricing}`                                                                                                                                                                    | Related cards/search use first price option; no option falls back to 0 from `getProductPrice`. |
| `PriceOption`    | `{id:string; name:Localized<string>                                                                                                                                                                       | null; price:number; discount:number; final:number}`                                                                                                                                                                                                                                         | Null name yields no size name text. Positive discount shows `price` as struck regular price when UI passes `regular`; final is shown as current price.                                     |
| `Pricing`        | `{type:"single"                                                                                                                                                                                           | "sizes"; options:PriceOption[]}`                                                                                                                                                                                                                                                            | BaseOptions renders size radios only for `type:"sizes"`. Product cards display first option only. `getSelectedOption` falls back to first option; none returns undefined and totals use 0. |
| `Pairing`        | `{id:string; items:Product[]; pricing:PairingPricing}`                                                                                                                                                    | Available only if every item is in stock (`[].every` is true). Positive discount enables savings chip; unavailable suppresses it. Zero/missing items still use pairing pricing but render no item thumbnails/names/options.                                                                 |
| `PairingPricing` | `{price:number; discount:number; final:number}`                                                                                                                                                           | `price` shown as regular only when discount positive; `final` is total base. Option upgrades/add-ons are added in sheet.                                                                                                                                                                    |
| `AddOn`          | `{id:string; name:Localized<string>; price:number}`                                                                                                                                                       | Parser resolves IDs against addOnMap; null/missing ID list becomes empty; unresolved IDs are filtered out. Add-on price is shown with plus and added to selected total.                                                                                                                     |
| `Popup`          | `{enabled:boolean; image:string                                                                                                                                                                           | null; delaySeconds:number}`                                                                                                                                                                                                                                                                 | Missing image/disabled hides popup. Nonfinite/negative delay is clamped to 0 at popup runtime. Image load error prevents display.                                                          |
| `Availability`   | `"in_stock"                                                                                                                                                                                               | "out_of_stock"`                                                                                                                                                                                                                                                                             | Stock state affects badge, grayscale, price opacity, option disabled state, and footer as above.                                                                                           |
| `BadgeKind`      | `"new"                                                                                                                                                                                                    | "top"`                                                                                                                                                                                                                                                                                      | `Product.badge` may be null; when available, null means no badge; out-of-stock label overrides it.                                                                                         |

API raw top-level response also has the literal `ok: true` field. Raw product requires `description`, `image`, `availability`, `badge`, `addOns`, `baristaWay`, `oftenOrderedWith`, and `pricing`; `image`, `badge`, `baristaWay`, and `PriceOption.name` allow null. Parser converts null add-on/barista lists to `[]`, filters unresolved add-on/product references, derives product references, and constructs productMap from category products. No runtime optional guard exists for core required localized fields.

## 8. Responsive behavior

| Component/region          | Narrow/default                                                    | `sm` (640px)                      | `md` (768px)                                                                                                  | `lg` (1024px)     |
| ------------------------- | ----------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------- |
| HeaderBar                 | 16px logical start, 8px end                                       | —                                 | 24px start, 16px end                                                                                          | —                 |
| HeaderNav                 | Full width, horizontal masked tabs                                | —                                 | 1024px max-width container, extra category gutter                                                             | —                 |
| Signatures rail           | Horizontal snap; card width 72%, min 256px, max 384px; dots shown | Card padding 16px instead of 12px | Three-column grid, no snap/overflow, wider gutter; dots hidden                                                | Four-column grid  |
| Pairings rail             | Horizontal snap; card 80%, min 288px; dots shown                  | —                                 | Two-column grid, dots hidden                                                                                  | Three-column grid |
| ProductsSection           | One column, 16px gutters                                          | —                                 | Two columns, 24px gutters; show-all spans full row then centers at auto width/min 288px                       | Three columns     |
| SearchOverlay             | Fullscreen, full-height modal                                     | —                                 | Top starts at 8dvh with 24px outer padding; panel min(40rem,80dvh), max width 560px, rounded-lg, sheet shadow | Same md treatment |
| PromoPopup                | Image max 80dvh and min(448px, viewport minus 32px) wide          | —                                 | —                                                                                                             | —                 |
| BottomSheet               | Full width, max 480px, 88dvh high                                 | —                                 | Max width 560px, 24px body/footer gutters                                                                     | —                 |
| ProductSheet related rail | Negative 16px side margin, 16px inner padding                     | —                                 | Negative 24px margin, 24px inner padding                                                                      | —                 |
| MenuButton                | Compact text is body size                                         | Compact text becomes heading size | —                                                                                                             | —                 |
| Loading/Error             | Dynamic viewport minimum, fixed-width copy bounds                 | —                                 | —                                                                                                             | —                 |

Breakpoint values are Tailwind defaults: `sm=640px`, `md=768px`, `lg=1024px`. No Menu-specific behavior for `xl`/`2xl` was found.

## 9. Rebuild checklist and gaps

### 15 details to match

1. Keep the warm cream page/background and charcoal type; use the exact theme colors and alpha variants above.
2. Use Montserrat Variable for Latin and Montserrat/Cairo Variable fallback stack for Arabic; preserve locale-specific line heights.
3. Match the top bar at 56px and tab row at 48px; keep their shared sticky 104px header.
4. Keep header/sections centered within 1024px max width, with 16px mobile and 24px medium+ gutters.
5. Keep the logical back/search/language controls and the 48px tab pills; selected tab is charcoal with cream text and a moving shared indicator.
6. Scroll selected section to measured header height + 16px; pin selection only during programmatic smooth scroll and release on user input/scrollend.
7. Preserve section order and omit empty signatures/pairings; retain category data ordering.
8. Use mobile snap carousels with dots and convert to signature 3/4-column and pairing 2/3-column grids at md/lg.
9. Keep signatures as padded 20px-radius white translucent cards and pairing cards with joined images/plus overlay.
10. Render the `Save` chip only for positive discount and in-stock pairing; stock failure greys imagery and mutes prices.
11. Show the first four category products and reveal the remainder with 40ms stagger capped at six steps.
12. Make each product row/card a full-card action with image placeholder, optional badge/description/price, and directional chevron.
13. Match search’s full-height mobile panel, centered desktop panel, auto-focused search field, exact grouping order, count announcement, prompt and no-match states.
14. Match bottom-sheet max-height, drag handle-only behavior, safe-area footer, scrollable body, retained exit animation and fresh per-open option selections.
15. Reproduce bilingual copy and source-backed formatting exactly; price digits remain Latin, currency follows the amount, and only the arrow icon flips in RTL.

### NOT FOUND, inconsistencies, and likely bugs

- **Unresolved `mist` color:** `bg-mist` and opacity variants are used in search, category sheet, and BaseOptions, but `--color-mist` is absent from `src/index.css` and no definition exists under `src`. The document cannot assign it a HEX.
- **Unresolved `animate-swap-in`:** referenced by `SwapAnimation`, but there is no corresponding theme animation/keyframe under `src`; animation duration/easing/property cannot be resolved.
- **Close-button accessible name:** shared close `MenuButton` renders an aria-hidden icon and no text/aria-label. Search, promo, and sheet callers do not supply a label to it; this leaves those close controls without a source-defined accessible name.
- **Promo load failure:** failed image cancels popup readiness without user-facing feedback or retry. This is source behavior, not an assumed design.
- **Error section has two min-height utilities:** `min-h-dvh` and `min-h-[60dvh]` are both in one class string; intended priority is not stated.
- **Sheet animation specifics:** Menu defines slide-up/down keyframes but does not apply their classes directly. Vaul is used and globally overridden to 200ms; exact drag threshold/transform curves are not in Menu source.
- **SearchField clear button:** clear `Button` has no explicit `onPress`; it is nested inside React Aria SearchField, but no explicit call to clear query is authored by this feature.
- **ProductSheet is informational/configurational:** footer displays total or disabled out-of-stock action; no add-to-cart/checkout action appears in the Menu sheet.
- **`sheets.close` and `search.close` are defined but not passed/rendered by the visible components inspected.** Close buttons do not consume those strings.
- **Card action classes have no hover/pressed styling** (only focus-visible); do not add a pressed/hover card treatment unless changing the source design.
- **`MenuReady` section scroll margin is 104px while navigation computes header height + 16px (normally 120px).** Programmatic scroll uses the hook’s computed offset; section `scroll-mt-26` is not used by that manual `window.scrollTo`.
- **Arabic typography fallback is declared and Cairo is imported by `src/main.tsx`; only the Montserrat face declarations are explicit in `src/index.css`.** Cairo font file loading behavior comes from the package import.
- **No in-scope component uses success/error theme colors**, although both tokens are defined.
