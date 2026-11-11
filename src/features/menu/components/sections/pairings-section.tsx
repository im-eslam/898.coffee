import { Button } from "react-aria-components";
import { useLocale, useStrings } from "@/shared/i18n";
import { Icon } from "@/shared/icons";
import { strings, useMoney } from "../../strings";
import type { Pairing } from "../../types/menu-models";
import {
  cardSurface,
  Chevron,
  Chip,
  cx,
  Img,
  pagePadding,
  pageWidth,
  Price,
  SectionHead,
} from "../ui";

interface Props {
  pairings: Pairing[];
  onOpen: (pairing: Pairing) => void;
}

const styles = {
  section: "scroll-mt-26 pt-6 pb-5",
  inner: cx(pageWidth, "flex flex-col gap-4"),
  head: pagePadding,
  rail: "no-scrollbar flex snap-x gap-3 overflow-x-auto overscroll-x-contain px-4 pb-1 scroll-ps-4 md:grid md:snap-none md:grid-cols-2 md:overflow-visible md:px-6 lg:grid-cols-3",
  slot: "w-[80%] min-w-72 shrink-0 snap-start md:w-auto md:min-w-0",
} as const;

export function PairingsSection({ pairings, onOpen }: Props) {
  const t = useStrings(strings);

  return (
    <section
      id="pairings"
      aria-label={t.pairingsTitle}
      className={styles.section}
    >
      <div className={styles.inner}>
        <div className={styles.head}>
          <SectionHead title={t.pairingsTitle} sub={t.pairingsSub} />
        </div>
        <div className={styles.rail}>
          {pairings.map((pairing) => (
            <div key={pairing.id} className={styles.slot}>
              <PairingCard pairing={pairing} onOpen={onOpen} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const cardStyles = {
  root: cx(cardSurface, "flex h-full w-full flex-col gap-2 p-2"),
  pictures: "relative flex aspect-2/1 w-full gap-1",
  picture: "flex-1 rounded-md",
  grayscale: "grayscale",
  plus: "absolute inset-0 m-auto flex size-8 items-center justify-center rounded-full border-2 border-white bg-brand text-white",
  plusIcon: "size-4",
  savings: "absolute end-2 top-2",
  names: "flex min-w-0 flex-col px-2 text-small font-semibold text-balance",
  bottom: "mt-auto flex items-center gap-2 px-2 pt-1 pb-2",
  unavailable: "opacity-60",
  chevron: "ms-auto",
} as const;

function PairingCard({
  pairing,
  onOpen,
}: {
  pairing: Pairing;
  onOpen: (pairing: Pairing) => void;
}) {
  const t = useStrings(strings);
  const locale = useLocale();
  const money = useMoney();
  const { final, price, discount } = pairing.pricing;
  const hasSavings = discount > 0;
  const available = pairing.items.every(
    (product) => product.availability === "in_stock"
  );

  return (
    <Button onPress={() => onOpen(pairing)} className={cardStyles.root}>
      <span className={cardStyles.pictures}>
        {pairing.items.map((product) => (
          <Img
            key={product.id}
            image={product.image}
            className={cx(
              cardStyles.picture,
              product.availability === "out_of_stock" && cardStyles.grayscale
            )}
          />
        ))}
        <span aria-hidden="true" className={cardStyles.plus}>
          <Icon name="plus" className={cardStyles.plusIcon} />
        </span>
        {hasSavings && available && (
          <span className={cardStyles.savings}>
            <Chip kind="savings" compact outlined>
              {t.saveChip(money(discount))}
            </Chip>
          </span>
        )}
      </span>
      <span className={cardStyles.names}>
        {pairing.items.map((product, i) => (
          <span key={product.id}>
            {i > 0 && "+ "}
            {product.name[locale]}
          </span>
        ))}
      </span>
      <span
        className={cx(cardStyles.bottom, !available && cardStyles.unavailable)}
      >
        <Price value={final} size="small" />
        {hasSavings && (
          <Price value={price} size="caption" struck showCurrency={false} />
        )}
        <span className={cardStyles.chevron}>
          <Chevron small />
        </span>
      </span>
    </Button>
  );
}
