import { useStrings } from "@/shared/i18n";
import type { Pairing } from "@/features/menu/types/menu-models";
import { strings } from "@/features/menu/strings";
import { SectionHeading } from "../ui/section-heading";
import { PairingCard } from "./pairing-card";

interface PairingsSectionProps {
  pairings: Pairing[];
  currency: string;
  onOpenPairing: (pairing: Pairing) => void;
}

const styles = {
  section: "scroll-mt-28 pt-6 pb-5",
  inner: "mx-auto flex w-full max-w-5xl flex-col gap-4",
  head: "px-4 md:px-6",
  rail: "no-scrollbar flex snap-x gap-3 overflow-x-auto overscroll-x-contain px-4 pb-1 scroll-ps-4 md:grid md:snap-none md:grid-cols-2 md:overflow-visible md:px-6 lg:grid-cols-3",
  slot: "w-[80%] min-w-72 shrink-0 snap-start md:w-auto md:min-w-0",
} as const;

export function PairingsSection({
  pairings,
  currency,
  onOpenPairing,
}: PairingsSectionProps) {
  const t = useStrings(strings);

  return (
    <section
      id="pairings"
      aria-label={t.sections.pairings.title}
      className={styles.section}
    >
      <div className={styles.inner}>
        <div className={styles.head}>
          <SectionHeading
            title={t.sections.pairings.title}
            subtitle={t.sections.pairings.subtitle}
          />
        </div>

        <div className={styles.rail}>
          {pairings.map((pairing) => (
            <div key={pairing.id} className={styles.slot}>
              <PairingCard
                pairing={pairing}
                currency={currency}
                onPress={() => onOpenPairing(pairing)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
