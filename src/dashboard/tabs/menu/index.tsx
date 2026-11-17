import { MenuShell } from "./components/shell/menu-shell";
import { MenuProvider } from "./hooks/use-menu-context";

const styles = {
  page: "flex w-full flex-col gap-5",
} as const;

export function MenuPage() {
  return (
    <MenuProvider>
      <div className={styles.page}>
        <MenuShell />
      </div>
    </MenuProvider>
  );
}
