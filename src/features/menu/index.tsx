import { useState } from "react";
import {
  Badge,
  Chevron,
  Heading,
  Img,
  MenuButton,
  Price,
  Swap,
} from "./components/ui";

const strings = {
  title: "Menu UI playground",
  subtitle: "Check the components before connecting the menu logic.",
  badges: "Badges",
  headings: "Headings",
  buttons: "Buttons",
  prices: "Prices",
  images: "Images",
  chevrons: "Chevrons",
  interaction: "Interactive test",
  top: "Bestseller",
  new: "New",
  outOfStock: "Out of stock",
  detail: "Serves two",
  savings: "Save 20%",
  primary: "Primary button",
  secondary: "Secondary button",
  compact: "Compact button",
  short: "Short button",
  disabled: "Disabled button",
  close: "Close",
  add: "Add item",
  remove: "Remove item",
  reset: "Reset",
  toggleStock: "Toggle availability",
} as const;

const styles = {
  page: "mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 md:px-6",
  intro: "flex flex-col gap-2",
  title: "text-title font-bold text-charcoal",
  subtitle: "text-small text-navy/80",

  section:
    "flex flex-col gap-5 rounded-lg border border-white/50 bg-white/80 p-5 md:p-6",
  row: "flex flex-wrap items-center gap-3",
  stack: "flex flex-col gap-3",
  grid: "grid gap-5 sm:grid-cols-2",
  imageGrid: "grid gap-5 sm:grid-cols-3",

  label: "text-small font-semibold text-navy",
  hint: "text-caption text-navy/75",
  image: "aspect-[4/3] w-full rounded-md",

  buttonDemo: "flex max-w-md flex-col gap-3",
  footerDemo: "w-full max-w-md",
  feedback: "min-h-6 text-small text-navy",

  summary:
    "flex flex-wrap items-center justify-between gap-4 rounded-md bg-cream p-4",
  quantity: "inline-flex items-center gap-2 text-body text-navy",
  quantityNumber: "min-w-6 justify-center font-bold tabular-nums",
} as const;

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function formatMoney(value: number, plus = false) {
  return `${plus ? "+" : ""}${currencyFormatter.format(value)}`;
}

