import mark from "@/assets/mark.svg";
import { useStrings } from "@/shared/i18n";
import { strings } from "../strings";

export function Brand() {
  const s = useStrings(strings);

  return (
    <div className="flex items-center gap-2.5">
      <img src={mark} alt="" draggable={false} className="h-8 w-auto" />
      <span className="text-heading font-bold text-navy">{s.appName}</span>
    </div>
  );
}
