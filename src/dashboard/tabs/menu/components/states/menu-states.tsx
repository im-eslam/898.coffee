import { Button } from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { primaryButton, stateText } from "../ui/styles";
import { StateCard } from "./state-card";
import { strings } from "../../strings";

export function MenuLoading() {
  const s = useStrings(strings);
  return (
    <StateCard>
      <p role="status" className={stateText}>
        {s.page.loading}
      </p>
    </StateCard>
  );
}

export function MenuLoadError({ onRetry }: { onRetry: () => void }) {
  const s = useStrings(strings);
  return (
    <StateCard>
      <p role="alert" className={stateText}>
        {s.page.loadFailed}
      </p>
      <Button className={primaryButton} onPress={onRetry}>
        {s.page.retry}
      </Button>
    </StateCard>
  );
}