// Local image fixture: no external image service required.
const previewImage = `data:image/svg+xml,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <rect width="800" height="600" fill="#cfe3e8" />
    <circle cx="400" cy="300" r="190" fill="#f3ebdd" />
    <circle cx="400" cy="300" r="145" fill="#d8c8b2" />
    <rect x="285" y="245" width="230" height="110" rx="55" fill="#005569" />
    <text
      x="400"
      y="310"
      text-anchor="middle"
      font-family="sans-serif"
      font-size="32"
      font-weight="bold"
      fill="#ffffff"
    >
      Menu preview
    </text>
  </svg>
`)}`;

// Intentionally invalid image data to exercise the error state.
const brokenImage = "data:image/png;base64,not-a-valid-image";

const ITEM_PRICE = 24;

export function MenuPage() {
  const [quantity, setQuantity] = useState(1);
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [feedback, setFeedback] = useState("No button pressed yet.");

  const total = quantity * ITEM_PRICE;

  function reset() {
    setQuantity(1);
    setIsOutOfStock(false);
    setFeedback("Test state reset.");
  }

  return (
    <main className={styles.page}>
      <header className={styles.intro}>
        <h1 className={styles.title}>{strings.title}</h1>
        <p className={styles.subtitle}>{strings.subtitle}</p>
      </header>

      {/* Badge kinds, sizes, outlines, and wrapping */}
      <section className={styles.section}>
        <Heading>{strings.badges}</Heading>

        <div className={styles.row}>
          <Badge kind="top">{strings.top}</Badge>
          <Badge kind="new">{strings.new}</Badge>
          <Badge kind="outOfStock">{strings.outOfStock}</Badge>
          <Badge>{strings.detail}</Badge>
          <Badge kind="savings">{strings.savings}</Badge>
        </div>

        <div className={styles.row}>
          <Badge kind="top" compact>
            {strings.top}
          </Badge>

          <Badge kind="new" compact>
            {strings.new}
          </Badge>

          <Badge kind="outOfStock" compact>
            {strings.outOfStock}
          </Badge>

          <Badge compact outlined>
            {strings.detail}
          </Badge>

          <Badge kind="savings" compact outlined>
            {strings.savings}
          </Badge>
        </div>

        <Badge className="max-w-64">
          A longer detail label to check wrapping within a narrow space.
        </Badge>
      </section>

      {/* Section and sheet heading variants */}
      <section className={styles.section}>
        <Heading>{strings.headings}</Heading>

        <div className={styles.grid}>
          <Heading sub="Supporting text beneath a section heading.">
            Section heading
          </Heading>

          <div className={styles.stack}>
            <Heading variant="sheet">Sheet heading</Heading>
            <p className={styles.hint}>
              Title preview only — this is not an actual drawer.
            </p>
          </div>
        </div>
      </section>

      {/* Button variants and interaction states */}
      <section className={styles.section}>
        <Heading sub="Try mouse, touch, and keyboard interactions.">
          {strings.buttons}
        </Heading>

        <div className={styles.buttonDemo}>
          <MenuButton onPress={() => setFeedback("Primary button pressed.")}>
            {strings.primary}
          </MenuButton>

          <MenuButton
            compact
            onPress={() => setFeedback("Compact button pressed.")}
          >
            {strings.compact}
          </MenuButton>

          <MenuButton
            short
            onPress={() => setFeedback("Short button pressed.")}
          >
            {strings.short}
          </MenuButton>

          <MenuButton isDisabled>{strings.disabled}</MenuButton>
        </div>

        <div className={styles.row}>
          <MenuButton
            width="auto"
            onPress={() => setFeedback("Auto-width button pressed.")}
          >
            Auto width
          </MenuButton>

          <MenuButton
            variant="secondary"
            onPress={() => setFeedback("Secondary button pressed.")}
          >
            {strings.secondary}
          </MenuButton>

          <MenuButton variant="secondary" isDisabled>
            {strings.disabled}
          </MenuButton>

          <MenuButton
            variant="close"
            label={strings.close}
            onPress={() => setFeedback("Close button pressed.")}
          />

          <MenuButton
            variant="close"
            label="Close small preview"
            small
            onPress={() => setFeedback("Small close button pressed.")}
          />

          <MenuButton
            variant="close"
            label="Disabled close preview"
            isDisabled
          />
        </div>

        <p role="status" className={styles.feedback}>
          {feedback}
        </p>
      </section>

      {/* Price sizes, discount behavior, and currency options */}
      <section className={styles.section}>
        <Heading>{strings.prices}</Heading>

        <div className={styles.row}>
          <Price value={24} size="caption" formatMoney={formatMoney} />
          <Price value={24} size="small" formatMoney={formatMoney} />
          <Price value={24} size="body" formatMoney={formatMoney} />
          <Price value={24} size="heading" formatMoney={formatMoney} />
        </div>

        <div className={styles.grid}>
          <div className={styles.stack}>
            <p className={styles.label}>Discounted</p>
            <Price value={24} regular={30} formatMoney={formatMoney} />
          </div>

          <div className={styles.stack}>
            <p className={styles.label}>Equal prices — no strike-through</p>
            <Price value={24} regular={24} formatMoney={formatMoney} />
          </div>

          <div className={styles.stack}>
            <p className={styles.label}>Additional cost</p>
            <Price value={5} plus formatMoney={formatMoney} />
          </div>

          <div className={styles.stack}>
            <p className={styles.label}>Without currency</p>
            <Price value={24} showCurrency={false} formatMoney={formatMoney} />
          </div>
        </div>
      </section>

      {/* Loaded, absent, and broken images */}
      <section className={styles.section}>
        <Heading>{strings.images}</Heading>

        <div className={styles.imageGrid}>
          <div className={styles.stack}>
            <Img
              image={previewImage}
              alt="Illustrated menu preview"
              priority
              className={styles.image}
            />
            <p className={styles.label}>Loaded image</p>
          </div>

          <div className={styles.stack}>
            <Img image={null} className={styles.image} />
            <p className={styles.label}>No image</p>
          </div>

          <div className={styles.stack}>
            <Img image={brokenImage} alt="" className={styles.image} />
            <p className={styles.label}>Broken image</p>
          </div>
        </div>
      </section>

      {/* Chevron sizes */}
      <section className={styles.section}>
        <Heading>{strings.chevrons}</Heading>

        <div className={styles.row}>
          <Chevron small />
          <Chevron compact />
          <Chevron />
        </div>
      </section>

      {/* Shared state exercises Price, Swap, Badge, Img, and MenuButton */}
      <section className={styles.section}>
        <Heading sub="Change the quantity to test rolling prices and swap animations.">
          {strings.interaction}
        </Heading>

        <div className={styles.summary}>
          <div className={styles.quantity}>
            <span>Quantity:</span>

            <Swap value={quantity} className={styles.quantityNumber}>
              {quantity}
            </Swap>
          </div>

          <Price
            value={total}
            size="heading"
            rolling
            formatMoney={formatMoney}
          />

          <Swap value={isOutOfStock}>
            <Badge kind={isOutOfStock ? "outOfStock" : "new"}>
              {isOutOfStock ? strings.outOfStock : strings.new}
            </Badge>
          </Swap>

          <Badge kind={isOutOfStock ? "outOfStock" : "new"}>
              {isOutOfStock ? strings.outOfStock : strings.new}
            </Badge>
        </div>

        <div className={styles.row}>
          <MenuButton
            width="auto"
            short
            isDisabled={isOutOfStock}
            onPress={() => setQuantity((current) => current + 1)}
          >
            {strings.add}
          </MenuButton>

          <MenuButton
            variant="secondary"
            isDisabled={quantity <= 1}
            onPress={() => setQuantity((current) => Math.max(1, current - 1))}
          >
            {strings.remove}
          </MenuButton>

          <MenuButton
            variant="secondary"
            onPress={() => setIsOutOfStock((current) => !current)}
          >
            {strings.toggleStock}
          </MenuButton>

          <MenuButton variant="secondary" onPress={reset}>
            {strings.reset}
          </MenuButton>
        </div>

        <div className={styles.footerDemo}>
          <Price variant="bar" value={total} formatMoney={formatMoney} />
        </div>

        <div className={styles.stack}>
          <Img
            image={isOutOfStock ? null : previewImage}
            alt="Illustrated menu preview"
            className={`${styles.image} max-w-xs`}
          />

          <p className={styles.hint}>
            Toggle availability to check image changes and loading-state resets.
          </p>
        </div>
      </section>
    </main>
  );
}

export default MenuPage;
