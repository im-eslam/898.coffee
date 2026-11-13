import mark from "@/assets/mark.svg";
import { useStrings } from "@/shared/i18n";
import { strings } from "../strings";

const styles = {
  container: "flex items-center gap-2.5",
  logo: "h-8 w-auto",
  text: "text-heading font-bold text-navy",
} as const;

export function Brand() {
  const s = useStrings(strings);

  return (
    <div className={styles.container}>
      <img src={mark} alt="" draggable={false} className={styles.logo} />
      <span className={styles.text}>{s.appName}</span>
    </div>
  );
}
